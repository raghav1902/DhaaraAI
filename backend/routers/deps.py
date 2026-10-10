import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import HTTPException, Header
from slowapi import Limiter
from slowapi.util import get_remote_address

ROOT_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

import chat_history_db

# Shared SlowAPI limiter
limiter = Limiter(key_func=get_remote_address)

# Engine singleton reference holder
_engine_instance = None

def get_engine():
    global _engine_instance
    return _engine_instance

def set_engine(engine):
    global _engine_instance
    _engine_instance = engine

def check_engine():
    """Raise 503 if engine is unavailable."""
    engine = get_engine()
    if not engine:
        raise HTTPException(
            status_code=503,
            detail="Legal AI Engine is not available. The server started without the RAG engine. Check server logs."
        )
    return engine

def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Enforces server-side authentication for every conversation operation.
    Validates HMAC-SHA256 bearer token. Never trusts client-supplied user_id.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication token required. Please sign in to access conversations."
        )
    token = authorization.split("Bearer ", 1)[1].strip()
    payload = chat_history_db.verify_signed_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session token. Please sign in again."
        )
    user = chat_history_db.get_user_by_id(payload["uid"])
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User account not found."
        )
    user["_token"] = token
    return user

def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """Optional authentication for endpoints that allow anonymous querying."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split("Bearer ", 1)[1].strip()
    payload = chat_history_db.verify_signed_token(token)
    if not payload:
        return None
    user = chat_history_db.get_user_by_id(payload["uid"])
    if user:
        user["_token"] = token
    return user
