import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os

# Ensure the correct path for imports
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR / "src"))

from src.rag_engine import DhaaraRAGEngine

app = FastAPI(title="LegalGPT API", description="Backend for LegalGPT (DhaaraAI)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Engine
try:
    engine = DhaaraRAGEngine()
except Exception as e:
    print(f"Failed to initialize DhaaraRAGEngine: {e}")
    engine = None

class QueryRequest(BaseModel):
    question: str
    language: str = "English"
    user_role: str = "general"
    top_k: int = 5

class QueryResponse(BaseModel):
    answer: str
    sources: list
    question: str
    language: str
    concordance: dict

@app.post("/api/query", response_model=QueryResponse)
def query_legal_gpt(req: QueryRequest):
    if not engine:
        raise HTTPException(status_code=500, detail="RAG Engine is not initialized properly.")
    
    try:
        res = engine.query(
            question=req.question,
            language=req.language,
            user_role=req.user_role,
            top_k=req.top_k,
            stream=False
        )
        return QueryResponse(
            answer=res["answer"],
            sources=res["sources"],
            question=res["question"],
            language=res["language"],
            concordance=res["concordance"]
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

@app.post("/api/draft")
def generate_draft(req: DraftRequest):
    if not engine:
        raise HTTPException(status_code=500, detail="Legal Engine is not initialized.")
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
            relief_sought=req.relief_sought
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

from typing import Optional, List, Dict, Any
from src.concordance_data import CONCORDANCE_DB
import json

@app.get("/api/converter")
def get_bns_ipc_mappings(query: Optional[str] = None):
    """
    Returns BNS <-> IPC cross-reference dataset for rapid conversion and search.
    """
    items = CONCORDANCE_DB
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

@app.get("/api/library")
def get_legal_library(category: Optional[str] = None, search: Optional[str] = None):
    """
    Returns legal statutes, BNS/IPC concordance provisions, and statutory acts.
    """
    results = []
    
    # Primary concordance database
    for item in CONCORDANCE_DB:
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

@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine_loaded": engine is not None}

