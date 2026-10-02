"""
test_phase2_suite.py
====================
Comprehensive Test Suite for DhaaraAI Phase 2:
- Legal Draft Templates (12 high-frequency Indian templates)
- Dynamic template fields & bilingual generation
- Legal Glossary (150+ terms across 14+ legal domains)
- Ask AI multi-layer knowledge routing (Statutory, Case Law, Templates, Glossary)
- Word/PDF export data integrity
"""

import sys
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
SRC_DIR = BACKEND_DIR / "src"
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(SRC_DIR))

import draft_templates
import legal_glossary
from rag_engine import DhaaraRAGEngine
from fastapi.testclient import TestClient
from main import app


class TestLegalDraftTemplates(unittest.TestCase):
    def test_all_12_templates_loaded(self):
        templates = draft_templates.get_all_templates()
        self.assertEqual(len(templates), 12, "Must contain exactly 12 high-frequency legal templates")

    def test_template_required_metadata_fields(self):
        required_keys = [
            "template_id", "title", "category", "description",
            "legal_basis", "relevant_act", "relevant_sections",
            "required_fields", "required_documents", "legal_disclaimer"
        ]
        for tmpl in draft_templates.get_all_templates():
            for key in required_keys:
                self.assertIn(key, tmpl, f"Template {tmpl.get('template_id')} missing {key}")
                self.assertTrue(tmpl[key], f"Template {tmpl.get('template_id')} has empty {key}")

    def test_template_ids_retrievable(self):
        expected_ids = [
            "rti_application", "legal_demand_notice", "cheque_bounce_notice",
            "bail_application", "anticipatory_bail_application", "consumer_complaint",
            "maintenance_application", "general_affidavit", "fir_application",
            "reply_legal_notice", "rent_lease_notice", "general_petition"
        ]
        for tid in expected_ids:
            tmpl = draft_templates.get_template_by_id(tid)
            self.assertIsNotNone(tmpl, f"Failed to retrieve template: {tid}")
            self.assertEqual(tmpl["template_id"], tid)

    def test_template_generation_english(self):
        # 1. Cheque Bounce Notice
        d1 = draft_templates.generate_template_draft(
            template_id="cheque_bounce_notice",
            is_hindi=False,
            complainant={"name": "Alok Gupta", "address": "Delhi"},
            accused={"name": "Rohit Verma", "address": "Jaipur"},
            incident_datetime="2026-09-20",
            incident_location="Delhi",
            facts="Cheque bounced for non-payment",
            evidence="Return memo",
            relief="Pay within 15 days",
            sections="Section 138 NI Act",
            extra_fields={"cheque_number": "998877", "cheque_amount": "₹1,50,000/-"}
        )
        self.assertIn("SECTION 138", d1)
        self.assertIn("998877", d1)
        self.assertIn("1,50,000", d1)
        self.assertIn("15 (fifteen) calendar days", d1)

        # 2. Bail Application
        d2 = draft_templates.generate_template_draft(
            template_id="bail_application",
            is_hindi=False,
            complainant={"name": "Sunil Kumar", "address": "Noida"},
            accused={"name": "State of UP"},
            incident_datetime="2026-09-22",
            incident_location="Noida",
            facts="Falsely implicated in FIR",
            evidence="Clean record",
            relief="Grant regular bail",
            sections="Section 480 BNSS 2023",
            extra_fields={"court_name": "Court of Sessions Judge, Gautam Buddh Nagar", "fir_number": "302/2026"}
        )
        self.assertIn("REGULAR BAIL", d2)
        self.assertIn("480", d2)
        self.assertIn("302/2026", d2)

        # 3. RTI Application
        d3 = draft_templates.generate_template_draft(
            template_id="rti_application",
            is_hindi=False,
            complainant={"name": "Deepak Mehta", "address": "Mumbai"},
            accused={"name": "Municipal Corporation of Greater Mumbai"},
            incident_datetime="2026-09-24",
            incident_location="Mumbai",
            facts="Information regarding tender allocation",
            evidence="IPO 45F",
            relief="Furnish certified copies",
            sections="Section 6(1) RTI Act",
            extra_fields={"period_of_info": "2025-2026", "fee_receipt": "IPO-98124"}
        )
        self.assertIn("RIGHT TO INFORMATION", d3)
        self.assertIn("6(1)", d3)
        self.assertIn("Deepak Mehta", d3)

    def test_template_generation_hindi(self):
        # 1. Hindi Cheque Notice
        d1 = draft_templates.generate_template_draft(
            template_id="cheque_bounce_notice",
            is_hindi=True,
            complainant={"name": "अमित शर्मा"},
            accused={"name": "विकास गुप्ता"},
            incident_datetime="21-09-2026",
            incident_location="जयपुर",
            facts="व्यावसायिक देनदारी हेतु दिया गया चेक बाउंस हुआ",
            evidence="बैंक मेमो",
            relief="15 दिन में भुगतान करें",
            sections="धारा 138 पराक्राम्य लिखत अधिनियम",
            extra_fields={"cheque_number": "123456", "cheque_amount": "₹3,00,000/-"}
        )
        self.assertIn("धारा 138", d1)
        self.assertIn("123456", d1)
        self.assertIn("15", d1)
        self.assertIn("अमित शर्मा", d1)

        # 2. Hindi Bail Application
        d2 = draft_templates.generate_template_draft(
            template_id="bail_application",
            is_hindi=True,
            complainant={"name": "राजेश कुमार"},
            accused={"name": "राज्य"},
            incident_datetime="22-09-2026",
            incident_location="लखनऊ",
            facts="अभियुक्त निर्दोष है",
            evidence="मेडिकल रिपोर्ट",
            relief="जमानत प्रदान की जाए",
            sections="धारा 480 BNSS 2023",
            extra_fields={"court_name": "न्यायालय सत्र न्यायाधीश, लखनऊ", "fir_number": "FIR 89/2026"}
        )
        self.assertIn("जमानत", d2)
        self.assertIn("480", d2)
        self.assertIn("राजेश कुमार", d2)


