"""
db_usage.py
===========
Subscription quotas, feature usage enforcement, and tier updates.
"""

from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple

from db_core import get_connection
from db_auth import get_user_by_id, generate_signed_token

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
    """Checks if a user can use a given feature."""
    if not user_id:
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
