"""
ingest_caselaw.py
==================
Production Ingestion Pipeline for Landmark & Recent Case Law Dataset.
Ingests validated, deduplicated Indian Supreme Court and High Court judgments
into ChromaDB collection 'dhaara_case_law' with progress logging and resume capability.
"""

import os
import sys
import json
import re
import time
from pathlib import Path
from typing import List, Dict, Any, Tuple
from collections import Counter

ROOT_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT_DIR / "src"))

import chromadb
from embed_store import LegalEmbedStore, DEFAULT_DB_PATH
from chunker import split_text_by_tokens

DATA_PATH = ROOT_DIR / "data" / "train.jsonl"
PROGRESS_FILE = ROOT_DIR / "data" / "ingestion_progress.json"
COLLECTION_NAME = "dhaara_case_law"


def normalize_title(petitioner: str, respondent: str, fallback_text: str = "") -> str:
    """Generates a clean standardized case title."""
    pet = (petitioner or "").strip()
    resp = (respondent or "").strip()
    if pet and resp:
        return f"{pet} v. {resp}"
    if pet:
        return f"{pet} v. State"
    # Fallback to first non-empty line of text
    lines = [l.strip() for l in fallback_text.split("\n") if l.strip()]
    if lines:
        cleaned = re.sub(r'^(ORIGINAL JURISDICTION|CRIMINAL APPELLATE JURISDICTION|CIVIL APPELLATE JURISDICTION)[:\s-]*', '', lines[0], flags=re.I).strip()
        if len(cleaned) > 5:
            return cleaned[:100]
    return "Judicial Precedent"


def extract_acts_and_sections(extractions: Dict[str, Any]) -> Tuple[str, str, str]:
    """Extracts acts, sections, and articles as comma-separated strings."""
    acts_list = []
    sections_list = []
    articles_list = []

    sec_data = extractions.get("sections", {})
    by_act = sec_data.get("by_act", {})
    for act, secs in by_act.items():
        acts_list.append(act)
        for s in secs:
            if "article" in act.lower() or "constitution" in act.lower():
                articles_list.append(f"Article {s}")
            else:
                sections_list.append(f"{act} Sec {s}")

    return ", ".join(acts_list[:5]), ", ".join(sections_list[:8]), ", ".join(articles_list[:5])


def select_key_chunks(text: str, chunk_size: int = 500, overlap: int = 100, max_chunks: int = 3) -> List[Dict[str, Any]]:
    """
    Chunks judgment text and selects the most substantive semantic chunks:
    1. Introduction/Facts
    2. Substantive Legal Reasoning
    3. Final Order / Holding
    """
    raw_chunks = split_text_by_tokens(text, chunk_size=chunk_size, overlap=overlap)
    if not raw_chunks:
        return []

    if len(raw_chunks) <= max_chunks:
        for idx, c in enumerate(raw_chunks, 1):
            c["structural_section"] = "Substantive Discussion" if idx > 1 else "Case Facts & Issues"
        return raw_chunks

    # High-signal selection:
    # Chunk 0: Facts/Context
    # Middle chunk: Ratio/Reasoning
    # Last chunk: Final Order/Disposition
    c0 = raw_chunks[0]
    c0["structural_section"] = "Case Facts & Issues"

    mid_idx = len(raw_chunks) // 2
    c_mid = raw_chunks[mid_idx]
    c_mid["structural_section"] = "Judicial Findings & Analysis"

    c_last = raw_chunks[-1]
    c_last["structural_section"] = "Operative Order & Holding"

    return [c0, c_mid, c_last]


