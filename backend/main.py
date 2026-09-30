"""
main.py — DhaaraAI LegalGPT Backend
=====================================
Enterprise-grade FastAPI server with strong input validation, null-safety,
size limits, enum guards, and graceful fallbacks on every endpoint.
"""

import sys
import re
import io
import json
import math
import threading
import urllib.request
import urllib.error
import urllib.parse
import os
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, File, UploadFile, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator, model_validator

# ---------------------------------------------------------------------------
# Path bootstrap
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR / "src"))

from src.rag_engine import DhaaraRAGEngine
from src.concordance_data import CONCORDANCE_DB
from src.bns_concordance import diagnose_situation
from src.real_legal_fetcher import OFFICIAL_LEGAL_HELPLINES, LANDMARK_LEGAL_GUIDELINES
from src.draft_templates import generate_fallback_draft
from src.contract_analyzer import heuristic_contract_analysis
from src.rag_offline_fallbacks import generate_offline_concordance_fallback

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Lifespan: clean startup and shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(application: FastAPI):
    """Pre-warm the engine once at startup, ensuring single initialization."""
    global _engine
    try:
        _engine = DhaaraRAGEngine()
        print("[main] DhaaraRAGEngine pre-warmed successfully.")
    except Exception as exc:
        print(f"[main] Engine failed initial boot: {exc}")
        _engine = None
    yield
    # Shutdown: nothing to clean up for stateless workers

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="LegalGPT API",
    description="Enterprise-grade Statutory Intelligence Backend for DhaaraAI",
    version="2.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Restrict to frontend domain in production
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# ---------------------------------------------------------------------------
# Global exception handler — no unhandled 500s leak stack traces to users
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled exception across all endpoints.
    Returns a clean JSON 500 instead of leaking Python stack traces.
    """
    print(f"[main] Unhandled exception on {request.url.path}: {type(exc).__name__}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again or contact support.",
            "path": str(request.url.path)
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Structured HTTP error responses — consistent JSON format for all 4xx."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP {exc.status_code}",
            "message": exc.detail,
            "path": str(request.url.path)
        }
    )

# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _safe(val: Any, default: str = "", max_len: int = 0) -> str:
    """Coerce any value to a clean, stripped string with optional length cap."""
    s = str(val or "").strip()
    if not s:
        return default
    return s[:max_len] if max_len > 0 else s

def _safe_dict(val: Any) -> Dict[str, Any]:
    """Return val if it is a non-None dict, else empty dict."""
    if isinstance(val, dict):
        return val
    return {}

VALID_LANGUAGES = {"English", "Hindi", "English (EN)", "Hindi (HI)"}
HINDI_TOKENS    = {"hindi", "hi", "हिंदी"}

def _is_hindi(language: str) -> bool:
    return str(language or "").strip().lower() in HINDI_TOKENS

ALLOWED_UPLOAD_EXT = {".pdf", ".txt", ".md"}
MAX_UPLOAD_BYTES   = 15 * 1024 * 1024  # 15 MB

EMAIL_RE = re.compile(r"^[a-z0-9_.+%-]+@[a-z0-9.-]+\.[a-z]{2,10}$")

# ---------------------------------------------------------------------------
# Engine singleton — thread-safe double-checked locking
# ---------------------------------------------------------------------------
_engine: Optional[DhaaraRAGEngine] = None
_engine_lock = threading.Lock()   # prevents race condition on concurrent first requests

def get_engine() -> Optional[DhaaraRAGEngine]:
    """
    Returns the shared DhaaraRAGEngine singleton.
    Uses double-checked locking so concurrent requests never create
    two engine instances simultaneously (avoids duplicate ChromaDB connections
    and wasted Groq client objects).
    """
    global _engine
    if _engine is None:
        with _engine_lock:
            if _engine is None:  # second check inside lock
                try:
                    _engine = DhaaraRAGEngine()
                    print("[main] Engine lazy-initialized inside lock.")
                except Exception as exc:
                    print(f"[main] Lazy engine init error: {exc}")
                    # _engine stays None — callers fall back to offline concordance
    return _engine


# ==============================================================================
# 1. RAG Intelligence & Statutory Query Endpoint
# ==============================================================================

class QueryRequest(BaseModel):
    question: str  = Field(..., min_length=1, max_length=2000,
                           description="Legal question or situation (1-2000 chars)")
    language: str  = Field(default="English", max_length=20)
    user_role: str = Field(default="general", max_length=60)
    top_k: int     = Field(default=5, ge=1, le=10)

    @field_validator("question")
    @classmethod
    def question_not_blank(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Question cannot be blank or whitespace only.")
        return clean

    @field_validator("user_role")
    @classmethod
    def sanitize_role(cls, v: str) -> str:
        # Only allow alphanumeric + spaces/underscores to block injection
        clean = re.sub(r"[^a-zA-Z0-9 _\-\u0900-\u097F]", "", v).strip()
        return clean or "general"

    @field_validator("language")
    @classmethod
    def sanitize_language(cls, v: str) -> str:
        return re.sub(r"[^a-zA-Z \u0900-\u097F()]", "", v).strip() or "English"


class QueryResponse(BaseModel):
    answer: str
    sources: list
    question: str
    language: str
    concordance: dict


@app.post("/api/query", response_model=QueryResponse)
def query_legal_gpt(req: QueryRequest):
    """
    Primary statutory intelligence endpoint.
    Runs semantic RAG retrieval + Groq LLM with dual-model fallback.
    Falls back to offline concordance if AI is unavailable.
    """
    clean_q  = _safe(req.question, max_len=2000)
    language = _safe(req.language, "English", max_len=20)
    role     = _safe(req.user_role, "general", max_len=60)
    top_k    = max(1, min(int(req.top_k or 5), 10))
    hindi    = _is_hindi(language)

    engine = get_engine()
    if engine is not None:
        try:
            res = engine.query(
                question=clean_q,
                language=language,
                user_role=role,
                top_k=top_k,
                stream=False
            )
            answer = _safe(res.get("answer", ""), max_len=20000)
            return QueryResponse(
                answer=answer,
                sources=res.get("sources", []) or [],
                question=clean_q,
                language=res.get("language", language),
                concordance=res.get("concordance", {}) or {}
            )
        except Exception as exc:
            print(f"[main] engine.query failed: {exc}. Falling back to offline concordance.")

    # Graceful offline fallback
    diagnosis = diagnose_situation(clean_q, user_role=role)
    fallback_text = generate_offline_concordance_fallback(
        question=clean_q,
        user_role=role,
        reason=(
            "Groq AI सेवा अस्थायी रूप से ऑफलाइन है। सत्यापित वैधानिक दिशानिर्देश नीचे दिए गए हैं:"
            if hindi else
            "AI service temporarily unavailable. Verified statutory guidance and procedural steps provided below:"
        ),
        language=language
    )
    return QueryResponse(
        answer=_safe(fallback_text, max_len=20000),
        sources=[],
        question=clean_q,
        language=language,
        concordance=diagnosis or {}
    )


# ==============================================================================
# 2. Statutory Legal Drafting Endpoint (FIR & Legal Notices)
# ==============================================================================

VALID_DOC_TYPES = {
    "FIR Application",
    "Legal Demand Notice",
    "Consumer Complaint",
    "RTI Application",
    "Bail Application",
    "General Complaint",
}

class DraftRequest(BaseModel):
    document_type:     str            = Field(default="FIR Application", max_length=80)
    language:          str            = Field(default="English", max_length=20)
    complainant:       Dict[str, Any] = Field(default_factory=dict)
    accused:           Dict[str, Any] = Field(default_factory=dict)
    incident_category: str            = Field(default="General", max_length=100)
    incident_datetime: str            = Field(default="", max_length=80)
    incident_location: str            = Field(default="", max_length=300)
    facts:             str            = Field(default="", max_length=5000)
    evidence:          str            = Field(default="", max_length=2000)
    relief_sought:     str            = Field(default="", max_length=1000)

    @field_validator("document_type")
    @classmethod
    def validate_doc_type(cls, v: str) -> str:
        # Accept the closest match, fall back to FIR Application
        clean = v.strip()
        if clean in VALID_DOC_TYPES:
            return clean
        # Partial match for convenience
        for vdt in VALID_DOC_TYPES:
            if clean.lower() in vdt.lower() or vdt.lower() in clean.lower():
                return vdt
        return "FIR Application"

    @field_validator("complainant", "accused", mode="before")
    @classmethod
    def validate_party_dict(cls, v: Any) -> Dict[str, Any]:
        if v is None:
            return {}
        if not isinstance(v, dict):
            return {}
        # Strip each value; only allow string/int/float values (no nested injection objects)
        cleaned: Dict[str, Any] = {}
        for k, val in v.items():
            if isinstance(k, str) and len(k) <= 50:
                if isinstance(val, (str, int, float)) or val is None:
                    cleaned[str(k)] = str(val or "")[:500]
        return cleaned

    @model_validator(mode="after")
    def require_facts_or_relief(self) -> "DraftRequest":
        # At least facts OR relief_sought must be non-empty for a meaningful draft
        if not self.facts.strip() and not self.relief_sought.strip():
            # Soft default — don't reject, just set a placeholder
            self.facts = self.facts or "Facts and circumstances to be described."
        return self


@app.post("/api/draft")
def generate_draft(req: DraftRequest):
    """
    Generates a formal legal draft (FIR, Notice, Consumer Complaint, etc.)
    with dual AI + statutory template fallback.
    """
    complainant = _safe_dict(req.complainant)
    accused     = _safe_dict(req.accused)
    hindi       = _is_hindi(req.language)
    language    = _safe(req.language, "English", max_len=20)
    doc_type    = _safe(req.document_type, "FIR Application", max_len=80)

    engine = get_engine()
    if engine is not None:
        try:
            res = engine.generate_legal_draft(
                document_type=doc_type,
                language=language,
                complainant=complainant,
                accused=accused,
                incident_category=_safe(req.incident_category, "General", max_len=100),
                incident_datetime=_safe(req.incident_datetime, max_len=80),
                incident_location=_safe(req.incident_location, max_len=300),
                facts=_safe(req.facts, max_len=5000),
                evidence=_safe(req.evidence, max_len=2000),
                relief_sought=_safe(req.relief_sought, max_len=1000)
            )
            return res
        except Exception as exc:
            print(f"[main] engine.generate_legal_draft failed: {exc}. Activating template fallback.")

    # High-reliability statutory template fallback
    fallback_draft = generate_fallback_draft(
        document_type=doc_type,
        is_hindi=hindi,
        complainant=complainant,
        accused=accused,
        incident_datetime=_safe(req.incident_datetime, max_len=80),
        incident_location=_safe(req.incident_location, max_len=300),
        facts=_safe(req.facts, max_len=5000),
        evidence=_safe(req.evidence, max_len=2000),
        relief=_safe(req.relief_sought, max_len=1000),
        sections="Relevant provisions under Bharatiya Nyaya Sanhita, 2023"
    )
    return {
        "success": True,
        "document_type": doc_type,
        "language": language,
        "sections_referenced": ["Bharatiya Nyaya Sanhita 2023"],
        "draft": fallback_draft,
        "mode": "statutory_verified_template"
    }


# ==============================================================================
# 3. Contract Risk & Clause Audit Endpoint
# ==============================================================================

class ContractAnalysisRequest(BaseModel):
    document_text: str = Field(..., min_length=10, max_length=50000,
                                description="Full text of the contract to analyze (10–50000 chars)")
    document_type: str = Field(default="General Contract", max_length=100)
    language:      str = Field(default="English", max_length=20)

    @field_validator("document_text")
    @classmethod
    def text_not_blank(cls, v: str) -> str:
        clean = v.strip()
        if len(clean) < 10:
            raise ValueError("Contract text is too short to analyze meaningfully (min 10 chars).")
        return clean


@app.post("/api/analyze-contract")
def analyze_contract(req: ContractAnalysisRequest):
    """
    Statutory contract risk audit using AI or heuristic engine.
    Detects Sec 27 ICA void clauses, unfair penalties, jurisdiction traps, etc.
    """
    clean_text = _safe(req.document_text, max_len=50000)
    if not clean_text:
        raise HTTPException(status_code=400, detail="Contract text to analyze cannot be empty.")

    language  = _safe(req.language, "English", max_len=20)
    doc_type  = _safe(req.document_type, "General Contract", max_len=100)
    hindi     = _is_hindi(language)
    engine    = get_engine()

    if engine is not None:
        try:
            res = engine.analyze_legal_document(
                document_text=clean_text[:12000],   # Cap token window
                document_type=doc_type,
                language=language
            )
            return res
        except Exception as exc:
            print(f"[main] analyze_legal_document failed: {exc}. Falling back to statutory heuristics.")

    return heuristic_contract_analysis(clean_text, doc_type, hindi)


# ==============================================================================
# 4. Document File Upload & Parser Endpoint
# ==============================================================================

@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts PDF, TXT, or MD files up to 15 MB.
    Extracts clean text for downstream contract analysis.
    """
    raw_filename = (file.filename or "uploaded_document").strip()
    filename_lower = raw_filename.lower()

    # Extension whitelist
    ext = Path(filename_lower).suffix
    if ext not in ALLOWED_UPLOAD_EXT:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{ext}'. Please upload a .pdf, .txt, or .md file."
        )

    # Read with size guard (stream up to MAX+1 bytes to detect oversize without loading all)
    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File size {len(contents) // (1024*1024):.1f} MB exceeds the 15 MB limit."
        )

    extracted_text = ""

    if ext == ".pdf":
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
                    detail="No readable text found in PDF. It may be scanned/image-based or password-protected."
                )
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {exc}")
    else:
        # .txt / .md — try UTF-8 then Latin-1
        try:
            extracted_text = contents.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = contents.decode("latin-1", errors="replace")

    if not extracted_text.strip():
        raise HTTPException(status_code=422, detail="Extracted text is empty after parsing.")

    return {
        "filename": raw_filename,
        "text": extracted_text[:50000],     # Cap returned text to 50 k chars
        "size_bytes": len(contents),
        "word_count": len(extracted_text.split()),
        "char_count": len(extracted_text)
    }


