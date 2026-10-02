import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(BACKEND_DIR / "src"))

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

import draft_templates
import legal_glossary
from rag_engine import DhaaraRAGEngine

def main():
    print("==================================================")
    print("DHAARA AI PHASE 2 VERIFICATION RUNNER")
    print("==================================================")

    # 1. 5 different legal templates in English and Hindi
    print("\n[1] Testing 5 Legal Templates (English & Hindi generation)...")
    templates_to_test = [
        "cheque_bounce_notice",
        "bail_application",
        "rti_application",
        "consumer_complaint",
        "maintenance_application"
    ]
    for tid in templates_to_test:
        tmpl = draft_templates.get_template_by_id(tid)
        en_draft = draft_templates.generate_template_draft(
            tid,
            is_hindi=False,
            complainant={"name": "Aman Verma", "address": "Jaipur"},
            accused={"name": "Rajesh Sharma", "address": "Delhi"},
            facts="Specific factual background of dispute",
            relief_sought="Immediate statutory relief and damages"
        )
        hi_draft = draft_templates.generate_template_draft(
            tid,
            is_hindi=True,
            complainant={"name": "अमन वर्मा", "address": "जयपुर"},
            accused={"name": "राजेश शर्मा", "address": "दिल्ली"},
            facts="विवाद की विशिष्ट तथ्यात्मक पृष्ठभूमि",
            relief_sought="तत्काल विधिक उपचार एवं क्षतिपूर्ति"
        )
        print(f"  ✓ {tmpl['title']} -> EN: {len(en_draft)} chars | HI: {len(hi_draft)} chars")
        assert len(en_draft) > 500, f"EN draft too short for {tid}"
        assert len(hi_draft) > 500, f"HI draft too short for {tid}"
        assert "AI-assisted draft" in en_draft or "verify facts" in en_draft.lower()

    # 2. Legal Glossary search and filtering
    print("\n[2] Testing Legal Glossary (155 Terms, Search, Category Filter)...")
    total_terms = len(legal_glossary.get_all_terms())
    categories = legal_glossary.get_categories()
    g_bail = legal_glossary.search_glossary("bail")
    g_caveat = legal_glossary.search_glossary("caveat")
    g_fir_hi = legal_glossary.search_glossary("प्राथमिकी")
    g_crim = legal_glossary.search_glossary("", category="Criminal Law")

    print(f"  ✓ Total Glossary Terms: {total_terms} (Requirement: >= 150)")
    print(f"  ✓ Categories: {len(categories)} categories")
    print(f"  ✓ 'bail' search matched: {len(g_bail)} entries")
    print(f"  ✓ 'caveat' search matched: {len(g_caveat)} entries (Top ID: {g_caveat[0]['id']})")
    print(f"  ✓ 'प्राथमिकी' (Hindi) matched: {len(g_fir_hi)} entries (Top ID: {g_fir_hi[0]['id']})")
    print(f"  ✓ Category 'Criminal Law' matched: {len(g_crim)} entries")
    assert total_terms >= 150
    assert len(g_bail) > 0 and len(g_caveat) > 0 and len(g_fir_hi) > 0

    # 3. Ask AI Knowledge Routing
    print("\n[3] Testing Ask AI Multi-Layer Knowledge Routing...")
    rag = DhaaraRAGEngine()

    # Layer 1: Draft Template
    q_draft = rag.query("Make a cheque bounce notice")
    src1 = q_draft["sources"][0]
    print(f"  ✓ Drafting Query   -> Source: '{src1['source_type']}' | Title: '{src1['section_title']}'")
    assert src1["source_type"] == "Draft Template"

    # Layer 2: Legal Glossary
    q_gloss = rag.query("What does cognizance mean?")
    src2 = q_gloss["sources"][0]
    print(f"  ✓ Glossary Query   -> Source: '{src2['source_type']}' | Title: '{src2['section_title']}'")
    assert src2["source_type"] == "Legal Glossary"

    # Layer 3: Statutory Sources
    q_stat = rag.query("What is BNS Section 318?")
    src3 = q_stat["sources"][0]
    print(f"  ✓ Statutory Query  -> Source: '{src3['source_type']}' | Title: '{src3['section_title']}'")
    assert src3["source_type"] == "Statutory Sources"

    # Layer 4: Case Law
    q_case = rag.query("What did the Supreme Court say about Section 41A arrest in Arnesh Kumar?")
    src4 = q_case["sources"][0]
    print(f"  ✓ Case Law Query   -> Source: '{src4['source_type']}' | Title: '{src4['section_title']}'")
    assert src4["source_type"] == "Case Law"

    print("\n==================================================")
    print("ALL 13 VERIFICATION CRITERIA PASSED CLEANLY!")
    print("==================================================")

if __name__ == "__main__":
    main()
