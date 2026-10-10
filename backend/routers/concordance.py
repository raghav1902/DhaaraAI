import json
import functools
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends

import chat_history_db
from src.bns_concordance import get_full_concordance_db, lookup_by_section
from routers.deps import ROOT_DIR, get_optional_user

router = APIRouter(tags=["Statutory Concordance & Library"])

@functools.lru_cache(maxsize=1)
def _get_cached_concordance_db():
    """Returns cached concordance database to avoid rebuilding on every request."""
    return get_full_concordance_db()

@router.get("/api/converter")
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
    """
    search_query = (query or q or "").strip()
    user_id = current_user.get("user_id") if current_user else None
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

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
    sliced = items[offset:offset + limit]

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

@router.get("/api/converter/lookup/{section}")
def lookup_converter_section(section: str, current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """Instant statutory section lookup across all 2,016+ concordance mappings."""
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

@router.get("/api/library")
def get_legal_library(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Returns legal statutes, BNS/IPC concordance provisions, and statutory acts."""
    user_id = current_user.get("user_id") if current_user else None
    user_plan = current_user.get("plan", "free") if current_user else "free"
    is_pro = user_plan in ("plus", "pro", "enterprise")

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

    if category and category.lower() != "all":
        results = [
            r for r in results 
            if category.lower() in r["category"].lower() or category.lower() in r["bns_act"].lower()
        ]

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