class TestLegalGlossary(unittest.TestCase):
    def test_glossary_term_count_exceeds_150(self):
        terms = legal_glossary.get_all_terms()
        self.assertGreaterEqual(len(terms), 150, "Legal glossary must contain at least 150 useful terms")

    def test_glossary_categories(self):
        cats = legal_glossary.get_categories()
        expected = [
            "Criminal Law", "Civil Law", "Constitutional Law", "Court Procedure",
            "Bail", "Appeals", "Limitation", "Property Law", "Family Law",
            "Consumer Law", "Cyber Law", "Evidence", "Contract Law"
        ]
        for c in expected:
            self.assertTrue(any(c.lower() in existing.lower() for existing in cats), f"Category {c} missing in glossary")

    def test_glossary_search(self):
        # Search for bail
        bail_results = legal_glossary.search_glossary("bail")
        self.assertGreater(len(bail_results), 0)
        self.assertTrue(any("bail" in t["term"].lower() for t in bail_results))

        # Search for caveat
        caveat_results = legal_glossary.search_glossary("caveat")
        self.assertGreater(len(caveat_results), 0)
        self.assertEqual(caveat_results[0]["id"], "caveat")

        # Search for hindi term
        fir_results = legal_glossary.search_glossary("प्राथमिकी")
        self.assertGreater(len(fir_results), 0)

    def test_glossary_entry_fields(self):
        for t in legal_glossary.get_all_terms():
            self.assertIn("id", t)
            self.assertIn("term", t)
            self.assertIn("simple_en_explanation", t)
            self.assertIn("simple_hi_explanation", t)
            self.assertIn("legal_context", t)
            self.assertIn("category", t)
            self.assertIn("related_acts", t)
            self.assertIn("related_sections", t)