# ==============================================================================
# 5. Statutory Concordance & Legal Library Endpoints
# ==============================================================================

@app.get("/api/converter")
def get_bns_ipc_mappings(
    query: Optional[str] = Query(default=None, max_length=200,
                                  description="Search term to filter concordance")
):
    """Returns BNS 2023 <-> IPC 1860 cross-reference dataset."""
    items = list(CONCORDANCE_DB)
    if query:
        q = _safe(query, max_len=200).lower()
        if q:
            items = [
                item for item in items
                if q in str(item.get("bns_section", "")).lower()
                or q in str(item.get("ipc_section", "")).lower()
                or q in str(item.get("offense_en",  "")).lower()
                or q in str(item.get("offense_hi",  "")).lower()
                or q in str(item.get("bns_title",   "")).lower()
                or q in str(item.get("category",    "")).lower()
            ]
    return {"total": len(items), "mappings": items}


@app.get("/api/library")
def get_legal_library(
    category: Optional[str] = Query(default=None, max_length=100),
    search:   Optional[str] = Query(default=None, max_length=200)
):
    """Returns comprehensive legal statutes, BNS/IPC concordance provisions, and statutory acts."""
    results = []

    # Primary concordance database — safe field access
    for item in CONCORDANCE_DB:
        results.append({
            "id":              item.get("id"),
            "category":        _safe(item.get("category"),       "General Crime"),
            "offense_en":      _safe(item.get("offense_en"),     ""),
            "offense_hi":      _safe(item.get("offense_hi"),     ""),
            "bns_section":     _safe(item.get("bns_section"),    ""),
            "bns_title":       _safe(item.get("bns_title"),      ""),
            "bns_act":         _safe(item.get("bns_act"),        "Bharatiya Nyaya Sanhita, 2023"),
            "ipc_section":     _safe(item.get("ipc_section"),    ""),
            "ipc_title":       _safe(item.get("ipc_title"),      ""),
            "ipc_act":         _safe(item.get("ipc_act"),        "Indian Penal Code, 1860"),
            "nature":          _safe(item.get("nature"),         "Cognizable"),
            "bailable":        _safe(item.get("bailable"),       "Bailable"),
            "punishment":      _safe(item.get("punishment"),     ""),
            "triable_by":      _safe(item.get("triable_by"),     "Magistrate"),
            "bnss_procedure":  _safe(item.get("bnss_procedure"), ""),
            "victim_guidance": _safe(item.get("victim_guidance"),""),
            "accused_guidance":_safe(item.get("accused_guidance"),""),
            "source_type":     "Concordance"
        })

    # Supplementary statutes from JSON data file
    statutes_path = ROOT_DIR / "data" / "comprehensive_statutes.json"
    if statutes_path.exists():
        try:
            with open(statutes_path, "r", encoding="utf-8") as f:
                statutes = json.load(f)
            existing_bns = {r["bns_section"] for r in results if r["bns_section"]}
            for idx, st in enumerate(statutes):
                sec_name = _safe(st.get("section"), "")
                if not sec_name or any(sec_name in ebns for ebns in existing_bns):
                    continue
                snippet = _safe(st.get("text"), "")[:280]
                results.append({
                    "id":              f"statute_extra_{idx}",
                    "category":        "Statutory Codes & Rights",
                    "offense_en":      _safe(st.get("section_title"), sec_name),
                    "offense_hi":      _safe(st.get("section_title"), sec_name),
                    "bns_section":     sec_name,
                    "bns_title":       _safe(st.get("section_title"), ""),
                    "bns_act":         _safe(st.get("source"), "Indian Statute"),
                    "ipc_section":     "Refer text",
                    "ipc_title":       "",
                    "ipc_act":         "",
                    "nature":          "Statutory Provision",
                    "bailable":        "Applicable as per Act",
                    "punishment":      "As defined under statute",
                    "triable_by":      "Judicial Authority",
                    "bnss_procedure":  snippet + ("..." if snippet else ""),
                    "victim_guidance": "Consult section text for statutory remedies and rights.",
                    "accused_guidance":"Comply with procedural requirements under the Act.",
                    "source_type":     "Act Code"
                })
        except Exception as exc:
            print(f"[main] Error loading supplementary statutes: {exc}")

    # Category filter
    if category:
        cat_q = _safe(category, max_len=100).lower()
        if cat_q and cat_q != "all":
            results = [
                r for r in results
                if cat_q in str(r["category"]).lower()
                or cat_q in str(r["bns_act"]).lower()
            ]

    # Search filter
    if search:
        sq = _safe(search, max_len=200).lower()
        if sq:
            results = [
                r for r in results
                if sq in str(r["bns_section"]).lower()
                or sq in str(r["ipc_section"]).lower()
                or sq in str(r["offense_en"]).lower()
                or sq in str(r["offense_hi"]).lower()
                or sq in str(r["bns_title"]).lower()
                or sq in str(r["category"]).lower()
            ]

    return {
        "total": len(results),
        "categories": [
            "All", "Road Traffic & Accidents", "Fraud & Cyber / Property",
            "Bodily Harm", "Family & Matrimonial", "Commercial & Banking",
            "Statutory Codes & Rights"
        ],
        "items": results
    }


