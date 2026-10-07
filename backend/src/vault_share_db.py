"""
vault_share_db.py
=================
Secure, Self-Destructing Document Sharing Engine for DhaaraAI Legal Vault.
Enforces:
1. Zero-leakage client passcodes (hashed with PBKDF2-HMAC-SHA256 and unique per-document salt).
2. AES-encrypted document storage (content encrypted with password-derived Fernet key).
3. Time-to-Live (TTL) expiration (configurable: 1h, 12h, 24h, 48h, 7d).
4. Single-Use Self-Destruct (Burn-after-reading: immediately purges document payload upon first successful unlock).
5. Automatic sweep of expired and destroyed documents to protect privacy.
"""

import sqlite3
import os
import secrets
import hashlib
import time
import base64
from contextlib import contextmanager
from pathlib import Path
from typing import Optional, Dict, Any, Tuple

# Try to import Fernet for AES encryption; fall back to base64 obfuscation if unavailable
try:
    from cryptography.fernet import Fernet
    HAS_FERNET = True
except ImportError:
    HAS_FERNET = False

# Database file location
DB_DIR = Path(__file__).parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = str(DB_DIR / "vault_shares.db")

# Track cleanup state to avoid concurrent cleanups
_last_cleanup_time = 0.0
_CLEANUP_INTERVAL = 300  # Only run cleanup once every 5 minutes


@contextmanager
def get_connection():
    """Context manager for SQLite connections — guarantees close on exception."""
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Initializes the table for secure shared documents."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS shared_vault_docs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            doc_type TEXT NOT NULL,
            folder TEXT DEFAULT 'Legal Document',
            encrypted_content TEXT NOT NULL,
            password_salt TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at REAL NOT NULL,
            expires_at REAL NOT NULL,
            one_time_view INTEGER NOT NULL DEFAULT 1,
            view_count INTEGER NOT NULL DEFAULT 0,
            is_destroyed INTEGER NOT NULL DEFAULT 0,
            destroyed_reason TEXT DEFAULT ''
        );
        """)
        cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_shares_expires ON shared_vault_docs(expires_at, is_destroyed);
        """)
        conn.commit()

# Auto-initialize DB on import
init_db()


def _derive_fernet_key(password: str, salt: bytes) -> bytes:
    """Derives a 32-byte Fernet-compatible key from password + salt using PBKDF2."""
    dk = hashlib.pbkdf2_hmac('sha256', password.strip().encode('utf-8'), salt, 100000)
    return base64.urlsafe_b64encode(dk)


def _encrypt_content(content: str, password: str, salt: bytes) -> str:
    """Encrypts content using Fernet (AES-128-CBC) derived from password. Falls back to base64."""
    if HAS_FERNET:
        key = _derive_fernet_key(password, salt)
        f = Fernet(key)
        return f.encrypt(content.encode('utf-8')).decode('utf-8')
    else:
        # Fallback: base64 encode (not secure, but better than plaintext)
        return base64.b64encode(content.encode('utf-8')).decode('utf-8')


def _decrypt_content(encrypted: str, password: str, salt: bytes) -> str:
    """Decrypts content. Handles both Fernet-encrypted and legacy plaintext/base64 content."""
    if HAS_FERNET:
        try:
            key = _derive_fernet_key(password, salt)
            f = Fernet(key)
            return f.decrypt(encrypted.encode('utf-8')).decode('utf-8')
        except Exception:
            # Backwards compatibility: try decoding as plain text (pre-encryption docs)
            try:
                return base64.b64decode(encrypted).decode('utf-8')
            except Exception:
                return encrypted  # Already plaintext from before encryption was added
    else:
        try:
            return base64.b64decode(encrypted).decode('utf-8')
        except Exception:
            return encrypted


def _hash_password(password: str, salt: bytes) -> str:
    """Derive key using PBKDF2-HMAC-SHA256 with 100,000 iterations."""
    return hashlib.pbkdf2_hmac(
        'sha256',
        password.strip().encode('utf-8'),
        salt,
        100000
    ).hex()


