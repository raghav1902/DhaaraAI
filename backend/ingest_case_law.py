"""
ingest_case_law.py
==================
Production Ingestion Script for Supreme Court Case Law in DhaaraAI.
Processes the Parquet dataset from backend/data, normalizes metadata,
removes extraction noise, deduplicates translations, applies legal chunking,
and indexes vectors into ChromaDB's dedicated 'dhaara_case_law' collection.

Usage Examples:
---------------
1. Fast Representative Sample Ingestion:
   python ingest_case_law.py --sample

2. Ingest up to 500 Judgments:
   python ingest_case_law.py --limit 500

3. Full Ingestion:
   python ingest_case_law.py --full

4. View Collection Stats:
   python ingest_case_law.py --stats
"""

import sys
import os
import json
import argparse
import time
from pathlib import Path
from typing import Dict, Any, List

# Ensure utf-8 stdout for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Ensure src/ is on sys.path
CURRENT_DIR = Path(__file__).parent
SRC_DIR = CURRENT_DIR / "src"
DATA_DIR = CURRENT_DIR / "data"
sys.path.insert(0, str(SRC_DIR))

from case_law_pipeline import CaseLawDatasetIterator, extract_case_metadata, CaseLawRecord
from case_law_chunker import CaseLawChunker
from case_law_landmarks import LANDMARK_JUDGMENTS_REGISTRY
from embed_store import LegalEmbedStore

CHECKPOINT_FILE = DATA_DIR / "case_law_checkpoint.json"


def load_checkpoint() -> Dict[str, Any]:
    if CHECKPOINT_FILE.exists():
        try:
            with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "processed_case_ids": [],
        "total_judgments_processed": 0,
        "unique_judgments": 0,
        "duplicate_judgments": 0,
        "total_chunks_indexed": 0,
        "category_counts": {},
        "last_updated": ""
    }


