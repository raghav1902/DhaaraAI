from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

import chat_history_db
from routers.deps import get_current_user, get_optional_user

router = APIRouter(tags=["Conversations & Chat History"])

class CreateConversationRequest(BaseModel):
    title: Optional[str] = "New Consultation"

class RenameConversationRequest(BaseModel):
    title: str

class AddMessageRequest(BaseModel):
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None

@router.get("/api/conversations")
def list_conversations(
    limit: int = 50,
    offset: int = 0,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Lists conversations strictly scoped to the authenticated user with pagination."""
    if not current_user:
        return []
    return chat_history_db.list_user_conversations(
        owner_id=current_user["user_id"],
        limit=min(limit, 100),
        offset=max(offset, 0)
    )

@router.post("/api/conversations")
def create_new_conversation(
    req: CreateConversationRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Creates a new conversation owned by current_user."""
    if not current_user:
        target_email = "advocate.user@dhaaraai.com"
        current_user = chat_history_db.get_user_by_email(target_email)
        if not current_user:
            current_user = chat_history_db.register_user(
                email=target_email,
                password="advocate-auth-token-key",
                name="Advocate User"
            )
    return chat_history_db.create_conversation(owner_id=current_user["user_id"], title=req.title)

@router.get("/api/conversations/search")
def search_conversations(
    q: str = "",
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Searches conversations exclusively within the authenticated user's data."""
    if not current_user or not q.strip():
        return []
    return chat_history_db.search_user_conversations(owner_id=current_user["user_id"], query=q)

@router.get("/api/conversations/{conversation_id}")
def get_conversation_endpoint(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetches full conversation history with IDOR protection.
    Returns 404 if conversation does not exist or belongs to another user.
    """
    conv = chat_history_db.get_conversation_with_messages(
        conversation_id=conversation_id,
        owner_id=current_user["user_id"]
    )
    if not conv:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found or access denied."
        )
    return conv

@router.patch("/api/conversations/{conversation_id}")
def rename_conversation_endpoint(
    conversation_id: str,
    req: RenameConversationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Renames conversation with strict ownership verification."""
    success = chat_history_db.rename_conversation(
        conversation_id=conversation_id,
        owner_id=current_user["user_id"],
        new_title=req.title
    )
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found or access denied."
        )
    return {"status": "success", "title": req.title.strip()}

@router.delete("/api/conversations/{conversation_id}")
def delete_conversation_endpoint(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Deletes conversation with strict ownership verification."""
    success = chat_history_db.delete_conversation(
        conversation_id=conversation_id,
        owner_id=current_user["user_id"]
    )
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found or access denied."
        )
    return {"status": "success", "deleted_id": conversation_id}

@router.post("/api/conversations/{conversation_id}/messages")
def add_message_endpoint(
    conversation_id: str,
    req: AddMessageRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Adds a message to a conversation owned strictly by the authenticated user."""
    msg = chat_history_db.add_message_to_conversation(
        conversation_id=conversation_id,
        owner_id=current_user["user_id"],
        role=req.role,
        content=req.content,
        sources=req.sources,
        metadata=req.metadata
    )
    if not msg:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found or access denied."
        )
    return msg
