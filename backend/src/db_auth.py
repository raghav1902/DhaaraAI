"""
db_auth.py
==========
Authentication, user credentials hashing, HMAC session tokens, and profile management.
"""

import os
import re
import json
import uuid
import hmac
import hashlib
import base64
import time
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple

from db_core import get_connection

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

def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    if not salt:
        salt = uuid.uuid4().hex
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
        
        expected_sig = hmac.new(SECRET_KEY, payload_b64.encode('utf-8'), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode('utf-8').rstrip('=')
        
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None
        
        rem = len(payload_b64) % 4
        padded_b64 = payload_b64 + ('=' * (4 - rem) if rem else '')
        payload_bytes = base64.urlsafe_b64decode(padded_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        if int(time.time()) > payload.get("exp", 0):
            return None

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
        pass

def cleanup_expired_revocations():
    """Removes revoked token entries older than TOKEN_TTL to prevent table bloat."""
    try:
        cutoff = datetime.now(timezone.utc).isoformat()
        with get_connection() as conn:
            conn.execute(
                "DELETE FROM revoked_tokens WHERE revoked_at < datetime(?, '-7 days')",
                (cutoff,)
            )
            conn.commit()
    except Exception:
        pass

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
    
    try:
        from mongo_sync import sync_user_to_mongo
        sync_user_to_mongo({
            "id": user_id,
            "email": email_clean,
            "password_hash": pwd_hash,
            "salt": salt,
            "full_name": safe_name,
            "created_at": now_iso,
            "plan_type": "free"
        })
    except Exception:
        pass

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
