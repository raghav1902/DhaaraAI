"""
db_core.py
==========
Database connection management, schema initialization, and WAL mode configuration.
"""

import sqlite3
from contextlib import contextmanager
from pathlib import Path

# Database file location
DB_DIR = Path(__file__).resolve().parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = str(DB_DIR / "dhaara_chat.db")

_wal_initialized = False

@contextmanager
def get_connection():
    """Context manager for SQLite connections — guarantees close on exception."""
    global _wal_initialized
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON;")
    if not _wal_initialized:
        conn.execute("PRAGMA journal_mode=WAL;")
        _wal_initialized = True
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initializes tables and indexes for chat history, users, and usage."""
    with get_connection() as conn:
        cursor = conn.cursor()

        # Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            full_name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            plan_type TEXT DEFAULT 'free',
            subscription_end_date TEXT
        );
        """)

        # Conversations Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            owner_id TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            last_message_at TEXT,
            is_archived INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)

        # Messages Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            sources_json TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        );
        """)

        # Revoked Tokens Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS revoked_tokens (
            token_hash TEXT PRIMARY KEY,
            revoked_at TEXT NOT NULL
        );
        """)

        # User Usage Quota Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_usage (
            user_id TEXT NOT NULL,
            feature TEXT NOT NULL,
            count INTEGER NOT NULL DEFAULT 0,
            last_used_at TEXT NOT NULL,
            PRIMARY KEY (user_id, feature),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)

        # Performance & Isolation Indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_conv_owner_updated ON conversations(owner_id, is_deleted, updated_at DESC);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_conv_id_owner ON conversations(id, owner_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_msg_conv_created ON messages(conversation_id, created_at ASC);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_revoked_token ON revoked_tokens(token_hash);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_usage_user ON user_usage(user_id);")

        conn.commit()

# Auto-initialize DB on import
init_db()

try:
    from mongo_sync import hydrate_sqlite_from_mongo
    hydrate_sqlite_from_mongo(DB_PATH)
except Exception:
    pass