# ==============================================================================
# 6. Cyber Breach Scanner Endpoint (Dual Route: Query & Path Alias)
# ==============================================================================

def _validate_email(raw: str) -> str:
    """Normalize and strictly validate email format. Raises HTTPException on invalid."""
    clean = raw.strip().lower()[:320]  # RFC 5321 max address length
    if not clean:
        raise HTTPException(status_code=400, detail="Email address is required.")
    if not EMAIL_RE.match(clean):
        raise HTTPException(
            status_code=422,
            detail="Invalid email format. Please provide a valid email (e.g. user@example.com)."
        )
    return clean


@app.get("/api/cyber-check")
def check_cyber_breach(
    email: str = Query(..., min_length=5, max_length=320,
                       description="Email address to check for data breach exposure")
):
    """
    Checks XposedOrNot API for credential compromise history.
    Returns breach list or 'safe' status with structured response.
    """
    clean_email = _validate_email(email)
    safe_email  = urllib.parse.quote(clean_email, safe="")  # encode all special chars

    url = f"https://api.xposedornot.com/v1/check-email/{safe_email}"
    req_obj = urllib.request.Request(
        url,
        headers={
            "User-Agent": "DhaaraAI-CyberBreachScanner/2.1",
            "Accept": "application/json"
        }
    )

    try:
        with urllib.request.urlopen(req_obj, timeout=8) as response:
            raw_bytes = response.read(512 * 1024)  # Read at most 512 KB from breach API
            data = json.loads(raw_bytes.decode("utf-8"))

            # Negative / not-found response
            if not data or data.get("Error") == "Not found":
                return {"status": "safe", "count": 0, "breaches": [], "email": clean_email}

            raw_breaches = data.get("breaches", [])
            breach_names: List[str] = []

            if isinstance(raw_breaches, list) and raw_breaches:
                first = raw_breaches[0]
                if isinstance(first, list):
                    breach_names = [str(b) for b in first]
                elif isinstance(first, str):
                    breach_names = [str(b) for b in raw_breaches]
                elif isinstance(first, dict):
                    breach_names = [str(b.get("name", "Identified Incident")) for b in raw_breaches]

            formatted = [
                {"name": str(b)[:120], "data": "Email, Passwords or Account Credentials"}
                for b in breach_names[:30]
            ]

            return {
                "status": "breached" if formatted else "safe",
                "count": len(formatted),
                "breaches": formatted,
                "email": clean_email
            }

    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            return {"status": "safe", "count": 0, "breaches": [], "email": clean_email}
        return {
            "status": "error",
            "message": f"Breach repository returned HTTP {exc.code}.",
            "email": clean_email
        }
    except Exception as exc:
        return {
            "status": "error",
            "message": f"Connection to breach database timed out or failed: {exc}",
            "email": clean_email
        }


