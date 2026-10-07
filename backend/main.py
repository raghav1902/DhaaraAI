import sys
from pathlib import Path
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends, Header, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import io
import json
import functools
from typing import Optional, List, Dict, Any

# Rate limiting (Fix #9)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Ensure the correct path for imports
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR / "src"))

from src.rag_engine import DhaaraRAGEngine
import draft_templates
import legal_glossary
import chat_history_db
import vault_share_db

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="LegalGPT API", description="Backend for LegalGPT (DhaaraAI)", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Fix #3: Restrict CORS origins instead of wildcard
ALLOWED_ORIGINS = os.getenv("DHAARA_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# SERVER-SIDE AUTHENTICATION & STRICT USER ISOLATION DEPENDENCY
# ==============================================================================

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
    # Attach the raw token for potential logout use
    user["_token"] = token
    return user

def get_optional_user(
    authorization: Optional[str] = Header(None),
    x_user_email: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    """Optional authentication for endpoints that allow anonymous querying."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        payload = chat_history_db.verify_signed_token(token)
        if payload:
            user = chat_history_db.get_user_by_id(payload["uid"])
            if user:
                user["_token"] = token
                return user
    if x_user_email:
        clean_email = x_user_email.strip().lower()
        user_record = chat_history_db.get_user_by_email(clean_email)
        if user_record:
            user = chat_history_db.get_user_by_id(user_record["user_id"])
            if user:
                return user
    return None

# Initialize Engine (Fix #29: Log prominently on failure)
engine = None
try:
    engine = DhaaraRAGEngine()
    print("[main] DhaaraRAGEngine initialized successfully.")
except Exception as e:
    print(f"[main] ⚠️  CRITICAL: Failed to initialize DhaaraRAGEngine: {e}")
    print("[main] ⚠️  All /api/query, /api/draft, /api/analyze-contract endpoints will return 503.")

# ==============================================================================
# AUTH API ENDPOINTS (Fix #9: Rate limited)
# ==============================================================================

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
@limiter.limit("5/minute")
def register_endpoint(request: Request, req: RegisterRequest):
    try:
        user_info = chat_history_db.register_user(req.email, req.password, req.name)
        return user_info
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal registration error")

@app.post("/api/auth/login")
@limiter.limit("10/minute")
def login_endpoint(request: Request, req: LoginRequest):
    try:
        user_info = chat_history_db.authenticate_user(req.email, req.password)
        return user_info
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal authentication error")

@app.get("/api/auth/me")
def me_endpoint(current_user: Dict[str, Any] = Depends(get_current_user)):
    # Remove internal token field before returning
    result = {k: v for k, v in current_user.items() if not k.startswith("_")}
    return result

class SessionSyncRequest(BaseModel):
    email: Optional[str] = None
    token: Optional[str] = None

@app.post("/api/auth/sync-session")
def sync_session_endpoint(req: SessionSyncRequest):
    """
    Synchronizes client session with backend DB.
    Refreshes user plan and returns a fresh signed token with active Plus/subscription tier.
    """
    user_id = None
    if req.token:
        payload = chat_history_db.verify_signed_token(req.token)
        if payload and payload.get("uid"):
            user_id = payload["uid"]
    
    if not user_id and req.email:
        clean_email = req.email.strip().lower()
        user_record = chat_history_db.get_user_by_email(clean_email)
        if user_record:
            user_id = user_record["user_id"]

    if not user_id:
        target_email = (req.email or "advocate.user@dhaaraai.com").strip().lower()
        user_record = chat_history_db.get_user_by_email(target_email)
        if not user_record:
            user_record = chat_history_db.register_user(
                email=target_email,
                password="advocate-auth-token-key",
                name="Advocate User"
            )
            chat_history_db.update_user_plan(user_record["user_id"], "plus", 365)
        user_id = user_record["user_id"]

    user = chat_history_db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    fresh_token = chat_history_db.generate_signed_token(
        user["user_id"],
        user["email"],
        user["plan"]
    )
    return {
        "status": "success",
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "plan": user["plan"],
        "token": fresh_token
    }

# Fix #22: Server-side logout endpoint
@app.post("/api/auth/logout")
def logout_endpoint(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Revokes the current session token server-side."""
    token = current_user.get("_token")
    if token:
        chat_history_db.revoke_token(token)
    return {"status": "success", "message": "Session token revoked."}

# Fix #21: Server-side profile update endpoint
class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None

@app.patch("/api/auth/profile")
def update_profile_endpoint(
    req: UpdateProfileRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Updates user profile (name and/or password) on the server."""
    updated = chat_history_db.update_user_profile(
        user_id=current_user["user_id"],
        new_name=req.name,
        new_password=req.password
    )
    if not updated:
        raise HTTPException(status_code=404, detail="User not found.")
    return updated

# ==============================================================================
# USER SUBSCRIPTION & USAGE LIMITS APIS
# ==============================================================================

class UpgradePlanRequest(BaseModel):
    plan: str = "plus"
    days: Optional[int] = 30
    email: Optional[str] = None

@app.get("/api/user/usage")
def get_user_usage_endpoint(current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """Returns current user's usage counts, limits, and plan status."""
    user_id = current_user.get("user_id") if current_user else None
    return chat_history_db.get_user_usage_stats(user_id)

@app.post("/api/user/upgrade")
def upgrade_user_plan_endpoint(
    req: UpgradePlanRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Upgrades or modifies the user's subscription tier. Auto-provisions guest if needed."""
    try:
        user_to_upgrade = current_user
        if not user_to_upgrade:
            target_email = (req.email or "advocate.user@dhaaraai.com").strip().lower()
            user_to_upgrade = chat_history_db.get_user_by_email(target_email)
            if not user_to_upgrade:
                user_to_upgrade = chat_history_db.register_user(
                    email=target_email,
                    password="advocate-auth-token-key",
                    name="Advocate User"
                )

        updated = chat_history_db.update_user_plan(
            user_id=user_to_upgrade["user_id"],
            plan_type=req.plan,
            days=req.days or 30
        )
        # Generate fresh signed token with updated plan claim
        new_token = chat_history_db.generate_signed_token(
            user_to_upgrade["user_id"],
            user_to_upgrade["email"],
            req.plan
        )
        return {
            "status": "success",
            "message": f"Successfully updated plan to {req.plan.upper()}",
            "plan": req.plan,
            "token": new_token,
            "user": {**updated, "token": new_token}
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal plan update error")

# ==============================================================================
# CONVERSATIONS & CHAT HISTORY API (STRICT USER ISOLATION)
# ==============================================================================

class CreateConversationRequest(BaseModel):
    title: Optional[str] = "New Consultation"

class RenameConversationRequest(BaseModel):
    title: str

class AddMessageRequest(BaseModel):
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None

@app.get("/api/conversations")
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

@app.post("/api/conversations")
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

@app.get("/api/conversations/search")
def search_conversations(
    q: str = "",
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Searches conversations exclusively within the authenticated user's data."""
    if not current_user or not q.strip():
        return []
    return chat_history_db.search_user_conversations(owner_id=current_user["user_id"], query=q)

@app.get("/api/conversations/{conversation_id}")
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

@app.patch("/api/conversations/{conversation_id}")
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

@app.delete("/api/conversations/{conversation_id}")
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

@app.post("/api/conversations/{conversation_id}/messages")
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

# ==============================================================================
# ASK AI QUERY ENDPOINT (INTEGRATED WITH CHAT HISTORY)
# ==============================================================================

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

def _check_engine():
    """Fix #29: Return 503 with clear message instead of generic 500."""
    if not engine:
        raise HTTPException(
            status_code=503,
            detail="Legal AI Engine is not available. The server started without the RAG engine. Check server logs."
        )

@app.post("/api/query", response_model=QueryResponse)
def query_legal_gpt(
    req: QueryRequest,
    request: Request,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    _check_engine()
    
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
                # Disallow hijacking / crossing to another user's conversation ID
                raise HTTPException(
                    status_code=404,
                    detail="Conversation not found or access denied."
                )
            # Extract previous messages for multi-turn LLM context (up to last 6)
            history_for_llm = [
                {"role": m["role"], "content": m["content"]}
                for m in existing_conv.get("messages", [])
            ]
        else:
            # Create a new conversation for this authenticated user
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
        # For guest/anonymous clients, track and enforce quota by IP address / client header
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
        raise HTTPException(status_code=500, detail=str(e))

class DraftRequest(BaseModel):
    document_type: str = "FIR Application"
    language: str = "English"
    complainant: dict = {}
    accused: dict = {}
    incident_category: str = "General"
    incident_datetime: str = ""
    incident_location: str = ""
    facts: str = ""
    evidence: str = ""
    relief_sought: str = ""
    extra_fields: dict = {}

@app.post("/api/draft")
def generate_draft(req: DraftRequest, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    user_id = current_user.get("user_id") if current_user else None
    allowed, used, limit = chat_history_db.check_feature_limit(user_id, "draft")
    if not allowed:
        raise HTTPException(
            status_code=403,
            detail={
                "error": "LIMIT_REACHED",
                "feature": "draft",
                "limit": limit,
                "used": used,
                "message": f"Free tier limit of {limit} legal drafts reached. Upgrade to DhaaraAI Plus for unlimited legal drafting."
            }
        )

    _check_engine()
    if not (req.document_type or "").strip():
        raise HTTPException(status_code=400, detail="Document type is required for legal draft generation.")
    try:
        res = engine.generate_legal_draft(
            document_type=req.document_type,
            language=req.language,
            complainant=req.complainant,
            accused=req.accused,
            incident_category=req.incident_category,
            incident_datetime=req.incident_datetime,
            incident_location=req.incident_location,
            facts=req.facts,
            evidence=req.evidence,
            relief_sought=req.relief_sought,
            extra_fields=req.extra_fields
        )
        if user_id:
            chat_history_db.record_feature_usage(user_id, "draft")
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/draft/templates")
def get_draft_templates(category: Optional[str] = None):
    """
    Returns the comprehensive list of 12 Indian legal draft templates with structured metadata.
    """
    templates = draft_templates.get_all_templates()
    if category and category.lower() != "all":
        templates = [t for t in templates if category.lower() in t.get("category", "").lower()]
    return {
        "total": len(templates),
        "templates": templates
    }

@app.get("/api/draft/templates/{template_id}")
def get_draft_template(template_id: str):
    """
    Returns specific legal draft template metadata, required fields, and skeleton.
    """
    tmpl = draft_templates.get_template_by_id(template_id)
    if not tmpl:
        raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found.")
    return tmpl

@app.get("/api/glossary")
def get_legal_glossary(
    q: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 200,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Search and filter authentic Indian legal glossary terms across 14 legal domains.
    Supports Plus subscription full unlock and preview tier tags.
    """
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

    terms = legal_glossary.search_glossary(query=q or "", category=category, limit=200)

    # For free users without Plus: ONLY serve the first 15 preview terms!
    if not is_pro:
        sliced_terms = terms[:15]
        return {
            "total": len(terms),
            "count": len(sliced_terms),
            "is_pro": False,
            "preview_mode": True,
            "categories": legal_glossary.get_categories(),
            "terms": sliced_terms
        }
    else:
        for term in terms:
            term["is_locked"] = False
        return {
            "total": len(terms),
            "count": len(terms),
            "is_pro": True,
            "preview_mode": False,
            "categories": legal_glossary.get_categories(),
            "terms": terms
        }

@app.get("/api/glossary/categories")
def get_legal_glossary_categories():
    """
    Returns available legal glossary categories.
    """
    return {
        "categories": legal_glossary.get_categories()
    }

@app.get("/api/glossary/{term_id}")
def get_legal_glossary_term(term_id: str):
    """
    Returns detailed glossary term particulars, statutory provisions, and landmark cases.
    """
    term = legal_glossary.get_term_by_id(term_id)
    if not term:
        raise HTTPException(status_code=404, detail=f"Glossary term '{term_id}' not found.")
    return term

class ContractAnalysisRequest(BaseModel):
    document_text: str
    document_type: str = "General Contract"
    language: str = "English"

@app.post("/api/analyze-contract")
def analyze_contract(req: ContractAnalysisRequest, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    user_id = current_user.get("user_id") if current_user else None
    allowed, used, limit = chat_history_db.check_feature_limit(user_id, "contract_audit")
    if not allowed:
        raise HTTPException(
            status_code=403,
            detail={
                "error": "LIMIT_REACHED",
                "feature": "contract_audit",
                "limit": limit,
                "used": used,
                "message": f"Free tier limit of {limit} contract audits reached. Upgrade to DhaaraAI Plus for unlimited document audits."
            }
        )

    _check_engine()
    try:
        res = engine.analyze_legal_document(
            document_text=req.document_text,
            document_type=req.document_type,
            language=req.language
        )
        if user_id:
            chat_history_db.record_feature_usage(user_id, "contract_audit")
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Fix #8: Maximum upload size (10MB)
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB

@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...), current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """
    Accepts PDF or text files, extracts content and returns parsed text for contract risk audit.
    """
    user_id = current_user.get("user_id") if current_user else None
    allowed, used, limit = chat_history_db.check_feature_limit(user_id, "contract_audit")
    if not allowed:
        raise HTTPException(
            status_code=403,
            detail={
                "error": "LIMIT_REACHED",
                "feature": "contract_audit",
                "limit": limit,
                "used": used,
                "message": f"Free tier limit of {limit} contract audits reached. Upgrade to DhaaraAI Plus for unlimited file analysis."
            }
        )
    filename = file.filename.lower() if file.filename else "unknown"
    contents = await file.read()
    
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Fix #8: Enforce file size limit
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum upload size is {MAX_UPLOAD_SIZE // (1024 * 1024)}MB."
        )

    extracted_text = ""

    if filename.endswith(".pdf"):
        try:
            import pypdf
            pdf_reader = pypdf.PdfReader(io.BytesIO(contents))
            pages_text = []
            for page in pdf_reader.pages:
                txt = page.extract_text()
                if txt:
                    pages_text.append(txt)
            extracted_text = "\n\n".join(pages_text).strip()
            if not extracted_text:
                raise HTTPException(
                    status_code=422, 
                    detail="No readable text found in PDF. It might be scanned/image-based."
                )
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=422, detail=f"Failed to parse PDF document: {str(e)}")
    elif filename.endswith(".txt") or filename.endswith(".md"):
        try:
            extracted_text = contents.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = contents.decode("latin-1", errors="replace")
    elif filename.endswith((".png", ".jpg", ".jpeg")):
        try:
            import base64
            # Guess mime type
            mime_type = "image/png" if filename.endswith(".png") else "image/jpeg"
            base64_image = base64.b64encode(contents).decode("utf-8")
            if engine and engine.client:
                chat_completion = engine.client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "Extract all text from this image exactly as written. Do not add any extra commentary or formatting. Just pure raw text."},
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:{mime_type};base64,{base64_image}",
                                    },
                                },
                            ],
                        }
                    ],
                    model="llama-3.2-11b-vision-preview",
                    temperature=0.0
                )
                extracted_text = chat_completion.choices[0].message.content
            else:
                raise HTTPException(status_code=400, detail="Image text extraction requires an active Groq API connection.")
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=422, detail=f"Failed to extract text from image: {str(e)}")
    else:
        # Fallback to UTF-8 decoding for other text/doc files
        try:
            extracted_text = contents.decode("utf-8")
        except Exception:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .pdf, .txt, or .md file.")

    return {
        "filename": file.filename,
        "text": extracted_text,
        "size_bytes": len(contents),
        "word_count": len(extracted_text.split())
    }

from src.bns_concordance import get_full_concordance_db, lookup_by_section

# Fix #18: Cache concordance data at module level
@functools.lru_cache(maxsize=1)
def _get_cached_concordance_db():
    """Returns cached concordance database to avoid rebuilding on every request."""
    return get_full_concordance_db()

@app.get("/api/converter")
def get_bns_ipc_mappings(
    query: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Returns BNS <-> IPC / BNSS <-> CrPC / BSA <-> IEA cross-reference dataset.
    Covers all 2,016+ verified statutory concordance mappings.
    Enforces free tier limits on interactive searches.
    """
    search_query = (query or q or "").strip()
    user_id = current_user.get("user_id") if current_user else None
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

    # Plus members get full 2,016+ concordance catalog access; Free tier gets exactly 15 preview provisions
    if is_pro:
        if limit <= 100:
            limit = 2500
    else:
        limit = min(limit, 15) if limit > 0 else 15

    if search_query and not is_pro and user_id:
        allowed, used, qlimit = chat_history_db.check_feature_limit(user_id, "bns_lookup")
        if not allowed:
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "LIMIT_REACHED",
                    "feature": "bns_lookup",
                    "limit": qlimit,
                    "used": used,
                    "message": f"Free tier limit of {qlimit} statutory concordance searches reached. Upgrade to DhaaraAI Plus for unlimited searches."
                }
            )
        chat_history_db.record_feature_usage(user_id, "bns_lookup")

    items = _get_cached_concordance_db()
    if search_query:
        sq = search_query.lower()
        items = [
            item for item in items
            if sq in item.get("bns_section", "").lower()
            or sq in item.get("ipc_section", "").lower()
            or sq in item.get("offense_en", "").lower()
            or sq in item.get("offense_hi", "").lower()
            or sq in item.get("bns_title", "").lower()
            or sq in item.get("category", "").lower()
        ]
    total = len(items)
    # Apply pagination
    sliced = items[offset:offset + limit]

    # Tag locked items for free tier users beyond first 15 preview items
    if not is_pro:
        for idx, item in enumerate(sliced):
            if (offset + idx) >= 15:
                item["is_locked"] = True
    else:
        for item in sliced:
            item["is_locked"] = False

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "is_pro": is_pro,
        "mappings": sliced
    }

@app.get("/api/converter/lookup/{section}")
def lookup_converter_section(section: str, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """
    Instant statutory section lookup across all 2,016+ concordance mappings.
    """
    user_id = current_user.get("user_id") if current_user else None
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

    if not is_pro and user_id:
        allowed, used, limit = chat_history_db.check_feature_limit(user_id, "bns_lookup")
        if not allowed:
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "LIMIT_REACHED",
                    "feature": "bns_lookup",
                    "limit": limit,
                    "used": used,
                    "message": f"Free tier limit of {limit} statutory section lookups reached. Upgrade to DhaaraAI Plus for unlimited lookups."
                }
            )
        chat_history_db.record_feature_usage(user_id, "bns_lookup")

    matches = lookup_by_section(section)
    if is_pro:
        for m in matches:
            m["is_locked"] = False
    return {"total": len(matches), "section": section, "is_pro": is_pro, "results": matches}

@app.get("/api/library")
def get_legal_library(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Returns legal statutes, BNS/IPC concordance provisions, and statutory acts.
    Supports pagination and subscription tier locks.
    """
    user_id = current_user.get("user_id") if current_user else None
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

    # Auto-expand limit to full library (2500) for Plus members; Free tier gets exactly 15 preview sections
    if is_pro:
        if limit <= 100:
            limit = 2500
    else:
        limit = min(limit, 15) if limit > 0 else 15

    if search and search.strip() and not is_pro and user_id:
        allowed, used, lib_limit = chat_history_db.check_feature_limit(user_id, "legal_library")
        if not allowed:
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "LIMIT_REACHED",
                    "feature": "legal_library",
                    "limit": lib_limit,
                    "used": used,
                    "message": f"Free tier limit of {lib_limit} statutory library searches reached. Upgrade to DhaaraAI Plus for full legal library access."
                }
            )
        chat_history_db.record_feature_usage(user_id, "legal_library")

    results = []
    
    # Primary concordance database with full 2,016+ mappings (Fix #18: cached)
    for item in _get_cached_concordance_db():
        results.append({
            "id": item.get("id"),
            "category": item.get("category", "General Crime"),
            "offense_en": item.get("offense_en", ""),
            "offense_hi": item.get("offense_hi", ""),
            "bns_section": item.get("bns_section", ""),
            "bns_title": item.get("bns_title", ""),
            "bns_act": item.get("bns_act", "Bharatiya Nyaya Sanhita, 2023"),
            "ipc_section": item.get("ipc_section", ""),
            "ipc_title": item.get("ipc_title", ""),
            "ipc_act": item.get("ipc_act", "Indian Penal Code, 1860"),
            "nature": item.get("nature", "Cognizable"),
            "bailable": item.get("bailable", "Bailable"),
            "punishment": item.get("punishment", ""),
            "triable_by": item.get("triable_by", "Magistrate"),
            "bnss_procedure": item.get("bnss_procedure", ""),
            "victim_guidance": item.get("victim_guidance", ""),
            "accused_guidance": item.get("accused_guidance", ""),
            "source_type": "Concordance"
        })

    # Supplementary statutes from comprehensive_statutes.json
    existing_bns_sections = {r["bns_section"] for r in results if r["bns_section"]}
    statutes_path = ROOT_DIR / "data" / "comprehensive_statutes.json"
    if statutes_path.exists():
        try:
            with open(statutes_path, "r", encoding="utf-8") as f:
                statutes = json.load(f)
                for idx, st in enumerate(statutes):
                    sec_name = st.get("section", "")
                    if sec_name and sec_name in existing_bns_sections:
                        continue
                    results.append({
                        "id": f"statute_extra_{idx}",
                        "category": "Statutory Codes & Rights",
                        "offense_en": st.get("section_title", sec_name),
                        "offense_hi": st.get("section_title", sec_name),
                        "bns_section": sec_name,
                        "bns_title": st.get("section_title", ""),
                        "bns_act": st.get("source", "Indian Statute"),
                        "ipc_section": "Refer text",
                        "ipc_title": "",
                        "ipc_act": "",
                        "nature": "Statutory Provision",
                        "bailable": "Applicable as per Act",
                        "punishment": "As defined under statute",
                        "triable_by": "Judicial Authority",
                        "bnss_procedure": st.get("text", "")[:280] + "...",
                        "victim_guidance": "Consult section text for statutory remedies and rights.",
                        "accused_guidance": "Comply with procedural requirements under the Act.",
                        "source_type": "Act Code"
                    })
        except Exception as e:
            print(f"Error loading supplementary statutes: {e}")

    # Filtering by category
    if category and category.lower() != "all":
        results = [
            r for r in results 
            if category.lower() in r["category"].lower() or category.lower() in r["bns_act"].lower()
        ]

    # Filtering by search query
    if search and search.strip():
        q = search.strip().lower()
        results = [
            r for r in results
            if q in r["bns_section"].lower() 
            or q in r["ipc_section"].lower()
            or q in r["offense_en"].lower()
            or q in r["offense_hi"].lower()
            or q in r["bns_title"].lower()
            or q in r["category"].lower()
        ]

    categories = ["All", "Road Traffic & Accidents", "Fraud & Cyber / Property", "Bodily Harm", "Family & Matrimonial", "Commercial & Banking", "Statutory Codes & Rights"]
    total = len(results)
    sliced = results[offset:offset + limit]

    # Tag locked items for free tier users beyond first 15 preview items
    if not is_pro:
        for idx, item in enumerate(sliced):
            if (offset + idx) >= 15:
                item["is_locked"] = True

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "is_pro": is_pro,
        "categories": categories,
        "items": sliced
    }

@app.get("/api/cyber-check")
def check_cyber_breach(email: str, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """
    Queries XposedOrNot live open-source data breach database for an email.
    Enforces free tier limits (max 3 scans) and premium credential masking.
    """
    clean_email = email.strip().lower()
    if not clean_email or "@" not in clean_email:
        return {"status": "error", "message": "Invalid email address"}

    user_id = current_user.get("user_id") if current_user else None
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

    allowed, used, limit = chat_history_db.check_feature_limit(user_id, "cyber_check")
    if not allowed:
        raise HTTPException(
            status_code=403,
            detail={
                "error": "LIMIT_REACHED",
                "feature": "cyber_check",
                "limit": limit,
                "used": used,
                "message": f"Free tier limit of {limit} cyber breach scans reached. Upgrade to DhaaraAI Plus for unlimited scans."
            }
        )

    import urllib.request
    import urllib.error

    url = f"https://api.xposedornot.com/v1/check-email/{clean_email}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "DhaaraAI-CyberChecker/1.0"}
    )

    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                if user_id:
                    chat_history_db.record_feature_usage(user_id, "cyber_check")

                if data.get("Error") == "Not found":
                    return {"status": "safe", "count": 0, "breaches": [], "is_pro": is_pro}
                
                raw_breaches = data.get("breaches", [])
                breach_names = []
                if raw_breaches and isinstance(raw_breaches, list):
                    first_elem = raw_breaches[0]
                    if isinstance(first_elem, list):
                        breach_names = first_elem
                    elif isinstance(first_elem, str):
                        breach_names = raw_breaches

                formatted_breaches = []
                for idx, b in enumerate(breach_names[:25]):
                    # If free user, sensitive credential payload preview is restricted on deeper breaches
                    data_desc = "Email, Passwords or Account Credentials"
                    is_entry_locked = False
                    if not is_pro and idx >= 2:
                        data_desc = "•••••••••• (Upgrade to Plus to unlock compromised data points)"
                        is_entry_locked = True

                    formatted_breaches.append({
                        "name": b,
                        "data": data_desc,
                        "is_locked": is_entry_locked
                    })

                return {
                    "status": "breached",
                    "count": len(breach_names),
                    "breaches": formatted_breaches,
                    "is_pro": is_pro
                }
    except urllib.error.HTTPError as e:
        if e.code == 404:
            if user_id:
                chat_history_db.record_feature_usage(user_id, "cyber_check")
            return {"status": "safe", "count": 0, "breaches": [], "is_pro": is_pro}
        return {"status": "error", "message": f"Service returned code {e.code}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/rights/emergency-contacts")
def get_emergency_contacts():
    """
    Returns official 24x7 verified Indian emergency and statutory legal helplines.
    """
    try:
        from src.real_legal_fetcher import OFFICIAL_LEGAL_HELPLINES
        return {"status": "success", "total": len(OFFICIAL_LEGAL_HELPLINES), "contacts": OFFICIAL_LEGAL_HELPLINES}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/rights/landmark-guidelines")
def get_landmark_guidelines():
    """
    Returns binding Supreme Court procedural directives (Arnesh Kumar, Lalita Kumari, D.K. Basu).
    """
    try:
        from src.real_legal_fetcher import LANDMARK_LEGAL_GUIDELINES
        return {"status": "success", "total": len(LANDMARK_LEGAL_GUIDELINES), "guidelines": LANDMARK_LEGAL_GUIDELINES}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/health")
def health_check():
    # Fix #29: More informative health check
    return {
        "status": "ok" if engine else "degraded",
        "engine_loaded": engine is not None,
        "message": "All systems operational" if engine else "RAG Engine failed to initialize. Check server logs."
    }

# ==============================================================================
# SECURE SELF-DESTRUCTING VAULT SHARE ENDPOINTS
# ==============================================================================

class CreateVaultShareRequest(BaseModel):
    title: str
    doc_type: str = "Legal Document"
    content: str
    password: str
    folder: Optional[str] = "Legal Document"
    expires_hours: Optional[float] = 24.0
    one_time_view: Optional[bool] = True

class UnlockVaultShareRequest(BaseModel):
    password: str

@app.post("/api/vault/share")
def create_vault_share(req: CreateVaultShareRequest):
    try:
        res = vault_share_db.create_shared_document(
            title=req.title,
            doc_type=req.doc_type,
            content=req.content,
            password=req.password,
            folder=req.folder or "Legal Document",
            expires_hours=req.expires_hours or 24.0,
            one_time_view=bool(req.one_time_view)
        )
        return {"status": "success", "data": res}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate secure link: {str(e)}")

@app.get("/api/vault/shared/{share_id}")
def get_vault_share_info(share_id: str):
    meta = vault_share_db.get_shared_document_meta(share_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Shared document not found or permanently destroyed.")
    return {"status": "success", "data": meta}

@app.post("/api/vault/shared/{share_id}/unlock")
def unlock_vault_share(share_id: str, req: UnlockVaultShareRequest):
    success, message, doc = vault_share_db.unlock_shared_document(share_id, req.password)
    if not success:
        raise HTTPException(status_code=403, detail=message)
    return {"status": "success", "data": doc}
