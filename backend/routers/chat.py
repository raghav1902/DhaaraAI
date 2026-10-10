from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

import chat_history_db
from routers.deps import check_engine, get_optional_user

router = APIRouter(tags=["AI Chat & LegalGPT"])

class QueryRequest(BaseModel):
    question: str
    language: str = "English"
    user_role: str = "general"
    top_k: int = 5
    conversation_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: list
    question: str
    language: str
    concordance: dict
    conversation_id: Optional[str] = None
    user_message_id: Optional[str] = None
    assistant_message_id: Optional[str] = None

@router.post("/api/query", response_model=QueryResponse)
def query_legal_gpt(
    req: QueryRequest,
    request: Request,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    engine = check_engine()
    
    clean_q = (req.question or "").strip()
    if not clean_q:
        raise HTTPException(status_code=400, detail="Query question cannot be empty.")
    
    # 1. Resolve and authenticate conversation ownership if conversation_id or current_user is provided
    conversation_id = req.conversation_id
    history_for_llm: Optional[List[Dict[str, str]]] = None
    
    # Enforce daily 7 chats limit
    if current_user:
        owner_id = current_user["user_id"]
        user_plan = current_user.get("plan", "free")
        is_pro = user_plan in ("plus", "pro", "enterprise")

        # Free tier: 7 chats per day limit
        if not is_pro and owner_id:
            allowed, used_today, daily_lim = chat_history_db.check_daily_feature_limit(owner_id, "ai_chat", daily_limit=7)
            if not allowed:
                raise HTTPException(
                    status_code=403,
                    detail={
                        "error": "LIMIT_REACHED",
                        "feature": "ai_chat",
                        "limit": daily_lim,
                        "used": used_today,
                        "message": f"आज की निःशुल्क 7 AI चैट सीमा पूरी हो चुकी है ({used_today}/{daily_lim} प्रयुक्त)। असीमित विधिक संवाद के लिए DhaaraAI Plus में अपग्रेड करें।"
                    }
                )
        
        # If conversation_id is provided, verify ownership strictly
        if conversation_id:
            existing_conv = chat_history_db.get_conversation_with_messages(
                conversation_id=conversation_id,
                owner_id=owner_id
            )
            if not existing_conv:
                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found or access denied."
                )
            history_for_llm = [
                {"role": m["role"], "content": m["content"]}
                for m in existing_conv.get("messages", [])
            ]
        else:
            new_conv = chat_history_db.create_conversation(owner_id=owner_id)
            conversation_id = new_conv["id"]
            
        # Save user message immediately
        user_msg = chat_history_db.add_message_to_conversation(
            conversation_id=conversation_id,
            owner_id=owner_id,
            role="user",
            content=req.question
        )
        user_msg_id = user_msg["id"] if user_msg else None
    else:
        # For guest/anonymous clients, track and enforce quota by IP address
        client_ip = request.client.host if request.client else "127.0.0.1"
        guest_id = f"guest_ip_{client_ip}"
        allowed, used_today, daily_lim = chat_history_db.check_daily_feature_limit(guest_id, "ai_chat", daily_limit=7)
        if not allowed:
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "LIMIT_REACHED",
                    "feature": "ai_chat",
                    "limit": daily_lim,
                    "used": used_today,
                    "message": f"आज की निःशुल्क 7 AI चैट सीमा पूरी हो चुकी है ({used_today}/{daily_lim} प्रयुक्त)। असीमित विधिक संवाद के लिए DhaaraAI Plus में अपग्रेड करें।"
                }
            )
        user_msg_id = None
    
    try:
        res = engine.query(
            question=req.question,
            language=req.language,
            user_role=req.user_role,
            top_k=req.top_k,
            stream=False,
            conversation_history=history_for_llm
        )
        
        # Save assistant response if authenticated conversation
        assistant_msg_id = None
        if current_user and conversation_id:
            assistant_msg = chat_history_db.add_message_to_conversation(
                conversation_id=conversation_id,
                owner_id=current_user["user_id"],
                role="assistant",
                content=res["answer"],
                sources=res.get("sources", []),
                metadata={"concordance": res.get("concordance", {})}
            )
            assistant_msg_id = assistant_msg["id"] if assistant_msg else None
            chat_history_db.record_daily_feature_usage(current_user["user_id"], "ai_chat")
        elif not current_user:
            client_ip = request.client.host if request.client else "127.0.0.1"
            chat_history_db.record_daily_feature_usage(f"guest_ip_{client_ip}", "ai_chat")

        return QueryResponse(
            answer=res["answer"],
            sources=res["sources"],
            question=res["question"],
            language=res["language"],
            concordance=res["concordance"],
            conversation_id=conversation_id,
            user_message_id=user_msg_id,
            assistant_message_id=assistant_msg_id
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
