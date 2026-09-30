"""
test_backend_suite.py
=====================
Automated Test Suite for DhaaraAI (LegalGPT) Backend APIs.
Tests concordance lookups, RAG offline fallback, statutory library, and draft generator.
"""

import sys
import unittest
from pathlib import Path

# Add backend and src to sys.path
BACKEND_DIR = Path(__file__).resolve().parent
SRC_DIR = BACKEND_DIR / "src"
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(SRC_DIR))

from src.concordance_data import CONCORDANCE_DB
from src.bns_concordance import diagnose_situation, get_transition_alert
from src.draft_templates import generate_fallback_draft
from src.contract_analyzer import heuristic_contract_analysis
from src.rag_offline_fallbacks import generate_offline_concordance_fallback

class TestConcordanceData(unittest.TestCase):
    def test_database_not_empty(self):
        self.assertGreater(len(CONCORDANCE_DB), 10, "Concordance database should contain core sections")

    def test_key_fields_present_in_all_mappings(self):
        for item in CONCORDANCE_DB:
            self.assertIn("bns_section", item, "bns_section missing")
            self.assertIn("ipc_section", item, "ipc_section missing")
            self.assertIn("nature", item, "nature missing")
            self.assertIn("bailable", item, "bailable classification missing")

    def test_theft_concordance(self):
        diagnosis = diagnose_situation("Incident of theft someone committed chori")
        crimes = diagnosis.get("matched_crimes", [])
        self.assertTrue(any("303" in c.get("bns_section", "") for c in crimes), "Theft should diagnose BNS 303")

    def test_cheating_fraud_concordance(self):
        diagnosis = diagnose_situation("UPI fraud someone tricked me to send money")
        crimes = diagnosis.get("matched_crimes", [])
        self.assertTrue(any("318" in c.get("bns_section", "") for c in crimes), "Fraud should diagnose BNS 318")

class TestTransitionAlerts(unittest.TestCase):
    def test_transition_rule(self):
        alert = get_transition_alert()
        self.assertIn("rule_en", alert)
        self.assertIn("1 July 2024", alert["rule_en"])

class TestDraftGenerator(unittest.TestCase):
    def test_fallback_fir_draft(self):
        draft = generate_fallback_draft(
            document_type="FIR Application",
            is_hindi=False,
            complainant={"name": "Rahul Verma", "phone": "9876543210"},
            accused={"name": "Unknown"},
            incident_datetime="2026-09-25",
            incident_location="New Delhi",
            facts="Rs 50000 debited fraudulently via phishing link",
            evidence="Bank SMS, UTR receipt",
            relief="Freeze account and register FIR",
            sections="BNS 318(4)"
        )
        self.assertIn("SECTION 173", draft)
        self.assertIn("Rahul Verma", draft)
        self.assertIn("50000", draft)

class TestContractAnalyzerHeuristics(unittest.TestCase):
    def test_predatory_rental_clause(self):
        predatory_text = "The landlord may terminate at any time without notice and forfeit the entire deposit."
        analysis = heuristic_contract_analysis(predatory_text, doc_type="Rental / Lease Agreement", is_hindi=False)
        self.assertIn("risk_score", analysis)
        self.assertIn("red_flags", analysis)
        self.assertGreater(len(analysis["red_flags"]), 0, "Should detect predatory rental clauses")

class TestRAGOfflineFallback(unittest.TestCase):
    def test_offline_response_generation(self):
        resp = generate_offline_concordance_fallback(
            question="Cheque bounced due to insufficient funds",
            user_role="general",
            reason="Offline verification mode",
            language="English"
        )
        self.assertIn("Statutory", resp)
        self.assertIn("138", resp)

class TestFastAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from fastapi.testclient import TestClient
        from main import app
        cls.client = TestClient(app)

    def test_health_check_endpoint(self):
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "ok")

    def test_converter_endpoint(self):
        resp = self.client.get("/api/converter?query=theft")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("mappings", data)
        self.assertGreater(data.get("total", 0), 0)

    def test_library_endpoint(self):
        resp = self.client.get("/api/library")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("items", data)
        self.assertIn("categories", data)

    def test_upload_text_document(self):
        import io
        file_content = b"This agreement is made between Tenant and Landlord for apartment rent."
        file_obj = io.BytesIO(file_content)
        resp = self.client.post(
            "/api/upload-document",
            files={"file": ("test_lease.txt", file_obj, "text/plain")}
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("filename"), "test_lease.txt")
        self.assertIn("Tenant and Landlord", data.get("text", ""))

    def test_query_endpoint(self):
        payload = {
            "question": "What is the punishment for cheating under BNS?",
            "language": "English",
            "user_role": "general"
        }
        resp = self.client.post("/api/query", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("answer", data)
        self.assertIn("concordance", data)
        self.assertIn("question", data)

    def test_draft_endpoint(self):
        payload = {
            "document_type": "FIR Application",
            "language": "English",
            "complainant": {"name": "Test Citizen", "phone": "9999999999"},
            "accused": {"name": "Unknown Person"},
            "incident_category": "Theft",
            "incident_datetime": "2026-09-28",
            "incident_location": "Metro Station",
            "facts": "Mobile phone picked from pocket",
            "evidence": "CCTV available",
            "relief_sought": "Lodge FIR"
        }
        resp = self.client.post("/api/draft", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get("success"))
        self.assertIn("draft", data)

    def test_helplines_endpoint(self):
        resp = self.client.get("/api/helplines")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "success")
        self.assertGreater(data.get("total", 0), 3)

    def test_guidelines_endpoint(self):
        resp = self.client.get("/api/guidelines")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "success")
        self.assertIn("arrest_notice_rules", data.get("guidelines", {}))

    def test_court_fee_calculator_property(self):
        payload = {
            "category": "property",
            "state": "Delhi",
            "property_value": 5000000,
            "gender": "male"
        }
        resp = self.client.post("/api/calculate-court-fee", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("category"), "property")
        self.assertGreater(data.get("total_outlay", 0), 0)

    def test_court_fee_calculator_court(self):
        payload = {
            "category": "court",
            "suit_value": 1000000
        }
        resp = self.client.post("/api/calculate-court-fee", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("category"), "court")
        self.assertGreater(data.get("court_fee", 0), 0)

    def test_cyber_check_query_endpoint(self):
        resp = self.client.get("/api/cyber-check?email=safe_test_user_nobody_12345@example.com")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("status", data)

    def test_cyber_check_path_alias(self):
        resp = self.client.get("/api/xposed/check-email/safe_test_user_nobody_12345@example.com")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("status", data)

if __name__ == "__main__":
    unittest.main()
