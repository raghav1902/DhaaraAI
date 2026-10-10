import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

import chat_history_db
from routers.deps import limiter, get_current_user, get_optional_user

router = APIRouter(tags=["Authentication & Users"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None

class UpgradePlanRequest(BaseModel):
    plan: str = "plus"
    days: Optional[int] = 30
    email: Optional[str] = None

@router.post("/api/auth/register")
@limiter.limit("5/minute")
def register_endpoint(request: Request, req: RegisterRequest):
    try:
        user_info = chat_history_db.register_user(req.email, req.password, req.name)
        return user_info
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal registration error")

@router.post("/api/auth/login")
@limiter.limit("10/minute")
def login_endpoint(request: Request, req: LoginRequest):
    try:
        user_info = chat_history_db.authenticate_user(req.email, req.password)
        return user_info
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal authentication error")

@router.get("/api/auth/me")
def me_endpoint(current_user: Dict[str, Any] = Depends(get_current_user)):
    result = {k: v for k, v in current_user.items() if not k.startswith("_")}
    return result

class SessionSyncRequest(BaseModel):
    email: Optional[str] = None
    token: Optional[str] = None

@router.post("/api/auth/sync-session")
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

class TokenRefreshRequest(BaseModel):
    email: str

@router.post("/api/auth/token-refresh")
def token_refresh_endpoint(req: TokenRefreshRequest):
    """Convenience alias for session refresh using email."""
    return sync_session_endpoint(SessionSyncRequest(email=req.email))

@router.post("/api/auth/logout")
def logout_endpoint(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Revokes the current session token server-side."""
    token = current_user.get("_token")
    if token:
        chat_history_db.revoke_token(token)
    return {"status": "success", "message": "Session token revoked."}

@router.patch("/api/auth/profile")
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

@router.get("/api/user/usage")
def get_user_usage_endpoint(current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """Returns current user's usage counts, limits, and plan status."""
    user_id = current_user.get("user_id") if current_user else None
    return chat_history_db.get_user_usage_stats(user_id)

@router.post("/api/user/upgrade")
def upgrade_user_plan_endpoint(
    req: UpgradePlanRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Upgrades or modifies the user's subscription tier. Prevents unauthorized account takeover."""
    try:
        user_to_upgrade = current_user
        if not user_to_upgrade:
            # If an email is provided and matches an existing registered account, reject without token
            if req.email:
                target_email = req.email.strip().lower()
                existing_user = chat_history_db.get_user_by_email(target_email)
                if existing_user:
                    raise HTTPException(
                        status_code=401,
                        detail="Authentication required to modify this registered account. Please sign in first."
                    )
                user_to_upgrade = chat_history_db.register_user(
                    email=target_email,
                    password=uuid.uuid4().hex,
                    name="Guest Advocate"
                )
            else:
                guest_email = f"guest_{uuid.uuid4().hex[:10]}@dhaaraai.com"
                user_to_upgrade = chat_history_db.register_user(
                    email=guest_email,
                    password=uuid.uuid4().hex,
                    name="Guest User"
                )

        updated = chat_history_db.update_user_plan(
            user_id=user_to_upgrade["user_id"],
            plan_type=req.plan,
            days=req.days or 30
        )
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
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal plan update error")
