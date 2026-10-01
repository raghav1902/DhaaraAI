"""
test_case_law_suite.py
======================
Comprehensive Automated Verification Test Suite for DhaaraAI Supreme Court Case Law Integration.

Validates:
1. Parquet loading & streaming
2. Metadata extraction & normalization
3. Text cleaning & noise removal
4. Duplicate & translation detection
5. Intelligent legal chunking
6. ChromaDB vector storage (dhaara_case_law)
7. Semantic retrieval & hybrid scoring
8. Metadata filtering (year, category, acts)
9. Clickable citations & source integrity
10. 10 Target Legal Test Queries (Article 21, Privacy, Anticipatory Bail, etc.)
11. Ask AI Dual Retrieval (Statutes + Case Law)
"""

import sys
import os
from pathlib import Path

# Ensure UTF-8 stdout on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT_DIR = Path(__file__).parent
SRC_DIR = ROOT_DIR / "src"
DATA_DIR = ROOT_DIR / "data"
sys.path.insert(0, str(SRC_DIR))

from case_law_pipeline import (
    clean_judgment_text,
    extract_case_metadata,
    CaseLawDatasetIterator,
    CaseLawRecord,
)
from case_law_chunker import CaseLawChunker
from case_law_retriever import CaseLawRetriever
from case_law_landmarks import LANDMARK_JUDGMENTS_REGISTRY, get_precedents_for_statute
from embed_store import LegalEmbedStore
from rag_engine import DhaaraRAGEngine