class TestAskAIKnowledgeRouting(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = DhaaraRAGEngine()

    def test_draft_template_routing(self):
        res = self.engine.query("Make a cheque bounce notice")
        self.assertTrue(len(res["sources"]) > 0)
        first_src = res["sources"][0]
        self.assertEqual(first_src.get("source_type"), "Draft Template")
        self.assertIn("Cheque Bounce", first_src.get("section_title", ""))

    def test_bail_template_routing(self):
        res = self.engine.query("Draft a bail application for sessions court")
        self.assertTrue(len(res["sources"]) > 0)
        first_src = res["sources"][0]
        self.assertEqual(first_src.get("source_type"), "Draft Template")
        self.assertIn("Bail", first_src.get("section_title", ""))

    def test_glossary_definition_routing(self):
        res = self.engine.query("What does cognizance mean?")
        self.assertTrue(len(res["sources"]) > 0)
        first_src = res["sources"][0]
        self.assertEqual(first_src.get("source_type"), "Legal Glossary")
        self.assertIn("Cognizance", first_src.get("section_title", ""))

    def test_glossary_caveat_routing(self):
        res = self.engine.query("What is caveat?")
        self.assertTrue(len(res["sources"]) > 0)
        first_src = res["sources"][0]
        self.assertEqual(first_src.get("source_type"), "Legal Glossary")
        self.assertIn("Caveat", first_src.get("section_title", ""))

    def test_case_law_routing(self):
        res = self.engine.query("What did the Supreme Court say about Section 41A arrest in Arnesh Kumar?")
        self.assertTrue(len(res["sources"]) > 0)
        first_src = res["sources"][0]
        self.assertEqual(first_src.get("source_type"), "Case Law")

    def test_statutory_routing(self):
        res = self.engine.query("What is BNS Section 318?")
        self.assertTrue(len(res["sources"]) > 0)
        first_src = res["sources"][0]
        self.assertEqual(first_src.get("source_type"), "Statutory Sources")


class TestPhase2FastAPIRoutes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_get_templates_list(self):
        resp = self.client.get("/api/draft/templates")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("total"), 12)
        self.assertEqual(len(data.get("templates")), 12)

    def test_get_single_template(self):
        resp = self.client.get("/api/draft/templates/cheque_bounce_notice")
        self.assertEqual(resp.status_code, 200)
        tmpl = resp.json()
        self.assertEqual(tmpl.get("template_id"), "cheque_bounce_notice")
        self.assertIn("138", tmpl.get("relevant_sections"))

    def test_get_glossary_endpoint(self):
        resp = self.client.get("/api/glossary?limit=100")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertGreaterEqual(data.get("total"), 50)
        self.assertGreaterEqual(len(data.get("categories")), 10)

    def test_get_glossary_single_term(self):
        resp = self.client.get("/api/glossary/anticipatory_bail")
        self.assertEqual(resp.status_code, 200)
        term = resp.json()
        self.assertEqual(term.get("id"), "anticipatory_bail")
        self.assertIn("482", str(term.get("related_sections")))

    def test_draft_post_with_extra_fields(self):
        payload = {
            "document_type": "Cheque Bounce Notice (Section 138 NI Act)",
            "language": "English",
            "complainant": {"name": "Pooja Sharma", "address": "Jaipur"},
            "accused": {"name": "Rohan Mehra", "address": "Delhi"},
            "facts": "Dishonour of business cheque",
            "evidence": "Return memo dated 15-09-2026",
            "relief_sought": "Payment of Rs 5,00,000",
            "extra_fields": {
                "cheque_number": "543210",
                "cheque_amount": "₹5,00,000/-",
                "bank_name": "State Bank of India",
                "memo_date": "16-09-2026",
                "memo_reason": "Funds Insufficient"
            }
        }
        resp = self.client.post("/api/draft", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get("success"))
        self.assertIn("543210", data.get("draft"))


if __name__ == "__main__":
    unittest.main()
