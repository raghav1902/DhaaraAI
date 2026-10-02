"""
test_caselaw_suite.py
======================
Unit & Integration Test Suite for DhaaraAI Case-Law Engine:
- Validates dhaara_case_law collection integrity.
- Tests Supreme Court (SC) and High Court (HC) retrieval.
- Tests query_case_law with real legal queries (bail, quashing, cheating).
- Tests Ask AI statutory + case law dual retrieval in RAG Engine.
"""

import sys
import unittest
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
SRC_DIR = BACKEND_DIR / "src"
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(SRC_DIR))

from embed_store import LegalEmbedStore
from rag_engine import DhaaraRAGEngine


class TestCaseLawEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.store = LegalEmbedStore()
        cls.case_col = cls.store.client.get_collection("dhaara_case_law")

    def test_case_law_collection_exists_and_populated(self):
        count = self.case_col.count()
        self.assertGreater(count, 66106, "Collection must contain new ingested judgments")

    def test_query_case_law_returns_records(self):
        results = self.store.query_case_law("Bail application under Section 439 CrPC or BNSS 483", top_k=3)
        self.assertTrue(len(results) > 0, "Should retrieve case law chunks for bail query")
        first = results[0]
        self.assertIn("case_name", first)
        self.assertIn("citation", first)
        self.assertIn("court", first)
        self.assertIn("court_level", first)
        self.assertIn("similarity_score", first)
        self.assertIn(first["court_level"], ["SC", "HC"])

    def test_supreme_court_precedent_retrieval(self):
        results = self.store.query_case_law("Right to privacy Article 21 Constitution of India", top_k=5)
        self.assertTrue(len(results) > 0)
        has_sc = any(r.get("court_level") == "SC" or "supreme" in r.get("court", "").lower() for r in results)
        self.assertTrue(has_sc, "Should retrieve at least one Supreme Court precedent for constitutional privacy query")

    def test_high_court_precedent_retrieval(self):
        results = self.store.query_case_law("Allahabad High Court bail petition or quashing under 482", top_k=5)
        self.assertTrue(len(results) > 0)
        has_hc = any(r.get("court_level") == "HC" or "high court" in r.get("court", "").lower() for r in results)
        self.assertTrue(has_hc, "Should retrieve High Court precedents for High Court query")

    def test_rag_dual_retrieval(self):
        rag = DhaaraRAGEngine(embed_store=self.store)
        # Test case law prompt formatting
        case_chunks = self.store.query_case_law("cheating under section 420 IPC or 318(4) BNS", top_k=2)
        ctx = rag._format_case_law_chunks(case_chunks, "cheating under section 420 IPC")
        self.assertIn("Judicial Precedent Record", ctx)
        self.assertIn("Case Name:", ctx)
        self.assertIn("Court:", ctx)


if __name__ == "__main__":
    unittest.main()
