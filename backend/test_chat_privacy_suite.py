"""
test_chat_privacy_suite.py
===========================
Mandatory Privacy & Cross-User Isolation Test Suite for DhaaraAI Chat History.
Verifies all 10 security & isolation guarantees specified in Section 17.

Tests:
- TEST 1: User A creates Conversation A. User B requests list. Conv A MUST NOT appear.
- TEST 2: User B attempts GET /api/conversations/{UserAConvId}. Result: 404 Not Found / Access Denied.
- TEST 3: User B attempts to rename User A's conversation. Result: 404 / 401 fail.
- TEST 4: User B attempts to delete User A's conversation. Result: 404 / 401 fail.
- TEST 5: User B attempts to add a message to User A's conversation. Result: 404 / 401 fail.
- TEST 6: Search by User B MUST NEVER return User A's conversation.
- TEST 7: User A can see and continue their own conversations.
- TEST 8: Starting New Chat creates a separate unique ID without leaking old messages.
- TEST 9: Switching between two conversations does not mix messages.
- TEST 10: Manual conversation ID modification / tampering cannot bypass backend ownership checks.
"""

import sys
from pathlib import Path
import unittest

ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR / "src"))

from fastapi.testclient import TestClient
from main import app
import chat_history_db

class TestChatPrivacyAndIsolation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        
        # Register User A
        reg_a = cls.client.post("/api/auth/register", json={
            "email": "usera_test@dhaara.ai",
            "password": "PasswordA123!",
            "name": "Advocate User A"
        })
        if reg_a.status_code == 400: # Already exists, login
            log_a = cls.client.post("/api/auth/login", json={
                "email": "usera_test@dhaara.ai",
                "password": "PasswordA123!"
            })
            cls.user_a = log_a.json()
        else:
            cls.user_a = reg_a.json()
            
        cls.headers_a = {"Authorization": f"Bearer {cls.user_a['token']}"}
        
        # Register User B
        reg_b = cls.client.post("/api/auth/register", json={
            "email": "userb_test@dhaara.ai",
            "password": "PasswordB456!",
            "name": "Advocate User B"
        })
        if reg_b.status_code == 400: # Already exists, login
            log_b = cls.client.post("/api/auth/login", json={
                "email": "userb_test@dhaara.ai",
                "password": "PasswordB456!"
            })
            cls.user_b = log_b.json()
        else:
            cls.user_b = reg_b.json()
            
        cls.headers_b = {"Authorization": f"Bearer {cls.user_b['token']}"}

    def test_01_user_b_list_does_not_contain_user_a_conversation(self):
        """TEST 1: User A creates Conversation A. User B requests list. Conv A MUST NOT appear."""
        # User A creates a conversation
        res_a = self.client.post(
            "/api/conversations",
            json={"title": "User A Private Cheque Matter"},
            headers=self.headers_a
        )
        self.assertEqual(res_a.status_code, 200)
        conv_a_id = res_a.json()["id"]

        # User B requests conversation list
        res_b = self.client.get("/api/conversations", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 200)
        b_convs = res_b.json()
        b_ids = [c["id"] for c in b_convs]

        self.assertNotIn(conv_a_id, b_ids, "CRITICAL PRIVACY VIOLATION: User A conversation leaked in User B list!")

    def test_02_user_b_direct_get_user_a_conversation_blocked(self):
        """TEST 2: User B attempts GET /api/conversations/{UserAConvId}. Result: 404 Access Denied."""
        res_a = self.client.post(
            "/api/conversations",
            json={"title": "User A Confidential Bail Petition"},
            headers=self.headers_a
        )
        conv_a_id = res_a.json()["id"]

        # User B tries direct IDOR access
        res_b = self.client.get(f"/api/conversations/{conv_a_id}", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 404, f"IDOR Vulnerability: Expected 404, got {res_b.status_code}")
        self.assertNotIn("User A Confidential Bail Petition", res_b.text)

    def test_03_user_b_rename_user_a_conversation_blocked(self):
        """TEST 3: User B attempts to rename User A's conversation. Operation MUST fail."""
        res_a = self.client.post(
            "/api/conversations",
            json={"title": "Original Title User A"},
            headers=self.headers_a
        )
        conv_a_id = res_a.json()["id"]

        # User B attempts rename
        res_b = self.client.patch(
            f"/api/conversations/{conv_a_id}",
            json={"title": "Hacked by User B"},
            headers=self.headers_b
        )
        self.assertEqual(res_b.status_code, 404)

        # Verify title remains unchanged for User A
        verify_a = self.client.get(f"/api/conversations/{conv_a_id}", headers=self.headers_a)
        self.assertEqual(verify_a.json()["title"], "Original Title User A")

    def test_04_user_b_delete_user_a_conversation_blocked(self):
        """TEST 4: User B attempts to delete User A's conversation. Operation MUST fail."""
        res_a = self.client.post(
            "/api/conversations",
            json={"title": "Important Document User A"},
            headers=self.headers_a
        )
        conv_a_id = res_a.json()["id"]

        # User B attempts delete
        res_b = self.client.delete(f"/api/conversations/{conv_a_id}", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 404)

        # Verify conversation still exists and accessible for User A
        verify_a = self.client.get(f"/api/conversations/{conv_a_id}", headers=self.headers_a)
        self.assertEqual(verify_a.status_code, 200)

    def test_05_user_b_add_message_to_user_a_conversation_blocked(self):
        """TEST 5: User B attempts to add a message to User A's conversation. Operation MUST fail."""
        res_a = self.client.post(
            "/api/conversations",
            json={"title": "Arbitration Dispute User A"},
            headers=self.headers_a
        )
        conv_a_id = res_a.json()["id"]

        # User B attempts to inject a message
        res_b = self.client.post(
            f"/api/conversations/{conv_a_id}/messages",
            json={"role": "user", "content": "Injected malicious text by User B"},
            headers=self.headers_b
        )
        self.assertEqual(res_b.status_code, 404)

        # Verify User A's conversation has 0 messages
        verify_a = self.client.get(f"/api/conversations/{conv_a_id}", headers=self.headers_a)
        self.assertEqual(len(verify_a.json()["messages"]), 0)

    def test_06_search_by_user_b_never_returns_user_a_conversation(self):
        """TEST 6: Search by User B must NEVER return User A's conversation."""
        # User A creates a conversation with a secret token
        secret_keyword = "XSecretSharmaContract99X"
        res_a = self.client.post(
            "/api/conversations",
            json={"title": f"Matter with {secret_keyword}"},
            headers=self.headers_a
        )
        conv_a_id = res_a.json()["id"]
        
        # User A adds a message with that keyword
        self.client.post(
            f"/api/conversations/{conv_a_id}/messages",
            json={"role": "user", "content": f"Confidential dispute regarding {secret_keyword}"},
            headers=self.headers_a
        )

        # User B searches for that keyword
        search_res = self.client.get(f"/api/conversations/search?q={secret_keyword}", headers=self.headers_b)
        self.assertEqual(search_res.status_code, 200)
        results = search_res.json()
        self.assertEqual(len(results), 0, "SEARCH LEAK: User B search returned User A's private conversation!")

    def test_07_user_a_can_see_and_continue_own_conversations(self):
        """TEST 7: User A can see and continue their own conversations."""
        res_a = self.client.post(
            "/api/conversations",
            json={"title": "Civil Appeal Consultation"},
            headers=self.headers_a
        )
        conv_id = res_a.json()["id"]

        # Add message 1
        msg1 = self.client.post(
            f"/api/conversations/{conv_id}/messages",
            json={"role": "user", "content": "What is the limitation period for civil appeal?"},
            headers=self.headers_a
        )
        self.assertEqual(msg1.status_code, 200)

        # Add message 2 (assistant)
        msg2 = self.client.post(
            f"/api/conversations/{conv_id}/messages",
            json={"role": "assistant", "content": "Under Article 116 Limitation Act, it is 90 days to High Court."},
            headers=self.headers_a
        )
        self.assertEqual(msg2.status_code, 200)

        # Fetch conversation
        conv_data = self.client.get(f"/api/conversations/{conv_id}", headers=self.headers_a).json()
        self.assertEqual(len(conv_data["messages"]), 2)
        self.assertEqual(conv_data["messages"][0]["content"], "What is the limitation period for civil appeal?")

    def test_08_new_chat_creates_clean_isolated_context(self):
        """TEST 8: Starting New Chat creates a clean conversation without leaking old messages."""
        conv1 = self.client.post("/api/conversations", json={"title": "Chat 1"}, headers=self.headers_a).json()
        self.client.post(
            f"/api/conversations/{conv1['id']}/messages",
            json={"role": "user", "content": "Old secret message"},
            headers=self.headers_a
        )

        # Create New Chat
        conv2 = self.client.post("/api/conversations", json={"title": "Chat 2"}, headers=self.headers_a).json()
        self.assertNotEqual(conv1["id"], conv2["id"])
        
        # Verify conv2 has empty messages
        conv2_data = self.client.get(f"/api/conversations/{conv2['id']}", headers=self.headers_a).json()
        self.assertEqual(len(conv2_data["messages"]), 0)

    def test_09_switching_conversations_does_not_mix_messages(self):
        """TEST 9: Switching between two conversations does not mix messages."""
        c1 = self.client.post("/api/conversations", json={"title": "Tenant Law"}, headers=self.headers_a).json()
        c2 = self.client.post("/api/conversations", json={"title": "Cyber Fraud"}, headers=self.headers_a).json()

        self.client.post(
            f"/api/conversations/{c1['id']}/messages",
            json={"role": "user", "content": "Tenant rent deposit issue"},
            headers=self.headers_a
        )
        self.client.post(
            f"/api/conversations/{c2['id']}/messages",
            json={"role": "user", "content": "Phishing OTP refund issue"},
            headers=self.headers_a
        )

        c1_fetch = self.client.get(f"/api/conversations/{c1['id']}", headers=self.headers_a).json()
        c2_fetch = self.client.get(f"/api/conversations/{c2['id']}", headers=self.headers_a).json()

        self.assertIn("Tenant rent deposit issue", [m["content"] for m in c1_fetch["messages"]])
        self.assertNotIn("Phishing OTP refund issue", [m["content"] for m in c1_fetch["messages"]])

        self.assertIn("Phishing OTP refund issue", [m["content"] for m in c2_fetch["messages"]])
        self.assertNotIn("Tenant rent deposit issue", [m["content"] for m in c2_fetch["messages"]])

    def test_10_tampered_conversation_id_in_query_fails_ownership_check(self):
        """TEST 10: Modifying conversation_id in /api/query to another user's ID fails with 404."""
        # User A creates a conversation
        c_a = self.client.post("/api/conversations", json={"title": "Private User A Room"}, headers=self.headers_a).json()
        conv_a_id = c_a["id"]

        # User B sends a query passing User A's conversation ID
        query_attack = self.client.post(
            "/api/query",
            json={
                "question": "Give me legal advice",
                "conversation_id": conv_a_id
            },
            headers=self.headers_b
        )
        self.assertEqual(query_attack.status_code, 404, "SECURITY ERROR: Cross-user conversation hijacking was not blocked!")

    def test_11_refresh_persistence_across_new_client_sessions(self):
        """TEST 11: Simulates browser refresh: new client session still loads saved conversations and messages."""
        # User A creates conversation and messages
        conv = self.client.post("/api/conversations", json={"title": "Persisted Case"}, headers=self.headers_a).json()
        self.client.post(
            f"/api/conversations/{conv['id']}/messages",
            json={"role": "user", "content": "Evidence submission details"},
            headers=self.headers_a
        )
        
        # Simulate browser refresh with a completely fresh client instance
        fresh_client = TestClient(app)
        reloaded_list = fresh_client.get("/api/conversations", headers=self.headers_a).json()
        reloaded_ids = [c["id"] for c in reloaded_list]
        self.assertIn(conv["id"], reloaded_ids)

        reloaded_conv = fresh_client.get(f"/api/conversations/{conv['id']}", headers=self.headers_a).json()
        self.assertEqual(reloaded_conv["title"], "Persisted Case")
        self.assertEqual(len(reloaded_conv["messages"]), 1)
        self.assertEqual(reloaded_conv["messages"][0]["content"], "Evidence submission details")

if __name__ == "__main__":
    unittest.main()
