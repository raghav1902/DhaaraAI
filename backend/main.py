import sys
from pathlib import Path
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Depends, Header
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import io
from typing import Optional, List, Dict, Any

# Ensure the correct path for imports
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR / "src"))

from src.rag_engine import DhaaraRAGEngine
import draft_templates
import legal_glossary
import chat_history_db
import vault_share_db

app = FastAPI(title="LegalGPT API", description="Backend for LegalGPT (DhaaraAI)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
    return user

def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """Optional authentication for endpoints that allow anonymous querying."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split("Bearer ", 1)[1].strip()
    payload = chat_history_db.verify_signed_token(token)
    if not payload:
        return None
    return chat_history_db.get_user_by_id(payload["uid"])

# Initialize Engine
try:
    engine = DhaaraRAGEngine()
except Exception as e:
    print(f"Failed to initialize DhaaraRAGEngine: {e}")
    engine = None

# ==============================================================================
# AUTH API ENDPOINTS
# ==============================================================================

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
def register_endpoint(req: RegisterRequest):
    try:
        user_info = chat_history_db.register_user(req.email, req.password, req.name)
        return user_info
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal registration error")

@app.post("/api/auth/login")
def login_endpoint(req: LoginRequest):
    try:
        user_info = chat_history_db.authenticate_user(req.email, req.password)
        return user_info
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal authentication error")

@app.get("/api/auth/me")
def me_endpoint(current_user: Dict[str, Any] = Depends(get_current_user)):
    return current_user

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
def list_conversations(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Lists conversations strictly scoped to the authenticated user."""
    return chat_history_db.list_user_conversations(owner_id=current_user["user_id"])

@app.post("/api/conversations")
def create_new_conversation(
    req: CreateConversationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Creates a new conversation owned by current_user."""
    return chat_history_db.create_conversation(owner_id=current_user["user_id"], title=req.title)

@app.get("/api/conversations/search")
def search_conversations(
    q: str = "",
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Searches conversations exclusively within the authenticated user's data."""
    if not q.strip():
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

@app.post("/api/query", response_model=QueryResponse)
def query_legal_gpt(
    req: QueryRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    if not engine:
        raise HTTPException(status_code=500, detail="RAG Engine is not initialized properly.")
    
    clean_q = (req.question or "").strip()
    if not clean_q:
        raise HTTPException(status_code=400, detail="Query question cannot be empty.")
    
    # 1. Resolve and authenticate conversation ownership if conversation_id or current_user is provided
    conversation_id = req.conversation_id
    history_for_llm: Optional[List[Dict[str, str]]] = None
    
    if current_user:
        owner_id = current_user["user_id"]
        
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
def generate_draft(req: DraftRequest):
    if not engine:
        raise HTTPException(status_code=500, detail="Legal Engine is not initialized.")
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
    limit: int = 60
):
    """
    Search and filter authentic Indian legal glossary terms across 14 legal domains.
    """
    terms = legal_glossary.search_glossary(query=q or "", category=category, limit=limit)
    return {
        "total": len(terms),
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
def analyze_contract(req: ContractAnalysisRequest):
    if not engine:
        raise HTTPException(status_code=500, detail="Legal Engine is not initialized.")
    try:
        res = engine.analyze_legal_document(
            document_text=req.document_text,
            document_type=req.document_type,
            language=req.language
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts PDF or text files, extracts content and returns parsed text for contract risk audit.
    """
    filename = file.filename.lower() if file.filename else "unknown"
    contents = await file.read()
    
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

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
                    model="qwen/qwen3.8-27b",
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

from typing import Optional, List, Dict, Any
from src.bns_concordance import get_full_concordance_db, lookup_by_section
import json

@app.get("/api/converter")
def get_bns_ipc_mappings(query: Optional[str] = None):
    """
    Returns BNS <-> IPC / BNSS <-> CrPC / BSA <-> IEA cross-reference dataset for rapid conversion and search.
    Covers all 2,016+ verified statutory concordance mappings.
    """
    items = get_full_concordance_db()
    if query and query.strip():
        q = query.strip().lower()
        items = [
            item for item in items
            if q in item.get("bns_section", "").lower()
            or q in item.get("ipc_section", "").lower()
            or q in item.get("offense_en", "").lower()
            or q in item.get("offense_hi", "").lower()
            or q in item.get("bns_title", "").lower()
            or q in item.get("category", "").lower()
        ]
    return {"total": len(items), "mappings": items}

@app.get("/api/converter/lookup/{section}")
def lookup_converter_section(section: str):
    """
    Instant statutory section lookup across all 2,016+ concordance mappings.
    """
    matches = lookup_by_section(section)
    return {"total": len(matches), "section": section, "results": matches}

@app.get("/api/library")
def get_legal_library(category: Optional[str] = None, search: Optional[str] = None):
    """
    Returns legal statutes, BNS/IPC concordance provisions, and statutory acts.
    """
    results = []
    
    # Primary concordance database with full 2,016+ mappings
    for item in get_full_concordance_db():
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
    statutes_path = ROOT_DIR / "data" / "comprehensive_statutes.json"
    if statutes_path.exists():
        try:
            with open(statutes_path, "r", encoding="utf-8") as f:
                statutes = json.load(f)
                for idx, st in enumerate(statutes):
                    sec_name = st.get("section", "")
                    # Avoid duplicate if already covered in concordance
                    if any(r["bns_section"] in sec_name for r in results if r["bns_section"]):
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

    # Available categories
    categories = ["All", "Road Traffic & Accidents", "Fraud & Cyber / Property", "Bodily Harm", "Family & Matrimonial", "Commercial & Banking", "Statutory Codes & Rights"]

    return {
        "total": len(results),
        "categories": categories,
        "items": results
    }

@app.get("/api/cyber-check")
def check_cyber_breach(email: str):
    """
    Queries XposedOrNot live open-source data breach database for an email.
    """
    clean_email = email.strip().lower()
    if not clean_email or "@" not in clean_email:
        return {"status": "error", "message": "Invalid email address"}

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
                # If email not found in any breach
                if data.get("Error") == "Not found":
                    return {"status": "safe", "count": 0, "breaches": []}
                
                # If breaches found: data["breaches"] is typically [ [list of breach names] ]
                raw_breaches = data.get("breaches", [])
                breach_names = []
                if raw_breaches and isinstance(raw_breaches, list):
                    first_elem = raw_breaches[0]
                    if isinstance(first_elem, list):
                        breach_names = first_elem
                    elif isinstance(first_elem, str):
                        breach_names = raw_breaches

                formatted_breaches = [
                    {"name": b, "data": "Email, Passwords or Account Credentials"}
                    for b in breach_names[:25]
                ]

                return {
                    "status": "breached",
                    "count": len(breach_names),
                    "breaches": formatted_breaches
                }
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return {"status": "safe", "count": 0, "breaches": []}
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
    return {"status": "ok", "engine_loaded": engine is not None}

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