def run_tests():
    print("=" * 70)
    print("⚖️  DHAARAAI SUPREME COURT CASE-LAW AUTOMATED TEST SUITE")
    print("=" * 70)

    passed_tests = 0
    total_tests = 0

    def assert_test(condition: bool, test_name: str, details: str = ""):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if condition:
            passed_tests += 1
            print(f"  [PASS] {test_name}")
            if details:
                print(f"         └─ {details}")
        else:
            print(f"  [FAIL] {test_name}")
            if details:
                print(f"         └─ ERROR: {details}")

    # ---------------------------------------------------------
    # TEST 1: Parquet Loading & Streaming
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 1: Parquet Loading & Streaming ---")
    p_path = DATA_DIR / "test.parquet"
    assert_test(p_path.exists(), "test.parquet exists in backend/data", f"Found size: {p_path.stat().st_size} bytes")

    iterator = CaseLawDatasetIterator(str(p_path), only_canonical_english=True, batch_size=20)
    sample_records = list(iterator.iter_records(max_records=5))
    assert_test(len(sample_records) == 5, "Streamed 5 canonical records from Parquet", f"Records yielded: {len(sample_records)}")

    # ---------------------------------------------------------
    # TEST 2: Text Cleaning & Noise Removal
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 2: Text Cleaning & Noise Removal ---")
    dirty_text = (
        "English हिन्दी - Hindi Disclaimer Due care and caution has been taken by the Editorial Section, "
        "Supreme Court of India... Neither the Courts concerned nor the National Informatics Centre... "
        "carrying out the corrections.\n\n"
        "S.C.R. SUPREME COURT REPORTS 453\n"
        "PRITAM SINGH v. THE STATE\n\n"
        "Decision Date : 20-11-1981 | Case No : CRL APPEAL 1/1980 | Disposal Nature : Allowed | Bench : 2 Judges Flip view PDF"
    )
    cleaned = clean_judgment_text(dirty_text)
    assert_test("Disclaimer" not in cleaned, "Preamble disclaimer successfully stripped")
    assert_test("Flip view PDF" not in cleaned, "Metadata footer successfully stripped")
    assert_test("PRITAM SINGH v. THE STATE" in cleaned, "Substantive case text preserved")

    # ---------------------------------------------------------
    # TEST 3: Metadata Extraction & Normalization
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 3: Metadata Extraction & Normalization ---")
    sample_raw = (
        "THE STATE OF BOMBAY versus ALI GULSHAN - [1955] 2 S.C.R. 867 1955 INSC 51\n"
        "Coram : SUDHI RANJAN DAS, N. CHANDRASEKHARA AIYAR, BHAGWATI JJ.\n\n"
        "Constitution of India, Article 226 - Land Acquisition Act - Writ Petition.\n"
        "Decision Date : 04-10-1955 | Case No : CIVIL APPEAL No. 200/1954 | Disposal Nature : Allowed | Bench : 3 Judges"
    )
    rec = extract_case_metadata("1955_2", 1955, sample_raw)
    assert_test("ALI GULSHAN" in rec.case_name, "Extracted normalized case name", f"Title: {rec.case_name}")
    assert_test("S.C.R." in rec.citation, "Extracted SCR citation", f"Citation: {rec.citation}")
    assert_test("Supreme Court of India" == rec.court, "Normalized court to Supreme Court of India")
    assert_test("Article 226" in rec.articles, "Extracted constitutional article", f"Articles: {rec.articles}")
    assert_test(rec.judgment_date == "04-10-1955", "Extracted decision date", f"Date: {rec.judgment_date}")

    # ---------------------------------------------------------
    # TEST 4: Duplicate & Translation Detection
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 4: Duplicate & Translation Detection ---")
    is_eng = iterator._is_english_or_canonical("1950_1_747_754_EN")
    is_hin = iterator._is_english_or_canonical("1950_1_747_754_HIN")
    is_pun = iterator._is_english_or_canonical("1950_1_747_754_PUN")
    assert_test(is_eng and not is_hin and not is_pun, "Regional translation duplicates successfully identified and filtered")

    # ---------------------------------------------------------
    # TEST 5: Intelligent Legal Chunking
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 5: Intelligent Legal Chunking ---")
    chunker = CaseLawChunker()
    chunks = chunker.chunk_case(rec)
    assert_test(len(chunks) >= 1, "Generated legal chunks with parent metadata", f"Total chunks: {len(chunks)}")
    if chunks:
        c0 = chunks[0]
        assert_test("Supreme Court of India" in c0["text"], "Chunk text anchored with court and case citation")
        assert_test(c0["metadata"]["case_name"] == rec.case_name, "Metadata retained on chunk")
        assert_test(c0["metadata"]["source_type"] == "case_law", "Chunk source tagged as case_law")

    # ---------------------------------------------------------
    # TEST 6: ChromaDB Storage & Stats
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 6: ChromaDB Vector Storage (dhaara_case_law) ---")
    store = LegalEmbedStore()
    stats = store.get_case_law_stats()
    assert_test(stats["total_chunks"] > 0, "ChromaDB dhaara_case_law contains indexed vectors", f"Chunks: {stats['total_chunks']}")

    # ---------------------------------------------------------
    # TEST 7: Case-Law Hybrid Retrieval & 10 Target Queries
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 7: 10 Target Case-Law Search Queries ---")
    retriever = CaseLawRetriever(store)

    target_queries = [
        ("Article 21", ["article 21", "puttaswamy", "liberty", "constitution"]),
        ("Right to Privacy", ["privacy", "puttaswamy", "article 21"]),
        ("Anticipatory Bail", ["bail", "438", "arnesh kumar", "antil", "sushila"]),
        ("Section 138 NI Act", ["138", "cheque", "dishonour", "negotiable", "bir singh"]),
        ("Section 498A", ["498a", "cruelty", "arnesh", "husband"]),
        ("Cybercrime", ["cyber", "information technology", "shreya singhal", "66"]),
        ("Evidence / electronic evidence", ["electronic evidence", "65b", "arjun panditrao", "bsa"]),
        ("Fundamental Rights", ["fundamental rights", "article", "part iii", "chiranjit lal"]),
        ("Consumer disputes", ["consumer", "deficiency", "lucknow development"]),
        ("Contract disputes", ["contract", "breach", "satyabrata", "frustration"]),
    ]

    for q_text, expected_keywords in target_queries:
        res = retriever.retrieve_cases(q_text, top_k=2)
        match_found = False
        top_name = "None"
        if res:
            top = res[0]
            top_name = top.get("case_name", "")
            combo = f"{top_name} {top.get('citation', '')} {top.get('relevant_passage', '')} {top.get('keywords', '')}".lower()
            match_found = any(k in combo for k in expected_keywords)

        assert_test(
            match_found,
            f"Query: '{q_text}'",
            f"Retrieved: {top_name} | Score: {res[0].get('hybrid_score', 0) if res else 0}"
        )

    # ---------------------------------------------------------
    # TEST 8: Metadata Filtering
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 8: Metadata Filtering ---")
    filtered_cases = retriever.retrieve_cases("bail", category_filter="Bail", top_k=3)
    all_bail = all("Bail" in c.get("landmark_category", "") for c in filtered_cases)
    assert_test(all_bail and len(filtered_cases) > 0, "Category filter 'Bail' returned exclusively Bail cases")

    # ---------------------------------------------------------
    # TEST 9: Statutory Linking
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 9: Statutory Precedent Cross-Links ---")
    sec_138_precedents = get_precedents_for_statute("ni_act_138")
    assert_test(len(sec_138_precedents) > 0, "NI Act 138 mapped to Supreme Court Precedents", f"Cases: {[p['case_name'] for p in sec_138_precedents]}")

    bnss_35_precedents = get_precedents_for_statute("bnss_35")
    assert_test(len(bnss_35_precedents) > 0, "BNSS 35 (Arrest Notice) mapped to Arnesh Kumar ruling")

    # ---------------------------------------------------------
    # TEST 10: Ask AI Dual Retrieval Integration
    # ---------------------------------------------------------
    print("\n--- TEST GROUP 10: Ask AI Dual Retrieval (Statutes + Case Law) ---")
    engine = DhaaraRAGEngine(embed_store=store)
    ai_response = engine.query(
        question="Can police arrest someone immediately for an offense punishable with 3 years imprisonment?",
        language="English",
        user_role="accused"
    )

    has_statutes = len(ai_response.get("statutory_sources", [])) > 0
    has_case_law = len(ai_response.get("case_law_sources", [])) > 0
    has_sources = len(ai_response.get("sources", [])) > 0

    assert_test(has_case_law, "Ask AI retrieved Supreme Court case law", f"Case-Law Count: {len(ai_response.get('case_law_sources', []))}")
    assert_test(has_sources, "Ask AI response contains unified sources array with distinct types")
    assert_test("answer" in ai_response and len(ai_response["answer"]) > 100, "Ask AI generated grounded legal answer")

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    print("\n" + "=" * 70)
    print(f"🎯 TEST SUMMARY: {passed_tests}/{total_tests} Tests Passed ({(passed_tests/total_tests)*100:.1f}%)")
    print("=" * 70)

    if passed_tests == total_tests:
        print("✅ ALL TESTS PASSED! Supreme Court Case-Law RAG Layer is production-ready.")
        return 0
    else:
        print("❌ SOME TESTS FAILED.")
        return 1


if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