def save_checkpoint(cp: Dict[str, Any]):
    cp["last_updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
    with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
        json.dump(cp, f, indent=2)


def run_ingestion(
    parquet_files: List[Path],
    limit: int = 100,
    batch_size: int = 64,
    reset: bool = False,
    is_sample: bool = False
):
    print("=" * 65)
    print("📜 DHAARAAI SUPREME COURT CASE-LAW INGESTION PIPELINE")
    print("=" * 65)

    store = LegalEmbedStore()
    if reset:
        print("[ingest] Resetting existing 'dhaara_case_law' collection...")
        store.reset_case_law_collection()

    checkpoint = load_checkpoint() if not reset else {
        "processed_case_ids": [],
        "total_judgments_processed": 0,
        "unique_judgments": 0,
        "duplicate_judgments": 0,
        "total_chunks_indexed": 0,
        "category_counts": {},
        "last_updated": ""
    }
    processed_set = set(checkpoint.get("processed_case_ids", []))

    chunker = CaseLawChunker()

    total_inspected = 0
    unique_ingested = 0
    duplicates_detected = 0
    chunks_accumulated = []
    total_chunks_indexed = checkpoint.get("total_chunks_indexed", 0)
    category_counts = checkpoint.get("category_counts", {})

    start_time = time.time()

    # 1. Seed Curated Landmark Registry first
    print("\n[Step 1/3] Indexing Curated Landmark Judgments Layer...")
    for lm in LANDMARK_JUDGMENTS_REGISTRY:
        if lm["cnr"] in processed_set:
            continue
        dummy_rec = CaseLawRecord(
            case_id=lm["cnr"],
            case_name=lm["case_name"],
            court=lm["court"],
            judgment_date=lm["judgment_date"],
            year=int(lm["judgment_date"].split("-")[-1]) if "-" in lm["judgment_date"] else int(lm["judgment_date"]) if lm["judgment_date"].isdigit() else 2020,
            judges=lm["bench"],
            citation=lm["citation"],
            case_type="Landmark Supreme Court Precedent",
            full_text=f"{lm['case_name']}\n{lm['citation']}\n{lm['bench']}\n\nKey Ratio Decidendi:\n{lm['key_ratio']}",
            cleaned_text=f"{lm['case_name']}\n{lm['citation']}\n{lm['bench']}\n\nKey Ratio Decidendi:\n{lm['key_ratio']}",
            source="Supreme Court Reports (Curated Landmark)",
            source_url=lm["source_url"],
            acts=[a.strip() for a in lm["acts"].split(",") if a.strip()],
            sections=[s.strip() for s in lm["sections"].split(",") if s.strip()],
            articles=[art.strip() for art in lm["articles"].split(",") if art.strip()],
            keywords=[lm["category"]],
            landmark_category=lm["category"],
            ratio_summary=lm["key_ratio"]
        )
        lm_chunks = chunker.chunk_case(dummy_rec)
        chunks_accumulated.extend(lm_chunks)
        processed_set.add(lm["cnr"])
        cat = lm["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1
        unique_ingested += 1

    if chunks_accumulated:
        upserted = store.add_case_law_chunks(chunks_accumulated, batch_size=batch_size)
        total_chunks_indexed += upserted
        chunks_accumulated = []

    # 2. Stream Parquet Files
    print("\n[Step 2/3] Streaming Parquet Judgments from backend/data...")
    for p_path in parquet_files:
        if not p_path.exists():
            print(f"Skipping missing file: {p_path}")
            continue

        print(f"\nProcessing Parquet file: {p_path.name}")
        iterator = CaseLawDatasetIterator(str(p_path), only_canonical_english=True, batch_size=batch_size)

        for record in iterator.iter_records(max_records=limit if not is_sample else limit * 2):
            total_inspected += 1

            if record.case_id in processed_set:
                duplicates_detected += 1
                continue

            # Prioritize landmark and domain relevant cases during sample mode
            if is_sample and not record.landmark_category and not record.sections and not record.articles:
                continue

            processed_set.add(record.case_id)
            unique_ingested += 1

            cat = record.landmark_category or "General"
            category_counts[cat] = category_counts.get(cat, 0) + 1

            # Chunk judgment
            case_chunks = chunker.chunk_case(record)
            chunks_accumulated.extend(case_chunks)

            # Flush batch
            if len(chunks_accumulated) >= batch_size:
                upserted = store.add_case_law_chunks(chunks_accumulated, batch_size=batch_size)
                total_chunks_indexed += upserted
                chunks_accumulated = []

                # Periodic checkpoint
                checkpoint["processed_case_ids"] = list(processed_set)
                checkpoint["total_judgments_processed"] = total_inspected
                checkpoint["unique_judgments"] = len(processed_set)
                checkpoint["duplicate_judgments"] = duplicates_detected
                checkpoint["total_chunks_indexed"] = total_chunks_indexed
                checkpoint["category_counts"] = category_counts
                save_checkpoint(checkpoint)

                elapsed = round(time.time() - start_time, 1)
                print(f"  [Progress] Ingested {unique_ingested} judgments | {total_chunks_indexed} chunks indexed ({elapsed}s)")

            if unique_ingested >= limit:
                print(f"\nReached target limit of {limit} unique judgments.")
                break

        if unique_ingested >= limit:
            break

    # Flush remaining chunks
    if chunks_accumulated:
        upserted = store.add_case_law_chunks(chunks_accumulated, batch_size=batch_size)
        total_chunks_indexed += upserted

    # Final Checkpoint Save
    checkpoint["processed_case_ids"] = list(processed_set)
    checkpoint["total_judgments_processed"] = total_inspected
    checkpoint["unique_judgments"] = len(processed_set)
    checkpoint["duplicate_judgments"] = duplicates_detected
    checkpoint["total_chunks_indexed"] = total_chunks_indexed
    checkpoint["category_counts"] = category_counts
    save_checkpoint(checkpoint)

    # 3. Final Summary Report
    elapsed_total = round(time.time() - start_time, 2)
    print("\n" + "=" * 65)
    print("📊 DHAARAAI CASE-LAW INGESTION FINAL REPORT")
    print("=" * 65)
    print(f"Total Judgments Inspected : {total_inspected}")
    print(f"Unique Judgments Indexed  : {len(processed_set)}")
    print(f"Duplicates / Skipped      : {duplicates_detected}")
    print(f"Total Vector Chunks       : {total_chunks_indexed}")
    print(f"Time Taken                : {elapsed_total} seconds")
    print("\nCategory Distribution:")
    for cat, cnt in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  • {cat:<26}: {cnt} judgments")
    print("=" * 65)


def print_stats():
    store = LegalEmbedStore()
    stats = store.get_case_law_stats()
    checkpoint = load_checkpoint()
    print("=" * 55)
    print("📊 DHAARAAI CASE-LAW STORE STATUS")
    print("=" * 55)
    print(f"Collection Name          : {stats['collection_name']}")
    print(f"Indexed Chunks in VectorDB: {stats['total_chunks']}")
    print(f"Unique Judgments in Log  : {checkpoint.get('unique_judgments', 0)}")
    print(f"Category Distribution    :")
    for cat, cnt in sorted(checkpoint.get("category_counts", {}).items(), key=lambda x: x[1], reverse=True):
        print(f"  • {cat:<24}: {cnt}")
    print("=" * 55)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Supreme Court Case Law into DhaaraAI")
    parser.add_argument("--sample", action="store_true", help="Ingest high-priority representative sample across all categories")
    parser.add_argument("--limit", type=int, default=150, help="Maximum number of unique judgments to ingest (default: 150)")
    parser.add_argument("--full", action="store_true", help="Run full corpus ingestion across train/test/val")
    parser.add_argument("--batch-size", type=int, default=64, help="Embedding batch size (default: 64)")
    parser.add_argument("--reset", action="store_true", help="Reset case law collection before ingesting")
    parser.add_argument("--stats", action="store_true", help="Print current case law store statistics and exit")

    args = parser.parse_args()

    if args.stats:
        print_stats()
        sys.exit(0)

    # Ingestion order: test.parquet (5k), validation.parquet (5k), train.parquet (40k)
    p_files = [
        DATA_DIR / "test.parquet",
        DATA_DIR / "validation.parquet",
        DATA_DIR / "train.parquet",
    ]

    limit = 50000 if args.full else (75 if args.sample else args.limit)
    run_ingestion(
        parquet_files=p_files,
        limit=limit,
        batch_size=args.batch_size,
        reset=args.reset,
        is_sample=args.sample or not args.full
    )
