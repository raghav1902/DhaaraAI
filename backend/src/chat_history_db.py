"""
chat_history_db.py
===================
Production-Grade SQLite Storage & Authentication Layer for DhaaraAI Chat History.
Enforces STRICT SERVER-SIDE USER DATA ISOLATION and IDOR PREVENTION.

Tables:
- users: id, email, password_hash, salt, full_name, created_at
- conversations: id, owner_id, title, created_at, updated_at, last_message_at, is_archived, is_deleted
- messages: id, conversation_id, role, content, sources_json, metadata_json, created_at
- revoked_tokens: token_hash, revoked_at (for server-side logout)

Security Guarantees:
- Every conversation operation filters by (owner_id = authenticated_user_id AND is_deleted = 0).
- Cross-user queries return None / empty, preventing IDOR data leaks.
- Session tokens are cryptographically signed HMAC-SHA256 tokens with expiry.
- Tokens can be revoked server-side on logout.
"""

import sqlite3
import os
import re
import json
import uuid
import hmac
import hashlib
import base64
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple

# Database file location
DB_DIR = Path(__file__).parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = str(DB_DIR / "dhaara_chat.db")

# Secret key for HMAC token signing — MUST be set via environment variable in production.
# The fallback is ONLY for local development convenience and should never be relied upon.
_env_secret = os.getenv("DHAARA_AUTH_SECRET", "").strip()
if not _env_secret:
    import warnings
    warnings.warn(
        "DHAARA_AUTH_SECRET is not set! Using insecure fallback key. "
        "Set DHAARA_AUTH_SECRET in your .env file for production use.",
        RuntimeWarning,
        stacklevel=2
    )
    _env_secret = "dhaara-dev-only-insecure-fallback-key"
SECRET_KEY = _env_secret.encode("utf-8")
TOKEN_TTL_SECONDS = 7 * 24 * 3600  # 7 days

# ── WAL mode flag: set once per process, not per connection ──
_wal_initialized = False


@contextmanager
def get_connection():
    """Context manager for SQLite connections — guarantees close on exception."""
    global _wal_initialized
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON;")
    # Set WAL mode only once per process lifetime (it persists across connections)
    if not _wal_initialized:
        conn.execute("PRAGMA journal_mode=WAL;")
        _wal_initialized = True
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Initializes tables and indexes for chat history and users."""
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

        # Revoked Tokens Table (for server-side logout / token invalidation)
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

# ==============================================================================
# INPUT VALIDATION
# ==============================================================================

_EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def _validate_email(email: str) -> str:
    """Validates and normalises email. Raises ValueError on invalid format."""
    clean = email.strip().lower()
    if not clean or not _EMAIL_REGEX.match(clean):
        raise ValueError("Invalid email address format.")
    if len(clean) > 254:
        raise ValueError("Email address is too long.")
    return clean

def _validate_password(password: str):
    """Enforces minimum password strength."""
    if not password or len(password) < 6:
        raise ValueError("Password must be at least 6 characters.")
    if len(password) > 128:
        raise ValueError("Password is too long (max 128 characters).")

def _sanitize_name(name: str) -> str:
    """Strips HTML/script tags and limits length for display names."""
    import html
    clean = html.escape(name.strip())
    if not clean:
        return "User"
    return clean[:100]

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

def generate_signed_token(user_id: str, email: str, plan_type: str = "free") -> str:
    """Generates an HMAC-SHA256 signed bearer token containing payload and expiration."""
    now = int(time.time())
    payload = {
        "uid": user_id,
        "em": email.strip().lower(),
        "plan": plan_type,
        "iat": now,
        "exp": now + TOKEN_TTL_SECONDS
    }
    payload_json = json.dumps(payload, separators=(',', ':'))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode('utf-8')).decode('utf-8').rstrip('=')
    
    signature = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
    
    return f"{payload_b64}.{sig_b64}"

def verify_signed_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies HMAC signature, expiration, and revocation status. Returns payload dict or None."""
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

        # Check if token has been revoked (server-side logout)
        token_hash = hashlib.sha256(token.encode('utf-8')).hexdigest()
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM revoked_tokens WHERE token_hash = ?", (token_hash,))
            if cursor.fetchone():
                return None
            
        return payload
    except Exception:
        return None