def run_ingestion(batch_size: int = 64, dry_run: bool = False) -> Dict[str, Any]:
    print("=" * 60)
    print(" DhaaraAI Case-Law Dataset Ingestion Pipeline")
    print("=" * 60)

    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

    # 1. Initialize Embed Store & Case Collection
    embed_store = LegalEmbedStore()
    client = embed_store.client

    # Ensure collection exists without deleting existing data
    case_col = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )
    initial_count = case_col.count()
    print(f"[Ingestion] Existing '{COLLECTION_NAME}' collection count: {initial_count}")

    # 2. Load existing metadata for deduplication
    print("[Ingestion] Loading existing case records for deduplication check...")
    import sqlite3
    db_file = Path(DEFAULT_DB_PATH) / "chroma.sqlite3"
    conn = sqlite3.connect(db_file)
    cur = conn.cursor()
    cur.execute("""
        SELECT DISTINCT key, LOWER(TRIM(string_value))
        FROM embedding_metadata 
        WHERE key IN ('case_id', 'case_name', 'citation', 'judgment_id') AND string_value IS NOT NULL
    """)
    rows = cur.fetchall()
    existing_case_ids = set(r[1] for r in rows if r[0] in ('case_id', 'judgment_id'))
    existing_case_names = set(r[1] for r in rows if r[0] == 'case_name')
    existing_citations = set(r[1] for r in rows if r[0] == 'citation')
    conn.close()
    print(f"[Ingestion] Cached {len(existing_case_ids)} case IDs, {len(existing_case_names)} titles, {len(existing_citations)} citations.")

    # 3. Load resume progress if available
    processed_ids = set()
    if PROGRESS_FILE.exists():
        try:
            with open(PROGRESS_FILE, "r", encoding="utf-8") as pf:
                prog = json.load(pf)
                processed_ids = set(prog.get("processed_ids", []))
                print(f"[Ingestion] Resuming from previous run: {len(processed_ids)} judgments already processed.")
        except Exception as e:
            print(f"[Ingestion] Warning reading progress file: {e}")

    # 4. Parse JSONL & Deduplicate
    print(f"[Ingestion] Reading records from {DATA_PATH}...")
    total_records = 0
    sc_records = 0
    hc_records = 0
    duplicates_skipped = 0
    unique_to_ingest = []

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        for line_idx, line in enumerate(f, start=1):
            line_str = line.strip()
            if not line_str:
                continue
            total_records += 1
            try:
                record = json.loads(line_str)
            except Exception as e:
                print(f"[Ingestion] Skipping invalid JSON at line {line_idx}: {e}")
                continue

            meta = record.get("metadata", {})
            court = meta.get("court", "Unknown")
            court_level = meta.get("court_level", "")
            is_sc = (court_level == "SC") or ("supreme" in court.lower())

            if is_sc:
                sc_records += 1
            else:
                hc_records += 1

            jid = (record.get("judgment_id") or "").strip()
            jid_lower = jid.lower()

            # Check if already processed in earlier resume state
            if jid in processed_ids:
                duplicates_skipped += 1
                continue

            # Deduplicate against existing Chroma collection
            c_num = (meta.get("case_number") or "").strip().lower()
            pet = (meta.get("petitioner") or "").strip().lower()
            resp = (meta.get("respondent") or "").strip().lower()
            title = f"{pet} v. {resp}".strip()

            is_dup = False
            if jid_lower and jid_lower in existing_case_ids:
                is_dup = True
            elif c_num and c_num != "unknown" and c_num in existing_citations:
                is_dup = True
            elif title and len(title) > 12 and title in existing_case_names:
                is_dup = True

            if is_dup:
                duplicates_skipped += 1
            else:
                unique_to_ingest.append(record)

    unique_count = len(unique_to_ingest)
    print(f"[Ingestion] Total Records: {total_records} (SC: {sc_records}, HC: {hc_records})")
    print(f"[Ingestion] Duplicates/Already Ingested Skipped: {duplicates_skipped}")
    print(f"[Ingestion] Unique Records to Ingest: {unique_count}")

    if dry_run:
        print("[Ingestion] DRY RUN complete. Exiting without modifying ChromaDB.")
        return {
            "total_records": total_records,
            "sc_records": sc_records,
            "hc_records": hc_records,
            "duplicates_skipped": duplicates_skipped,
            "unique_records": unique_count,
            "chunks_created": 0,
            "final_count": initial_count
        }

    # 5. Process & Ingest Unique Judgments in Batches
    print(f"\n[Ingestion] Starting embedding and upsert pipeline (Batch Size: {batch_size})...")
    total_chunks_created = 0
    start_time = time.time()

    pending_ids = []
    pending_texts = []
    pending_metas = []
    newly_processed_ids = list(processed_ids)

    for idx, judgment in enumerate(unique_to_ingest, start=1):
        jid = judgment.get("judgment_id", f"case_{idx}")
        meta = judgment.get("metadata", {})
        classification = judgment.get("classification", {})
        extractions = judgment.get("extractions", {})
        raw_text = judgment.get("text", "")

        court = meta.get("court", "Indian Court")
        court_level = "SC" if ("supreme" in court.lower() or meta.get("court_level") == "SC") else "HC"
        case_name = normalize_title(meta.get("petitioner"), meta.get("respondent"), raw_text)
        decision_date = meta.get("decision_date") or ""
        year = int(decision_date[:4]) if decision_date and decision_date[:4].isdigit() else 2024
        citation = meta.get("case_number") if (meta.get("case_number") and meta.get("case_number") != "UNKNOWN") else jid

        bench_list = meta.get("bench", [])
        bench_str = ", ".join(bench_list) if isinstance(bench_list, list) else str(bench_list)
        acts_str, sections_str, articles_str = extract_acts_and_sections(extractions)
        domain = classification.get("domain", "General")

        # Select 2 to 3 substantive chunks per case
        case_chunks = select_key_chunks(raw_text, chunk_size=500, overlap=100, max_chunks=3)
        total_chunks = len(case_chunks)

        for c_idx, c in enumerate(case_chunks, start=1):
            struct_sec = c.get("structural_section", "Substantive Discussion")
            chunk_id = f"{jid}_c{c_idx}"
            chunk_body = c["text"]

            # Grounded case precedent document formatting
            doc_text = (
                f"{court} | {case_name} | {citation} | Date: {decision_date} | Section Focus: {struct_sec}\n\n"
                f"{chunk_body}"
            )

            chunk_meta = {
                "case_id": str(jid),
                "case_name": str(case_name)[:200],
                "court": str(court),
                "court_level": str(court_level),
                "citation": str(citation)[:100],
                "judgment_date": str(decision_date),
                "year": int(year),
                "bench": str(bench_str)[:200],
                "acts": str(acts_str)[:200],
                "sections": str(sections_str)[:200],
                "articles": str(articles_str)[:200],
                "landmark_category": str(domain),
                "keywords": str(domain),
                "ratio_summary": f"Precedent on {domain}: {case_name} ({court}).",
                "source": "Landmark & Recent Case Law Dataset",
                "source_type": "case_law",
                "source_url": "",
                "case_type": f"{court_level} Precedent",
                "structural_section": str(struct_sec),
                "total_chunks": int(total_chunks),
                "chunk_index": int(c_idx),
            }

            pending_ids.append(chunk_id)
            pending_texts.append(doc_text)
            pending_metas.append(chunk_meta)

        newly_processed_ids.append(jid)

        # Batch upsert when limit reached or at end
        if len(pending_texts) >= batch_size or idx == unique_count:
            # Embed batch
            batch_embeddings = embed_store.model.encode(pending_texts, convert_to_numpy=True).tolist()
            case_col.upsert(
                ids=pending_ids,
                documents=pending_texts,
                embeddings=batch_embeddings,
                metadatas=pending_metas
            )
            total_chunks_created += len(pending_ids)

            # Persist resume progress
            with open(PROGRESS_FILE, "w", encoding="utf-8") as pf:
                json.dump({"processed_ids": newly_processed_ids, "last_updated": time.time()}, pf)

            elapsed = time.time() - start_time
            rate = total_chunks_created / max(1.0, elapsed)
            print(f"[Ingestion] Processed {idx}/{unique_count} judgments | {total_chunks_created} chunks upserted ({rate:.1f} chunks/sec)")

            pending_ids = []
            pending_texts = []
            pending_metas = []

    final_count = case_col.count()
    duration = time.time() - start_time
    print(f"\n[Ingestion] Completed in {duration:.1f}s!")
    print(f"[Ingestion] Final collection '{COLLECTION_NAME}' count: {final_count} (New chunks: {total_chunks_created})")

    return {
        "total_records": total_records,
        "sc_records": sc_records,
        "hc_records": hc_records,
        "duplicates_skipped": duplicates_skipped,
        "unique_records_ingested": unique_count,
        "chunks_created": total_chunks_created,
        "final_collection_count": final_count,
        "duration_seconds": round(duration, 1)
    }


if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    res = run_ingestion(batch_size=64, dry_run=is_dry)
    print("\nResult Summary:")
    print(json.dumps(res, indent=2))
