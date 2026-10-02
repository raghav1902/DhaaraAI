"""
chat_history_db.py
===================
Production-Grade SQLite Storage & Authentication Layer for DhaaraAI Chat History.
Enforces STRICT SERVER-SIDE USER DATA ISOLATION and IDOR PREVENTION.

Tables:
- users: id, email, password_hash, salt, full_name, created_at
- conversations: id, owner_id, title, created_at, updated_at, last_message_at, is_archived, is_deleted
- messages: id, conversation_id, role, content, sources_json, metadata_json, created_at

Security Guarantees:
- Every conversation operation filters by (owner_id = authenticated_user_id AND is_deleted = 0).
- Cross-user queries return None / empty, preventing IDOR data leaks.
- Session tokens are cryptographically signed HMAC-SHA256 tokens with expiry.
"""

import sqlite3
import os
import json
import uuid
import hmac
import hashlib
import base64
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple

# Database file location
DB_DIR = Path(__file__).parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = str(DB_DIR / "dhaara_chat.db")

# Secret key for HMAC token signing (falls back to a stable secret if env not set)
SECRET_KEY = os.getenv("DHAARA_AUTH_SECRET", "dhaara-ai-prod-auth-secret-key-389148194").encode("utf-8")
TOKEN_TTL_SECONDS = 7 * 24 * 3600  # 7 days

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode and foreign keys for high concurrent performance and data integrity
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    """Initializes tables and indexes for chat history and users."""
    conn = get_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at TEXT NOT NULL
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

    # Performance & Isolation Indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_conv_owner_updated ON conversations(owner_id, is_deleted, updated_at DESC);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_conv_id_owner ON conversations(id, owner_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_msg_conv_created ON messages(conversation_id, created_at ASC);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")

    conn.commit()
    conn.close()

# Auto-initialize DB on import
init_db()

# ==============================================================================
# AUTHENTICATION & TOKEN SIGNING
# ==============================================================================

def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    if not salt:
        salt = uuid.uuid4().hex
    # PBKDF2 with SHA-256 (100,000 rounds)
    pwd_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return pwd_hash, salt

def verify_password(password: str, salt: str, expected_hash: str) -> bool:
    calc_hash, _ = hash_password(password, salt)
    return hmac.compare_digest(calc_hash, expected_hash)

def generate_signed_token(user_id: str, email: str) -> str:
    """Generates an HMAC-SHA256 signed bearer token containing payload and expiration."""
    now = int(time.time())
    payload = {
        "uid": user_id,
        "em": email.strip().lower(),
        "iat": now,
        "exp": now + TOKEN_TTL_SECONDS
    }
    payload_json = json.dumps(payload, separators=(',', ':'))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode('utf-8')).decode('utf-8').rstrip('=')
    
    signature = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
    
    return f"{payload_b64}.{sig_b64}"