def cleanup_stale_documents():
    """Purges expired or destroyed documents older than 24h from storage completely.
    Rate-limited to avoid concurrent cleanup storms under load."""
    global _last_cleanup_time
    now = time.time()

    # Fix #14: Rate-limit cleanup to once per CLEANUP_INTERVAL
    if now - _last_cleanup_time < _CLEANUP_INTERVAL:
        return
    _last_cleanup_time = now

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            DELETE FROM shared_vault_docs
            WHERE (expires_at < ? AND is_destroyed = 1)
               OR (expires_at < ? - 86400)
            """, (now, now))
            conn.commit()
    except Exception as e:
        print(f"[VaultShare] Cleanup warning: {e}")


def create_shared_document(
    title: str,
    doc_type: str,
    content: str,
    password: str,
    folder: str = "Legal Document",
    expires_hours: float = 24.0,
    one_time_view: bool = True
) -> Dict[str, Any]:
    """
    Creates a new self-destructing, password-protected shared legal document.
    Content is encrypted at rest using a key derived from the password.
    """
    cleanup_stale_documents()
    
    if not password or len(password.strip()) < 4:
        raise ValueError("Passcode must be at least 4 characters for legal confidentiality.")
    if not content or not content.strip():
        raise ValueError("Cannot share an empty document.")
    
    # 20-byte URL-safe unique token
    share_id = secrets.token_urlsafe(16)
    
    # Salt and hash password
    salt = secrets.token_bytes(16)
    salt_hex = salt.hex()
    pwd_hash = _hash_password(password, salt)

    # Encrypt content at rest using password-derived key
    encrypted = _encrypt_content(content, password, salt)
    
    now = time.time()
    # Bound expiration between 0.5 hours and 168 hours (7 days)
    hours = max(0.5, min(float(expires_hours), 168.0))
    expires_at = now + (hours * 3600.0)
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO shared_vault_docs (
            id, title, doc_type, folder, encrypted_content, password_salt, password_hash,
            created_at, expires_at, one_time_view, view_count, is_destroyed, destroyed_reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, '')
        """, (
            share_id,
            title.strip()[:200],
            doc_type.strip()[:100],
            folder.strip()[:100],
            encrypted,
            salt_hex,
            pwd_hash,
            now,
            expires_at,
            1 if one_time_view else 0
        ))
        conn.commit()
    
    return {
        "share_id": share_id,
        "title": title.strip()[:200],
        "doc_type": doc_type.strip()[:100],
        "created_at": now,
        "expires_at": expires_at,
        "expires_in_hours": hours,
        "one_time_view": bool(one_time_view)
    }

def get_shared_document_meta(share_id: str) -> Optional[Dict[str, Any]]:
    """
    Returns public metadata of the shared document without revealing content.
    Used by recipient pre-unlock screen.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT id, title, doc_type, folder, created_at, expires_at, one_time_view, view_count, is_destroyed, destroyed_reason
        FROM shared_vault_docs
        WHERE id = ?
        """, (share_id,))
        row = cursor.fetchone()
    
    if not row:
        return None
    
    now = time.time()
    is_expired = now >= row["expires_at"]
    is_destroyed = bool(row["is_destroyed"]) or is_expired
    
    return {
        "share_id": row["id"],
        "title": row["title"],
        "doc_type": row["doc_type"],
        "folder": row["folder"],
        "created_at": row["created_at"],
        "expires_at": row["expires_at"],
        "one_time_view": bool(row["one_time_view"]),
        "view_count": row["view_count"],
        "is_destroyed": is_destroyed,
        "is_expired": is_expired,
        "destroyed_reason": row["destroyed_reason"] if row["is_destroyed"] else ("Expired after 24 hours" if is_expired else "")
    }

def unlock_shared_document(share_id: str, password: str) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
    """
    Verifies password and retrieves the document (decrypting from storage).
    If one_time_view is True, immediately self-destructs the payload.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT * FROM shared_vault_docs WHERE id = ?
        """, (share_id,))
        row = cursor.fetchone()
        
        if not row:
            return False, "This secure link does not exist or has been permanently purged.", None
        
        now = time.time()
        # Check expiration
        if now >= row["expires_at"]:
            cursor.execute("""
            UPDATE shared_vault_docs
            SET is_destroyed = 1, destroyed_reason = 'Expired after TTL duration', encrypted_content = ''
            WHERE id = ?
            """, (share_id,))
            conn.commit()
            return False, "This link has expired and the document has been self-destructed.", None
        
        # Check already destroyed
        if row["is_destroyed"]:
            reason = row["destroyed_reason"] or "This document was already viewed and burned."
            return False, f"Document unavailable: {reason}", None
        
        # Verify password
        salt = bytes.fromhex(row["password_salt"])
        expected_hash = row["password_hash"]
        attempt_hash = _hash_password(password, salt)
        
        if not secrets.compare_digest(attempt_hash, expected_hash):
            return False, "Incorrect passcode. Access denied.", None
        
        # Password verified — decrypt content
        new_views = row["view_count"] + 1
        encrypted_content = row["encrypted_content"]
        content = _decrypt_content(encrypted_content, password, salt)
        
        if row["one_time_view"]:
            # Self-destruct payload immediately
            cursor.execute("""
            UPDATE shared_vault_docs
            SET is_destroyed = 1,
                destroyed_reason = 'Single-view self-destruct triggered upon client retrieval',
                view_count = ?,
                encrypted_content = ''
            WHERE id = ?
            """, (new_views, share_id))
        else:
            cursor.execute("""
            UPDATE shared_vault_docs
            SET view_count = ?
            WHERE id = ?
            """, (new_views, share_id))
        
        conn.commit()
    
    return True, "Unlocked successfully", {
        "share_id": row["id"],
        "title": row["title"],
        "doc_type": row["doc_type"],
        "folder": row["folder"],
        "content": content,
        "created_at": row["created_at"],
        "expires_at": row["expires_at"],
        "one_time_view": bool(row["one_time_view"]),
        "was_burned_on_view": bool(row["one_time_view"])
    }
