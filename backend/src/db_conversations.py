"""
db_conversations.py
===================
Conversations lifecycle, messages appending, IDOR-proof retrieval, and title generation.
"""

import json
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from db_core import get_connection

def generate_conversation_title(first_message: str) -> str:
    """Generates a clean, concise, 3-6 word title from first user query."""
    text = first_message.strip().replace("\n", " ")
    lower = text.lower()

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

    try:
        from mongo_sync import sync_conversation_to_mongo
        sync_conversation_to_mongo({
            "id": conv_id,
            "owner_id": owner_id,
            "title": final_title,
            "created_at": now_iso,
            "updated_at": now_iso,
            "last_message_at": now_iso,
            "is_archived": 0,
            "is_deleted": 0
        })
    except Exception:
        pass
    
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
    """Fetches conversation & its full message history with strict IDOR verification."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
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

    try:
        from mongo_sync import sync_message_to_mongo
        sync_message_to_mongo({
            "id": msg_id,
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "sources_json": sources_json,
            "metadata_json": metadata_json,
            "created_at": now_iso
        })
    except Exception:
        pass
    
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
    """Searches exclusively within conversations owned by owner_id."""
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