def verify_signed_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies HMAC signature and expiration of bearer token. Returns payload dict or None."""
    try:
        parts = token.strip().split('.')
        if len(parts) != 2:
            return None
        payload_b64, sig_b64 = parts
        
        # Verify signature
        expected_sig = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode('utf-8').rstrip('=')
        
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None
        
        # Decode payload
        rem = len(payload_b64) % 4
        padded_b64 = payload_b64 + ('=' * (4 - rem) if rem else '')
        payload_bytes = base64.urlsafe_b64decode(padded_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        # Check expiry
        if int(time.time()) > payload.get("exp", 0):
            return None
            
        return payload
    except Exception:
        return None

# ==============================================================================
# USER OPERATIONS
# ==============================================================================

def register_user(email: str, password: str, full_name: str) -> Dict[str, Any]:
    email_clean = email.strip().lower()
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, full_name FROM users WHERE email = ?", (email_clean,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        raise ValueError("User with this email already exists")
    
    user_id = f"usr_{uuid.uuid4().hex[:16]}"
    pwd_hash, salt = hash_password(password)
    now_iso = datetime.now(timezone.utc).isoformat()
    
    cursor.execute(
        "INSERT INTO users (id, email, password_hash, salt, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, email_clean, pwd_hash, salt, full_name.strip() or "User", now_iso)
    )
    conn.commit()
    conn.close()
    
    token = generate_signed_token(user_id, email_clean)
    return {
        "user_id": user_id,
        "email": email_clean,
        "name": full_name.strip() or "User",
        "token": token
    }

def authenticate_user(email: str, password: str) -> Dict[str, Any]:
    email_clean = email.strip().lower()
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, email, password_hash, salt, full_name FROM users WHERE email = ?", (email_clean,))
    row = cursor.fetchone()
    
    if not row:
        # Check if user had registered client-side; auto-provision to ensure backwards compatibility
        user_id = f"usr_{uuid.uuid4().hex[:16]}"
        pwd_hash, salt = hash_password(password)
        now_iso = datetime.now(timezone.utc).isoformat()
        prefix = email_clean.split('@')[0]
        name = prefix.capitalize()
        cursor.execute(
            "INSERT INTO users (id, email, password_hash, salt, full_name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, email_clean, pwd_hash, salt, name, now_iso)
        )
        conn.commit()
        conn.close()
        token = generate_signed_token(user_id, email_clean)
        return {"user_id": user_id, "email": email_clean, "name": name, "token": token}
    
    if not verify_password(password, row["salt"], row["password_hash"]):
        conn.close()
        raise ValueError("Invalid credentials")
        
    conn.close()
    token = generate_signed_token(row["id"], email_clean)
    return {
        "user_id": row["id"],
        "email": email_clean,
        "name": row["full_name"],
        "token": token
    }

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, full_name, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {"user_id": row["id"], "email": row["email"], "name": row["full_name"]}

# ==============================================================================
# CONVERSATION & MESSAGE OPERATIONS (STRICT USER ISOLATION)
# ==============================================================================

def generate_conversation_title(first_message: str) -> str:
    """Generates a clean, concise, 3-6 word title from first user query."""
    text = first_message.strip().replace("\n", " ")
    lower = text.lower()

    # Domain specific smart titles
    if any(k in lower for k in ["cheque bounce", "check bounce", "138", "dishonour", "dishonor"]):
        return "Cheque Bounce Issue"
    if any(k in lower for k in ["tenant", "landlord", "rent", "eviction", "kirayedar"]):
        return "Tenant Dispute & Rights"
    if any(k in lower for k in ["fir refuse", "refuse fir", "fir darj", "police refuse", "173"]):
        return "FIR Refusal Procedure"
    if any(k in lower for k in ["consumer complaint", "consumer court", "defective", "refund"]):
        return "Consumer Complaint"
    if any(k in lower for k in ["bail", "anticipatory bail", "zamanat", "438", "439"]):
        return "Bail Application"
    if any(k in lower for k in ["cyber", "phishing", "fraud", "hacked", "otp"]):
        return "Cyber Fraud Incident"
    if any(k in lower for k in ["road rage", "accident", "motor vehicle", "rash driving"]):
        return "Road Rage & MV Rules"

    for prefix in ["what is the", "what are the", "what is", "what are", "tell me about", "explain", "how does", "how to", "kya hai", "kaise kare", "can police", "procedure for"]:
        if lower.startswith(prefix):
            text = text[len(prefix):].strip()
            break

    words = text.split()
    if len(words) > 5:
        clean_title = " ".join(words[:5])
    else:
        clean_title = " ".join(words)
    clean_title = clean_title.strip("?.,! :;-")
    if not clean_title:
        clean_title = "Legal Consultation"
    return clean_title[:45].title()

def create_conversation(owner_id: str, title: Optional[str] = None) -> Dict[str, Any]:
    conv_id = f"conv_{uuid.uuid4().hex[:16]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    final_title = title.strip() if (title and title.strip()) else "New Consultation"
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO conversations (id, owner_id, title, created_at, updated_at, last_message_at, is_archived, is_deleted)
        VALUES (?, ?, ?, ?, ?, ?, 0, 0)
        """,
        (conv_id, owner_id, final_title, now_iso, now_iso, now_iso)
    )
    conn.commit()
    conn.close()
    
    return {
        "id": conv_id,
        "owner_id": owner_id,
        "title": final_title,
        "created_at": now_iso,
        "updated_at": now_iso,
        "last_message_at": now_iso,
        "is_archived": False,
        "messages": []
    }

def list_user_conversations(owner_id: str) -> List[Dict[str, Any]]:
    """Returns all non-deleted conversations belonging exclusively to owner_id."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, owner_id, title, created_at, updated_at, last_message_at, is_archived
        FROM conversations
        WHERE owner_id = ? AND is_deleted = 0
        ORDER BY updated_at DESC
        """,
        (owner_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": r["id"],
            "owner_id": r["owner_id"],
            "title": r["title"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
            "last_message_at": r["last_message_at"],
            "is_archived": bool(r["is_archived"])
        }
        for r in rows
    ]

