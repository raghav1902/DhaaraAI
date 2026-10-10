import io
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel

import chat_history_db
from routers.deps import check_engine, get_optional_user

router = APIRouter(tags=["Contracts & Document Analysis"])

class ContractAnalysisRequest(BaseModel):
    document_text: str
    document_type: str = "General Contract"
    language: str = "English"

@router.post("/api/analyze-contract")
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

    engine = check_engine()
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
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/api/upload-document")
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
            mime_type = "image/png" if filename.endswith(".png") else "image/jpeg"
            base64_image = base64.b64encode(contents).decode("utf-8")
            engine = check_engine()
            if engine and engine.client:
                chat_completion = engine.client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "Extract all text from this image exactly as written. Do not add any extra commentary or formatting. Just pure raw text."},
                                {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{base64_image}"}},
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
