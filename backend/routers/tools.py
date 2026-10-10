import json
import urllib.request
import urllib.error
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

import chat_history_db
import vault_share_db
from routers.deps import get_optional_user

router = APIRouter(tags=["Civic Tools, Cyber & Legal Vault"])

@router.get("/api/cyber-check")
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

@router.get("/api/rights/emergency-contacts")
def get_emergency_contacts():
    """Returns official 24x7 verified Indian emergency and statutory legal helplines."""
    try:
        from src.real_legal_fetcher import OFFICIAL_LEGAL_HELPLINES
        return {"status": "success", "total": len(OFFICIAL_LEGAL_HELPLINES), "contacts": OFFICIAL_LEGAL_HELPLINES}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/api/rights/landmark-guidelines")
def get_landmark_guidelines():
    """Returns binding Supreme Court procedural directives (Arnesh Kumar, Lalita Kumari, D.K. Basu)."""
    try:
        from src.real_legal_fetcher import LANDMARK_LEGAL_GUIDELINES
        return {"status": "success", "total": len(LANDMARK_LEGAL_GUIDELINES), "guidelines": LANDMARK_LEGAL_GUIDELINES}
    except Exception as e:
        return {"status": "error", "message": str(e)}

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

@router.post("/api/vault/share")
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

@router.get("/api/vault/shared/{share_id}")
def get_vault_share_info(share_id: str):
    meta = vault_share_db.get_shared_document_meta(share_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Shared document not found or permanently destroyed.")
    return {"status": "success", "data": meta}

@router.post("/api/vault/shared/{share_id}/unlock")
def unlock_vault_share(share_id: str, req: UnlockVaultShareRequest):
    success, message, doc = vault_share_db.unlock_shared_document(share_id, req.password)
    if not success:
        raise HTTPException(status_code=403, detail=message)
    return {"status": "success", "data": doc}