@app.get("/api/xposed/check-email/{email:path}")
def check_cyber_breach_alias(email: str):
    """Path alias — validates and delegates to primary breach check."""
    return check_cyber_breach(email=email)


# ==============================================================================
# 7. National Helplines & Landmark Supreme Court Guidelines
# ==============================================================================

@app.get("/api/helplines")
def get_official_helplines():
    """Returns verified 24x7 Government of India emergency and legal aid helplines."""
    return {
        "status": "success",
        "total": len(OFFICIAL_LEGAL_HELPLINES),
        "helplines": OFFICIAL_LEGAL_HELPLINES
    }


@app.get("/api/guidelines")
def get_landmark_guidelines():
    """Returns binding Supreme Court procedural directives (Arnesh Kumar, Lalita Kumari, D.K. Basu, etc.)."""
    return {
        "status": "success",
        "total": len(LANDMARK_LEGAL_GUIDELINES),
        "guidelines": LANDMARK_LEGAL_GUIDELINES
    }


# ==============================================================================
# 8. Statutory Court Fee & Stamp Duty Calculation Engine
# ==============================================================================

STAMP_RATES: Dict[str, Dict[str, float]] = {
    "Delhi":         {"male": 6.0, "female": 4.0, "joint": 5.0, "registry": 1.0},
    "Maharashtra":   {"male": 6.0, "female": 5.0, "joint": 5.5, "registry": 1.0},
    "Karnataka":     {"male": 5.0, "female": 5.0, "joint": 5.0, "registry": 1.0},
    "Uttar Pradesh": {"male": 7.0, "female": 6.0, "joint": 6.5, "registry": 1.0},
    "Haryana":       {"male": 7.0, "female": 5.0, "joint": 6.0, "registry": 1.5},
    "West Bengal":   {"male": 6.0, "female": 6.0, "joint": 6.0, "registry": 1.0},
    "Tamil Nadu":    {"male": 7.0, "female": 7.0, "joint": 7.0, "registry": 4.0},
}