def get_conversation_with_messages(conversation_id: str, owner_id: str) -> Optional[Dict[str, Any]]:
    """Fetches conversation & its full message history. Returns None if unowned/deleted (prevents IDOR)."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Strict isolation check
    cursor.execute(
        """
        SELECT id, owner_id, title, created_at, updated_at, last_message_at, is_archived
        FROM conversations
        WHERE id = ? AND owner_id = ? AND is_deleted = 0
        """,
        (conversation_id, owner_id)
    )
    conv_row = cursor.fetchone()
    if not conv_row:
        conn.close()
        return None
        
    cursor.execute(
        """
        SELECT id, role, content, sources_json, metadata_json, created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        """,
        (conversation_id,)
    )
    msg_rows = cursor.fetchall()
    conn.close()
    
    messages = []
    for m in msg_rows:
        sources = json.loads(m["sources_json"]) if m["sources_json"] else []
        metadata = json.loads(m["metadata_json"]) if m["metadata_json"] else {}
        messages.append({
            "id": m["id"],
            "role": m["role"],
            "content": m["content"],
            "sources": sources,
            "metadata": metadata,
            "created_at": m["created_at"]
        })
        
    return {
        "id": conv_row["id"],
        "owner_id": conv_row["owner_id"],
        "title": conv_row["title"],
        "created_at": conv_row["created_at"],
        "updated_at": conv_row["updated_at"],
        "last_message_at": conv_row["last_message_at"],
        "is_archived": bool(conv_row["is_archived"]),
        "messages": messages
    }

def add_message_to_conversation(
    conversation_id: str,
    owner_id: str,
    role: str,
    content: str,
    sources: Optional[List[Dict[str, Any]]] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[Dict[str, Any]]:
    """Adds a message only if conversation exists and is owned by owner_id."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id, title FROM conversations WHERE id = ? AND owner_id = ? AND is_deleted = 0",
        (conversation_id, owner_id)
    )
    conv = cursor.fetchone()
    if not conv:
        conn.close()
        return None
        
    msg_id = f"msg_{uuid.uuid4().hex[:16]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    sources_json = json.dumps(sources) if sources else None
    metadata_json = json.dumps(metadata) if metadata else None
    
    cursor.execute(
        """
        INSERT INTO messages (id, conversation_id, role, content, sources_json, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (msg_id, conversation_id, role, content, sources_json, metadata_json, now_iso)
    )
    
    # Auto-update conversation title if it was the default and role is user
    update_title_clause = ""
    title_params = [now_iso, now_iso]
    if role == "user" and (conv["title"] in ["New Consultation", "New Chat", "Legal Consultation"]):
        new_title = generate_conversation_title(content)
        update_title_clause = ", title = ?"
        title_params.append(new_title)
        
    title_params.extend([conversation_id, owner_id])
    
    cursor.execute(
        f"""
        UPDATE conversations
        SET updated_at = ?, last_message_at = ? {update_title_clause}
        WHERE id = ? AND owner_id = ?
        """,
        tuple(title_params)
    )
    
    conn.commit()
    conn.close()
    
    return {
        "id": msg_id,
        "conversation_id": conversation_id,
        "role": role,
        "content": content,
        "sources": sources or [],
        "metadata": metadata or {},
        "created_at": now_iso
    }

def rename_conversation(conversation_id: str, owner_id: str, new_title: str) -> bool:
    """Renames conversation with strict ownership check."""
    cleaned = new_title.strip()
    if not cleaned:
        return False
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    
    cursor.execute(
        """
        UPDATE conversations
        SET title = ?, updated_at = ?
        WHERE id = ? AND owner_id = ? AND is_deleted = 0
        """,
        (cleaned[:80], now_iso, conversation_id, owner_id)
    )
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return updated

def delete_conversation(conversation_id: str, owner_id: str) -> bool:
    """Soft-deletes conversation with strict ownership check."""
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    
    cursor.execute(
        """
        UPDATE conversations
        SET is_deleted = 1, updated_at = ?
        WHERE id = ? AND owner_id = ? AND is_deleted = 0
        """,
        (now_iso, conversation_id, owner_id)
    )
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def search_user_conversations(owner_id: str, query: str) -> List[Dict[str, Any]]:
    """
    Searches ONLY within conversations owned by owner_id.
    Matches conversation title or message contents.
    Never returns conversations of other users.
    """
    clean_q = f"%{query.strip().lower()}%"
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """
        SELECT DISTINCT c.id, c.owner_id, c.title, c.created_at, c.updated_at, c.last_message_at
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.owner_id = ?
          AND c.is_deleted = 0
          AND (
            LOWER(c.title) LIKE ?
            OR LOWER(m.content) LIKE ?
          )
        ORDER BY c.updated_at DESC
        LIMIT 20
        """,
        (owner_id, clean_q, clean_q)
    )
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "id": r["id"],
            "owner_id": r["owner_id"],
            "title": r["title"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
            "last_message_at": r["last_message_at"]
        }
        for r in rows
    ]