def revoke_token(token: str):
    """Revokes a token so it can no longer be used (server-side logout)."""
    token_hash = hashlib.sha256(token.encode('utf-8')).hexdigest()
    now_iso = datetime.now(timezone.utc).isoformat()
    try:
        with get_connection() as conn:
            conn.execute(
                "INSERT OR IGNORE INTO revoked_tokens (token_hash, revoked_at) VALUES (?, ?)",
                (token_hash, now_iso)
            )
            conn.commit()
    except Exception:
        pass  # Best-effort; token will expire naturally anyway

def cleanup_expired_revocations():
    """Removes revoked token entries older than TOKEN_TTL to prevent table bloat."""
    try:
        cutoff = datetime.now(timezone.utc).isoformat()
        with get_connection() as conn:
            # Remove entries older than token TTL (they've expired naturally)
            conn.execute(
                "DELETE FROM revoked_tokens WHERE revoked_at < datetime(?, '-7 days')",
                (cutoff,)
            )
            conn.commit()
    except Exception:
        pass

# ==============================================================================
# USER OPERATIONS
# ==============================================================================

def register_user(email: str, password: str, full_name: str) -> Dict[str, Any]:
    email_clean = _validate_email(email)
    _validate_password(password)
    safe_name = _sanitize_name(full_name)

    with get_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email, full_name FROM users WHERE email = ?", (email_clean,))
        existing = cursor.fetchone()
        if existing:
            raise ValueError("User with this email already exists")
        
        user_id = f"usr_{uuid.uuid4().hex[:16]}"
        pwd_hash, salt = hash_password(password)
        now_iso = datetime.now(timezone.utc).isoformat()
        
        cursor.execute(
            "INSERT INTO users (id, email, password_hash, salt, full_name, created_at, plan_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, email_clean, pwd_hash, salt, safe_name, now_iso, "free")
        )
        conn.commit()
    
    token = generate_signed_token(user_id, email_clean, "free")
    return {
        "user_id": user_id,
        "email": email_clean,
        "name": safe_name,
        "plan": "free",
        "token": token
    }

def authenticate_user(email: str, password: str) -> Dict[str, Any]:
    email_clean = _validate_email(email)
    _validate_password(password)

    with get_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email, password_hash, salt, full_name, plan_type FROM users WHERE email = ?", (email_clean,))
        row = cursor.fetchone()
    
    # FIX #10: Removed auto-provisioning. If user not found, reject immediately.
    if not row:
        raise ValueError("Invalid credentials")
    
    if not verify_password(password, row["salt"], row["password_hash"]):
        raise ValueError("Invalid credentials")
        
    token = generate_signed_token(row["id"], email_clean, row["plan_type"])
    return {
        "user_id": row["id"],
        "email": email_clean,
        "name": row["full_name"],
        "plan": row["plan_type"],
        "token": token
    }

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, full_name, plan_type FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
    if not row:
        return None
    return {"user_id": row["id"], "email": row["email"], "name": row["full_name"], "plan": row["plan_type"]}

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    email_clean = email.strip().lower()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, full_name, plan_type FROM users WHERE email = ?", (email_clean,))
        row = cursor.fetchone()
    if not row:
        return None
    return {"user_id": row["id"], "email": row["email"], "name": row["full_name"], "plan": row["plan_type"]}

