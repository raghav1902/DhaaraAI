import os
import sys
from pathlib import Path
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

# Ensure path resolution
ROOT_DIR = Path(__file__).resolve().parent
SRC_DIR = ROOT_DIR / "src"
ROUTERS_DIR = ROOT_DIR / "routers"

for path in [str(ROOT_DIR), str(SRC_DIR), str(ROUTERS_DIR)]:
    if path not in sys.path:
        sys.path.insert(0, path)

from routers.deps import limiter, get_engine, set_engine, get_current_user, get_optional_user
from routers import auth, conversations, chat, drafts, glossary, contracts, concordance, tools
from src.rag_engine import DhaaraRAGEngine

# Initialize FastAPI Application
app = FastAPI(
    title="LegalGPT API",
    description="Enterprise Indian Legal Intelligence & Statutory Drafting Workstation Backend",
    version="2.0.0"
)

# Rate Limiter Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Policy
ALLOWED_ORIGINS = os.getenv("DHAARA_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:8000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Engine Singleton
try:
    engine = DhaaraRAGEngine()
    set_engine(engine)
    print("[main] DhaaraRAGEngine initialized successfully.")
except Exception as e:
    engine = None
    set_engine(None)
    print(f"[main] ⚠️  CRITICAL: Failed to initialize DhaaraRAGEngine: {e}")
    print("[main] ⚠️  All /api/query, /api/draft, /api/analyze-contract endpoints will return 503.")

# Register Modular Sub-Routers
app.include_router(auth.router)
app.include_router(conversations.router)
app.include_router(chat.router)
app.include_router(drafts.router)
app.include_router(glossary.router)
app.include_router(contracts.router)
app.include_router(concordance.router)
app.include_router(tools.router)

# Health & System Status Endpoints
@app.get("/api/health", tags=["System"])
def health_check():
    eng = get_engine()
    return {
        "status": "ok" if eng else "degraded",
        "engine_loaded": eng is not None,
        "message": "All systems operational" if eng else "RAG Engine failed to initialize. Check server logs."
    }

@app.get("/", tags=["System"])
def root():
    return {
        "service": "DhaaraAI (LegalGPT) API",
        "version": "2.0.0",
        "status": "active",
        "docs": "/docs"
    }
