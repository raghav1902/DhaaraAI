from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends

import legal_glossary
from routers.deps import get_optional_user

router = APIRouter(tags=["Legal Glossary"])

@router.get("/api/glossary")
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

@router.get("/api/glossary/categories")
def get_legal_glossary_categories():
    """
    Returns available legal glossary categories.
    """
    return {
        "categories": legal_glossary.get_categories()
    }

@router.get("/api/glossary/{term_id}")
def get_legal_glossary_term(term_id: str):
    """
    Returns detailed glossary term particulars, statutory provisions, and landmark cases.
    """
    term = legal_glossary.get_term_by_id(term_id)
    if not term:
        raise HTTPException(status_code=404, detail=f"Glossary term '{term_id}' not found.")
    return term