def update_user_profile(user_id: str, new_name: Optional[str] = None, new_password: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Updates user profile fields. Returns updated user dict or None if not found."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, full_name, plan_type FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return None

        updates = []
        params = []

        if new_name and new_name.strip():
            safe_name = _sanitize_name(new_name)
            updates.append("full_name = ?")
            params.append(safe_name)

        if new_password and new_password.strip():
            _validate_password(new_password)
            pwd_hash, salt = hash_password(new_password)
            updates.append("password_hash = ?")
            params.append(pwd_hash)
            updates.append("salt = ?")
            params.append(salt)

        if not updates:
            return {"user_id": row["id"], "email": row["email"], "name": row["full_name"], "plan": row["plan_type"]}

        params.append(user_id)
        cursor.execute(
            f"UPDATE users SET {', '.join(updates)} WHERE id = ?",
            tuple(params)
        )
        conn.commit()

        cursor.execute("SELECT id, email, full_name, plan_type FROM users WHERE id = ?", (user_id,))
        updated = cursor.fetchone()

    return {"user_id": updated["id"], "email": updated["email"], "name": updated["full_name"], "plan": updated["plan_type"]}

# ==============================================================================
# SUBSCRIPTION TIERS & USAGE LIMITS ENFORCEMENT
# ==============================================================================

FREE_PLAN_LIMITS = {
    "draft": 3,              # Exactly 3 Legal Drafts for free tier
    "contract_audit": 3,     # 3 Contract Risk Audits for free tier
    "bns_lookup": 2,         # 2 Statutory Concordance searches
    "legal_library": 15,     # 15 Statutory provisions preview
    "glossary": 15,          # 15 Legal terms preview
    "cyber_check": 3,        # 3 Cyber Exposure Breach Scans
    "ai_chat": 7,            # 7 AI Legal Chats per day
}

PLUS_PLAN_LIMITS = {
    "draft": -1,             # Unlimited
    "contract_audit": -1,
    "bns_lookup": -1,
    "legal_library": -1,
    "glossary": -1,
    "cyber_check": -1,
    "ai_chat": -1,
}

def get_user_usage_stats(user_id: Optional[str]) -> Dict[str, Any]:
    """Returns current usage counts, limits, and remaining balance for a user."""
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if not user_id:
        # Default anonymous/guest stats
        stats = {}
        for feat, lim in FREE_PLAN_LIMITS.items():
            stats[feat] = {
                "used": 0,
                "limit": lim,
                "remaining": lim,
                "is_unlimited": False
            }
        return {
            "user_id": None,
            "plan": "free",
            "is_pro": False,
            "features": stats
        }

    user = get_user_by_id(user_id)
    plan = user.get("plan", "free") if user else "free"
    is_pro = plan in ("plus", "pro", "enterprise")

    usage_map = {}
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT feature, count, last_used_at FROM user_usage WHERE user_id = ?", (user_id,))
        for row in cursor.fetchall():
            feat_name = row["feature"]
            cnt = row["count"]
            if feat_name == "ai_chat":
                last_d = (row["last_used_at"] or "")[:10]
                usage_map[feat_name] = cnt if last_d == today_str else 0
            else:
                usage_map[feat_name] = cnt

    stats = {}
    for feat, lim in FREE_PLAN_LIMITS.items():
        used = usage_map.get(feat, 0)
        eff_limit = -1 if is_pro else lim
        remaining = -1 if is_pro else max(0, eff_limit - used)
        stats[feat] = {
            "used": used,
            "limit": eff_limit,
            "remaining": remaining,
            "is_unlimited": is_pro
        }

    return {
        "user_id": user_id,
        "plan": plan,
        "is_pro": is_pro,
        "features": stats
    }

def check_daily_feature_limit(user_id: Optional[str], feature: str, daily_limit: int = 7) -> Tuple[bool, int, int]:
    """
    Checks if a user has exceeded their daily limit for a feature (e.g. ai_chat).
    Resets counter if last_used_at was before today.
    Returns: (is_allowed: bool, current_usage_today: int, limit: int)
    """
    if not user_id:
        return True, 0, daily_limit

    user = get_user_by_id(user_id)
    plan = user.get("plan", "free") if user else "free"
    if plan in ("plus", "pro", "enterprise"):
        return True, 0, -1

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    current_count = 0
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT count, last_used_at FROM user_usage WHERE user_id = ? AND feature = ?", (user_id, feature))
        row = cursor.fetchone()
        if row:
            last_date = (row["last_used_at"] or "")[:10]
            if last_date == today_str:
                current_count = row["count"]
            else:
                current_count = 0

    allowed = current_count < daily_limit
    return allowed, current_count, daily_limit

def record_daily_feature_usage(user_id: Optional[str], feature: str) -> int:
    """Increments daily feature usage count in database. Returns new count."""
    if not user_id:
        return 1
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    today_str = now.strftime("%Y-%m-%d")
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT count, last_used_at FROM user_usage WHERE user_id = ? AND feature = ?", (user_id, feature))
        row = cursor.fetchone()
        if row:
            last_date = (row["last_used_at"] or "")[:10]
            new_count = (row["count"] + 1) if last_date == today_str else 1
            cursor.execute("UPDATE user_usage SET count = ?, last_used_at = ? WHERE user_id = ? AND feature = ?",
                           (new_count, now_iso, user_id, feature))
        else:
            new_count = 1
            cursor.execute("INSERT INTO user_usage (user_id, feature, count, last_used_at) VALUES (?, ?, ?, ?)",
                           (user_id, feature, 1, now_iso))
        conn.commit()
        return new_count

def check_feature_limit(user_id: Optional[str], feature: str) -> Tuple[bool, int, int]:
    """
    Checks if a user can use a given feature.
    Returns: (is_allowed: bool, current_usage: int, limit: int)
    """
    if not user_id:
        # Without user ID, allow up to free limit (or 1 trial)
        limit = FREE_PLAN_LIMITS.get(feature, 3)
        return True, 0, limit

    user = get_user_by_id(user_id)
    plan = user.get("plan", "free") if user else "free"
    if plan in ("plus", "pro", "enterprise"):
        return True, 0, -1

    limit = FREE_PLAN_LIMITS.get(feature, 3)
    current_count = 0
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT count FROM user_usage WHERE user_id = ? AND feature = ?", (user_id, feature))
        row = cursor.fetchone()
        if row:
            current_count = row["count"]

    allowed = current_count < limit
    return allowed, current_count, limit

def record_feature_usage(user_id: Optional[str], feature: str) -> int:
    """Increments feature usage count in database. Returns new count."""
    if not user_id:
        return 1
    now_iso = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO user_usage (user_id, feature, count, last_used_at)
            VALUES (?, ?, 1, ?)
            ON CONFLICT(user_id, feature) DO UPDATE SET
                count = count + 1,
                last_used_at = excluded.last_used_at
        """, (user_id, feature, now_iso))
        conn.commit()

        cursor.execute("SELECT count FROM user_usage WHERE user_id = ? AND feature = ?", (user_id, feature))
        row = cursor.fetchone()
        return row["count"] if row else 1

def update_user_plan(user_id: str, plan_type: str, days: int = 30) -> Dict[str, Any]:
    """Updates user plan in users table and returns updated user payload with fresh token."""
    clean_plan = plan_type.lower().strip()
    if clean_plan not in ("free", "plus", "pro", "enterprise"):
        raise ValueError(f"Invalid plan type '{plan_type}'")

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET plan_type = ? WHERE id = ?", (clean_plan, user_id))
        conn.commit()

    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    new_token = generate_signed_token(user["user_id"], user["email"], user["plan"])
    user["token"] = new_token
    return user

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
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO conversations (id, owner_id, title, created_at, updated_at, last_message_at, is_archived, is_deleted)
            VALUES (?, ?, ?, ?, ?, ?, 0, 0)
            """,
            (conv_id, owner_id, final_title, now_iso, now_iso, now_iso)
        )
        conn.commit()
    
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

def list_user_conversations(owner_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Returns non-deleted conversations belonging exclusively to owner_id with pagination."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, owner_id, title, created_at, updated_at, last_message_at, is_archived
            FROM conversations
            WHERE owner_id = ? AND is_deleted = 0
            ORDER BY updated_at DESC
            LIMIT ? OFFSET ?
            """,
            (owner_id, limit, offset)
        )
        rows = cursor.fetchall()
    
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
    with get_connection() as conn:
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
    with get_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, title FROM conversations WHERE id = ? AND owner_id = ? AND is_deleted = 0",
            (conversation_id, owner_id)
        )
        conv = cursor.fetchone()
        if not conv:
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
    with get_connection() as conn:
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
    return updated

def delete_conversation(conversation_id: str, owner_id: str) -> bool:
    """Soft-deletes conversation with strict ownership check."""
    with get_connection() as conn:
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
    return deleted

def search_user_conversations(owner_id: str, query: str) -> List[Dict[str, Any]]:
    """
    Searches ONLY within conversations owned by owner_id.
    Matches conversation title or message contents.
    Never returns conversations of other users.
    """
    clean_q = f"%{query.strip().lower()}%"
    with get_connection() as conn:
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