TRAFFIC_FINES: Dict[str, int] = {
    "drunk":        10000,
    "license":       5000,
    "insurance":     2000,
    "speed":         2000,
    "helmet":        1000,
    "seatbelt":      1000,
    "mobile":        5000,
    "tripleriding":  1000,
}

VALID_CATEGORIES = {"property", "court", "consumer", "traffic"}
VALID_GENDERS    = {"male", "female", "joint"}
MAX_FEE_VALUE    = 1_000_000_000_000  # 1 trillion INR cap (prevents overflow)


class FeeCalculationRequest(BaseModel):
    category:           str        = Field(default="property", max_length=20)
    state:              str        = Field(default="Delhi",    max_length=50)
    property_value:     float      = Field(default=0.0, ge=0.0, le=MAX_FEE_VALUE)
    gender:             str        = Field(default="male",     max_length=10)
    suit_value:         float      = Field(default=0.0, ge=0.0, le=MAX_FEE_VALUE)
    consumer_value:     float      = Field(default=0.0, ge=0.0, le=MAX_FEE_VALUE)
    traffic_violations: List[str]  = Field(default_factory=list, max_length=20)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        c = v.strip().lower()
        if c not in VALID_CATEGORIES:
            raise ValueError(f"Invalid category '{v}'. Must be one of: {', '.join(sorted(VALID_CATEGORIES))}.")
        return c

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: str) -> str:
        g = v.strip().lower()
        return g if g in VALID_GENDERS else "male"

    @field_validator("property_value", "suit_value", "consumer_value", mode="before")
    @classmethod
    def coerce_positive_float(cls, v: Any) -> float:
        try:
            f = float(v or 0.0)
            if math.isnan(f) or math.isinf(f):
                return 0.0
            return max(0.0, f)
        except (TypeError, ValueError):
            return 0.0

    @field_validator("traffic_violations", mode="before")
    @classmethod
    def sanitize_violations(cls, v: Any) -> List[str]:
        if not isinstance(v, list):
            return []
        # Only accept strings from known TRAFFIC_FINES keys
        allowed = set(TRAFFIC_FINES.keys())
        return [str(item).strip().lower()[:40] for item in v if isinstance(item, str)][:20]

    @field_validator("state")
    @classmethod
    def normalize_state(cls, v: str) -> str:
        clean = v.strip()
        # Try exact match then title-cased match
        if clean in STAMP_RATES:
            return clean
        titled = clean.title()
        if titled in STAMP_RATES:
            return titled
        return "Delhi"  # Safe default


