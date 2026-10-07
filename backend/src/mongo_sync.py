"""
mongo_sync.py
==============
Transparent MongoDB Atlas synchronizer for DhaaraAI.
When MONGODB_URI is provided:
- Periodically & on-demand syncs users, conversations, messages, and usage to MongoDB.
- On cold boot, hydrates local SQLite database from MongoDB Atlas.
Provides true persistence across Render episodic disk resets with zero disruption to SQLite queries.
"""

import os
import sqlite3
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any

MONGODB_URI = os.getenv("MONGODB_URI", "").strip()

_mongo_client = None
_mongo_db = None

def get_mongo_db():
    global _mongo_client, _mongo_db
    if not MONGODB_URI:
        return None
    if _mongo_db is not None:
        return _mongo_db
    try:
        from pymongo import MongoClient
        _mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        _mongo_db = _mongo_client.get_database("dhaara_ai_db")
        print("[MongoDB] Connected successfully to MongoDB Atlas.")
        return _mongo_db
    except Exception as e:
        print(f"[MongoDB] Connection warning (falling back to SQLite): {e}")
        return None

def hydrate_sqlite_from_mongo(sqlite_db_path: str):
    """Called on server startup: Pulls existing cloud records into SQLite if local SQLite is fresh."""
    db = get_mongo_db()
    if db is None:
        return

    try:
        conn = sqlite3.connect(sqlite_db_path)
        cursor = conn.cursor()

        # 1. Hydrate Users
        users_col = db["users"]
        for u in users_col.find():
            cursor.execute("""
                INSERT OR REPLACE INTO users (id, email, password_hash, salt, full_name, created_at, plan_type)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (u["id"], u["email"], u["password_hash"], u["salt"], u["full_name"], u.get("created_at", ""), u.get("plan_type", "free")))

        # 2. Hydrate Conversations
        conv_col = db["conversations"]
        for c in conv_col.find():
            cursor.execute("""
                INSERT OR REPLACE INTO conversations (id, owner_id, title, created_at, updated_at, last_message_at, is_archived, is_deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (c["id"], c["owner_id"], c["title"], c.get("created_at", ""), c.get("updated_at", ""), c.get("last_message_at", ""), int(c.get("is_archived", 0)), int(c.get("is_deleted", 0))))

        # 3. Hydrate Messages
        msg_col = db["messages"]
        for m in msg_col.find():
            cursor.execute("""
                INSERT OR REPLACE INTO messages (id, conversation_id, role, content, sources_json, metadata_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (m["id"], m["conversation_id"], m["role"], m["content"], m.get("sources_json"), m.get("metadata_json"), m.get("created_at", "")))

        # 4. Hydrate Usage Quotas
        usage_col = db["user_usage"]
        for usg in usage_col.find():
            cursor.execute("""
                INSERT OR REPLACE INTO user_usage (user_id, feature, count, last_used_at)
                VALUES (?, ?, ?, ?)
            """, (usg["user_id"], usg["feature"], int(usg.get("count", 0)), usg.get("last_used_at", "")))

        conn.commit()
        conn.close()
        print("[MongoDB] SQLite hydrated successfully from MongoDB Atlas.")
    except Exception as e:
        print(f"[MongoDB] Hydration warning: {e}")

def sync_user_to_mongo(user_dict: Dict[str, Any]):
    db = get_mongo_db()
    if db is None:
        return
    try:
        db["users"].update_one(
            {"id": user_dict["id"]},
            {"$set": user_dict},
            upsert=True
        )
    except Exception as e:
        print(f"[MongoDB] Sync user error: {e}")

def sync_conversation_to_mongo(conv_dict: Dict[str, Any]):
    db = get_mongo_db()
    if db is None:
        return
    try:
        db["conversations"].update_one(
            {"id": conv_dict["id"]},
            {"$set": conv_dict},
            upsert=True
        )
    except Exception as e:
        print(f"[MongoDB] Sync conversation error: {e}")

def sync_message_to_mongo(msg_dict: Dict[str, Any]):
    db = get_mongo_db()
    if db is None:
        return
    try:
        db["messages"].update_one(
            {"id": msg_dict["id"]},
            {"$set": msg_dict},
            upsert=True
        )
    except Exception as e:
        print(f"[MongoDB] Sync message error: {e}")

def sync_usage_to_mongo(user_id: str, feature: str, count: int, last_used_at: str):
    db = get_mongo_db()
    if db is None:
        return
    try:
        db["user_usage"].update_one(
            {"user_id": user_id, "feature": feature},
            {"$set": {"count": count, "last_used_at": last_used_at}},
            upsert=True
        )
    except Exception as e:
        print(f"[MongoDB] Sync usage error: {e}")
