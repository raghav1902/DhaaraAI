"""
chat_history_db.py
===================
Master Facade for DhaaraAI SQLite Database Layer.
Subdivided modularly into:
- db_core.py          : Connection management, schemas, and WAL mode
- db_auth.py          : User credentials, HMAC bearer tokens, password hashing
- db_usage.py         : Subscription tiers, daily quotas, feature limits
- db_conversations.py : Conversations lifecycle, messages storage, IDOR prevention
"""

from db_core import (
    DB_PATH,
    DB_DIR,
    get_connection,
    init_db
)

from db_auth import (
    SECRET_KEY,
    TOKEN_TTL_SECONDS,
    hash_password,
    verify_password,
    generate_signed_token,
    verify_signed_token,
    revoke_token,
    cleanup_expired_revocations,
    register_user,
    authenticate_user,
    get_user_by_id,
    get_user_by_email,
    update_user_profile
)

from db_usage import (
    FREE_PLAN_LIMITS,
    PLUS_PLAN_LIMITS,
    get_user_usage_stats,
    check_daily_feature_limit,
    record_daily_feature_usage,
    check_feature_limit,
    record_feature_usage,
    update_user_plan
)

from db_conversations import (
    generate_conversation_title,
    create_conversation,
    list_user_conversations,
    get_conversation_with_messages,
    add_message_to_conversation,
    rename_conversation,
    delete_conversation,
    search_user_conversations
)

__all__ = [
    "DB_PATH",
    "DB_DIR",
    "get_connection",
    "init_db",
    "SECRET_KEY",
    "TOKEN_TTL_SECONDS",
    "hash_password",
    "verify_password",
    "generate_signed_token",
    "verify_signed_token",
    "revoke_token",
    "cleanup_expired_revocations",
    "register_user",
    "authenticate_user",
    "get_user_by_id",
    "get_user_by_email",
    "update_user_profile",
    "FREE_PLAN_LIMITS",
    "PLUS_PLAN_LIMITS",
    "get_user_usage_stats",
    "check_daily_feature_limit",
    "record_daily_feature_usage",
    "check_feature_limit",
    "record_feature_usage",
    "update_user_plan",
    "generate_conversation_title",
    "create_conversation",
    "list_user_conversations",
    "get_conversation_with_messages",
    "add_message_to_conversation",
    "rename_conversation",
    "delete_conversation",
    "search_user_conversations"
]