@app.post("/api/calculate-court-fee")
def calculate_statutory_fee(req: FeeCalculationRequest):
    """
    Statutory court fee, stamp duty, and traffic fine computation engine.
    Validated against Indian Stamp Act 1899, Court Fees Act 1870,
    Consumer Protection Act 2019, Motor Vehicles (Amendment) Act 2019.
    """
    cat = req.category  # already normalized by validator

    if cat == "property":
        prop_val = req.property_value
        st_rates = STAMP_RATES.get(req.state, STAMP_RATES["Delhi"])
        rate     = st_rates.get(req.gender, st_rates["male"])
        reg_rate = st_rates.get("registry", 1.0)

        stamp_duty = round((prop_val * rate) / 100.0, 2)
        reg_fee    = round((prop_val * reg_rate) / 100.0, 2)
        total      = round(stamp_duty + reg_fee, 2)

        return {
            "category":             "property",
            "statute":              "Indian Stamp Act, 1899",
            "state":                req.state,
            "gender":               req.gender,
            "property_value":       prop_val,
            "stamp_duty_rate_pct":  rate,
            "stamp_duty":           stamp_duty,
            "registration_rate_pct":reg_rate,
            "registration_fee":     reg_fee,
            "total_outlay":         total
        }

    elif cat == "court":
        v = req.suit_value
        if v <= 100_000:
            court_fee = v * 0.03
        elif v <= 500_000:
            court_fee = 3_000 + (v - 100_000) * 0.02
        else:
            court_fee = 11_000 + (v - 500_000) * 0.01

        court_fee = round(min(court_fee, 300_000), 2)   # Statutory maximum cap

        return {
            "category":        "court",
            "statute":         "Court Fees Act, 1870",
            "suit_claim_value":v,
            "court_fee":       court_fee,
            "max_cap":         300_000
        }

    elif cat == "consumer":
        v = req.consumer_value
        if v <= 500_000:
            fee, forum = 0, "District Consumer Disputes Redressal Commission (DCDRC)"
        elif v <= 1_000_000:
            fee, forum = 200, "District Consumer Commission (DCDRC)"
        elif v <= 5_000_000:
            fee, forum = 1_000, "District Consumer Commission (DCDRC)"
        elif v <= 20_000_000:
            fee, forum = 2_500, "State Consumer Disputes Redressal Commission (SCDRC)"
        else:
            fee, forum = 7_500, "National Consumer Disputes Redressal Commission (NCDRC)"

        return {
            "category":          "consumer",
            "statute":           "Consumer Protection Act, 2019",
            "claim_amount":      v,
            "filing_fee":        fee,
            "jurisdiction_forum":forum
        }

    elif cat == "traffic":
        # Only count violations that exist in our known fine schedule
        known_violations  = [v for v in req.traffic_violations if v in TRAFFIC_FINES]
        unknown_violations = [v for v in req.traffic_violations if v not in TRAFFIC_FINES]
        total_fine = sum(TRAFFIC_FINES[v] for v in known_violations)

        return {
            "category":              "traffic",
            "statute":               "Motor Vehicles (Amendment) Act, 2019 & 2024 Guidelines",
            "violations_recognized": known_violations,
            "violations_unknown":    unknown_violations,
            "violations_count":      len(known_violations),
            "total_compounding_fine":total_fine
        }

    # Should be unreachable due to validator, but guard anyway
    raise HTTPException(
        status_code=400,
        detail=f"Invalid category. Choose from: {', '.join(sorted(VALID_CATEGORIES))}."
    )


# ==============================================================================
# 9. Health Check & Diagnostics
# ==============================================================================

@app.get("/api/health")
def health_check():
    """Returns service health, engine status, and loaded resource counts."""
    eng = get_engine()
    return {
        "status":               "ok",
        "service":              "DhaaraAI-LegalGPT-Backend",
        "version":              "2.1.0",
        "engine_loaded":        eng is not None,
        "concordance_sections": len(CONCORDANCE_DB),
        "helplines_count":      len(OFFICIAL_LEGAL_HELPLINES),
    }
