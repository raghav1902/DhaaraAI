import json
import sqlite3
from collections import Counter
from pathlib import Path

DATA_FILE = Path("backend/data/train.jsonl")
DB_FILE = Path("backend/chroma_db/chroma.sqlite3")

print("--- Step 1: Parsing & Validating JSONL ---")
total_records = 0
sc_records = 0
hc_records = 0
court_counts = Counter()
empty_text = 0
text_lengths = []
sample_sc = []
sample_hc = []

judgments = []
seen_json_ids = set()
internal_duplicates = 0

with open(DATA_FILE, "r", encoding="utf-8") as f:
    for line_idx, line in enumerate(f):
        if not line.strip():
            continue
        try:
            d = json.loads(line)
        except Exception as e:
            print(f"Error line {line_idx}: {e}")
            continue

        total_records += 1
        jid = d.get("judgment_id", "")
        if jid in seen_json_ids:
            internal_duplicates += 1
        else:
            seen_json_ids.add(jid)

        txt = d.get("text", "").strip()
        if not txt:
            empty_text += 1
            continue

        text_lengths.append(len(txt))
        meta = d.get("metadata", {})
        court = meta.get("court", "Unknown")
        court_level = meta.get("court_level", "")
        court_counts[court] += 1

        is_sc = (court_level == "SC") or ("supreme court" in court.lower())
        if is_sc:
            sc_records += 1
            if len(sample_sc) < 3:
                sample_sc.append(d)
        else:
            hc_records += 1
            if len(sample_hc) < 3:
                sample_hc.append(d)

        judgments.append(d)

print(f"Total valid JSON records: {total_records}")
print(f"Internal duplicate judgment_ids: {internal_duplicates}")
print(f"Empty text records: {empty_text}")
print(f"Supreme Court records: {sc_records}")
print(f"High Court records: {hc_records}")
print(f"Top 5 Courts: {court_counts.most_common(5)}")

print("\n--- Step 2: Comparing with existing ChromaDB ---")
conn = sqlite3.connect(DB_FILE)
cur = conn.cursor()

# Get existing metadata strings
cur.execute("""
    SELECT DISTINCT key, LOWER(TRIM(string_value))
    FROM embedding_metadata 
    WHERE key IN ('case_id', 'case_name', 'citation', 'judgment_id') AND string_value IS NOT NULL
""")
rows = cur.fetchall()
existing_case_ids = set(r[1] for r in rows if r[0] in ('case_id', 'judgment_id'))
existing_case_names = set(r[1] for r in rows if r[0] == 'case_name')
existing_citations = set(r[1] for r in rows if r[0] == 'citation')

print(f"Existing in dhaara_case_law:")
print(f"  Unique case_ids: {len(existing_case_ids)}")
print(f"  Unique case_names: {len(existing_case_names)}")
print(f"  Unique citations: {len(existing_citations)}")

# Deduplicate against existing
external_duplicates = 0
unique_to_ingest = []
duplicate_reasons = Counter()

for j in judgments:
    jid = (j.get("judgment_id") or "").strip().lower()
    meta = j.get("metadata", {})
    c_num = (meta.get("case_number") or "").strip().lower()
    pet = (meta.get("petitioner") or "").strip().lower()
    resp = (meta.get("respondent") or "").strip().lower()
    full_title = f"{pet} v. {resp}".strip()
    
    # Also check title from first line of text if petitioner/respondent empty
    lines = [l.strip().lower() for l in j.get("text", "").split("\n") if l.strip()]
    first_line_title = lines[0][:80] if lines else ""

    is_dup = False
    reason = ""

    if jid and jid in existing_case_ids:
        is_dup = True
        reason = "judgment_id match"
    elif full_title and len(full_title) > 10 and full_title in existing_case_names:
        is_dup = True
        reason = "full_title match"
    elif first_line_title and len(first_line_title) > 15 and first_line_title in existing_case_names:
        is_dup = True
        reason = "first_line_title match"
    elif c_num and c_num != "unknown" and c_num in existing_citations:
        is_dup = True
        reason = "case_number citation match"

    if is_dup:
        external_duplicates += 1
        duplicate_reasons[reason] += 1
    else:
        unique_to_ingest.append(j)

print(f"\nDeduplication Results:")
print(f"  Total duplicate judgments skipped: {external_duplicates}")
print(f"  Duplicate reasons: {dict(duplicate_reasons)}")
print(f"  Total unique judgments to ingest: {len(unique_to_ingest)}")

sc_unique = sum(1 for j in unique_to_ingest if (j.get("metadata", {}).get("court_level") == "SC" or "supreme court" in j.get("metadata", {}).get("court", "").lower()))
hc_unique = len(unique_to_ingest) - sc_unique
print(f"    - Unique Supreme Court: {sc_unique}")
print(f"    - Unique High Court: {hc_unique}")

conn.close()
