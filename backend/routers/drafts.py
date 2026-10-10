from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

import chat_history_db
import draft_templates
from routers.deps import check_engine, get_optional_user

router = APIRouter(tags=["Legal Drafting & Templates"])

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

@router.post("/api/draft")
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

    engine = check_engine()
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
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/draft/templates")
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

@router.get("/api/draft/templates/{template_id}")
def get_draft_template(template_id: str):
    """
    Returns specific legal draft template metadata, required fields, and skeleton.
    """
    tmpl = draft_templates.get_template_by_id(template_id)
    if not tmpl:
        raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found.")
    return tmpl
