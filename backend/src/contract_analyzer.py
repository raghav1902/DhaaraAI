"""
contract_analyzer.py
====================
Indian Contract & Legal Document Analysis Engine.
Analyzes agreements for one-sided clauses, statutory invalidity (e.g. Sec 27 ICA),
unfair forfeiture, and missing statutory protections.
"""

import json
from typing import Dict, Any
from prompts import CONTRACT_ANALYSIS_SYSTEM_PROMPT

def heuristic_contract_analysis(text: str, doc_type: str, is_hindi: bool) -> Dict[str, Any]:
    """Rule-based Indian contract auditor detecting predatory clauses."""
    text_lower = text.lower()
    red_flags = []
    missing = []
    score = 20

    # Non-legal document rejection heuristic
    non_legal_keywords = ["marks statement", "secondary school examination", "board of secondary education", "cbse", "university", "marksheet", "digilocker", "fo|ky;", "çek.k"]
    if any(k in text_lower for k in non_legal_keywords) and "agreement" not in text_lower and "contract" not in text_lower:
        return {
            "success": False,
            "error": "This document appears to be an academic certificate, marksheet, or non-legal record, not a legal contract. Please upload a valid legal agreement, notice, or contract for audit." if not is_hindi else "यह दस्तावेज़ एक शैक्षणिक प्रमाणपत्र या मार्कशीट प्रतीत होता है, कानूनी अनुबंध नहीं। कृपया ऑडिट के लिए एक वैध कानूनी समझौता या नोटिस अपलोड करें।"
        }

    # Check 1: Non-compete restraint of trade (Sec 27 Indian Contract Act)
    if any(k in text_lower for k in ["non-compete", "not work for any competitor", "restraint of trade", "shall not engage in any other business", "प्रतिस्पर्धी"]):
        score += 25
        red_flags.append({
            "clause": "Post-employment / post-service non-compete restriction",
            "issue": "Blanket post-termination non-compete clauses are declared void as restraint of lawful profession under Indian law." if not is_hindi else "भारतीय कानून के तहत नौकरी के बाद किसी अन्य कंपनी में काम करने पर पूर्ण रोक गैर-कानूनी (शून्य) मानी जाती है।",
            "statute": "Section 27, Indian Contract Act, 1872 (Restraint of trade void)",
            "severity": "High",
            "fair_alternative": "The restriction shall strictly apply only to safeguarding verified proprietary trade secrets and active customer solicitation during active service." if not is_hindi else "प्रतिबंध केवल सेवा अवधि के दौरान वास्तविक व्यावसायिक रहस्यों एवं ग्राहकों के अनुचित उपयोग तक सीमित रहेगा।"
        })

    # Check 2: Unilateral termination or unfair penalty (Sec 73, 74)
    if any(k in text_lower for k in ["terminate at any time without notice", "sole discretion without cause", "forfeit the entire deposit", "non-refundable deposit", "जब्त"]):
        score += 25
        red_flags.append({
            "clause": "Unilateral termination or blanket deposit forfeiture",
            "issue": "Allows one party to terminate arbitrarily or confiscate deposits without genuine pre-estimated loss." if not is_hindi else "एकतरफा समाप्ति या बिना हिसाब-किताब के पूरी जमा राशि (सिक्योरिटी) जब्त करने का एकतरफा अधिकार।",
            "statute": "Sections 73 & 74, Indian Contract Act, 1872 (Reasonable compensation vs penalty)",
            "severity": "High",
            "fair_alternative": "Either party may terminate by providing a minimum 30 days written notice. Security deposit must be refunded within 15 days of handover with itemized deductions only." if not is_hindi else "दोनों पक्षों को कम से कम 30 दिन का लिखित नोटिस देना होगा। कब्जा सौंपने के 15 दिनों में सिक्योरिटी का पूरा हिसाब देकर राशि लौटानी होगी।"
        })

    # Check 3: Uncapped indemnity or complete waiver of liability
    if any(k in text_lower for k in ["indemnify and hold harmless", "unlimited liability", "not responsible for any damage or loss", "पूर्ण रूप से उत्तरदायी"]):
        score += 20
        red_flags.append({
            "clause": "One-sided broad indemnity / complete waiver of owner liability",
            "issue": "Exempts the stronger party from standard duty of care while placing open-ended risk on the signer." if not is_hindi else "मालिक या मुख्य संस्था को अपनी लापरवाही से मुक्त करना और आपके ऊपर असीमित देनदारी डालना।",
            "statute": "Section 23 & 73, Indian Contract Act, 1872; Consumer Protection Act 2019",
            "severity": "Medium",
            "fair_alternative": "Indemnity shall be strictly mutual and capped at the total fee/rent paid under this agreement, excluding cases of gross negligence or willful misconduct." if not is_hindi else "क्षतिपूर्ति आपसी होगी तथा समझौते के तहत देय वास्तविक राशि तक सीमित रहेगी।"
        })

    # Check 4: Exclusive distant jurisdiction
    if any(k in text_lower for k in ["exclusive jurisdiction of courts in", "exclusive jurisdiction", "अधिकार क्षेत्र"]):
        red_flags.append({
            "clause": "Exclusive distant court jurisdiction clause",
            "issue": "May force disputes into inconvenient outstation courts far from where the service was actually rendered." if not is_hindi else "विवाद होने पर दूरस्थ शहर की अदालत में जाने की एकतरफा शर्त।",
            "statute": "Section 28, Indian Contract Act & Section 20, CPC 1908",
            "severity": "Low",
            "fair_alternative": "Disputes shall be subject to the competent courts having jurisdiction over the location where the property is situated or service is rendered." if not is_hindi else "विवाद उसी स्थान की अदालत में सुना जाएगा जहां संपत्ति स्थित है अथवा सेवा प्रदान की गई है।"
        })

    # Check 5: Missing essential protections
    if "rent" in text_lower or "tenant" in text_lower or "lease" in text_lower:
        missing.append("Specific time-bound security deposit refund clause with interest if delayed (Model Tenancy Act)")
        missing.append("Clear structural repair responsibility vs minor tenant maintenance demarcation")
    elif "employ" in text_lower or "job" in text_lower or "service" in text_lower:
        missing.append("Clear working hours, overtime policy, and statutory PF/ESI entitlement references")
        missing.append("Objective dispute resolution and mediation before litigation")
    else:
        missing.append("Mutual termination clause with equal notice period for both parties")
        missing.append("Force Majeure clause covering natural disasters and governmental orders")

    score = min(score, 95)
    risk_label = "Critical" if score >= 75 else "High" if score >= 50 else "Medium" if score >= 30 else "Low"

    if is_hindi:
        summary = f"यह {doc_type} प्रकृति का विधिक दस्तावेज है। विश्लेषण में {len(red_flags)} संभावित जोखिमपूर्ण या एकतरफा शर्तें पाई गई हैं।"
        advice = [
            "हस्ताक्षर करने से पूर्व एकतरफा शर्तों (विशेषकर सिक्योरिटी जब्ती व गैर-प्रतिस्पर्धा) पर लिखित संशोधन मांगें।",
            "व्हाट्सएप या ईमेल पर समझौते से जुड़ी सभी सहमतियां लिखित रूप में सुरक्षित रखें।"
        ]
    else:
        summary = f"This document appears to be a {doc_type}. The statutory review identified {len(red_flags)} potentially unfavorable or unenforceable provisions under Indian contract law."
        advice = [
            "Request written revisions for the flagged high-severity clauses before executing the contract.",
            "Ensure all side agreements or verbal promises are incorporated into the written annexures."
        ]

    return {
        "success": True,
        "source": "Indian Statutory Heuristic Engine",
        "summary": summary,
        "risk_score": risk_label,
        "risk_percentage": score,
        "key_findings": [
            f"{len(red_flags)} problematic provisions identified" if not is_hindi else f"{len(red_flags)} आपत्तिजनक शर्तें चिन्हित की गईं",
            "Compliance examined under Indian Contract Act 1872" if not is_hindi else "भारतीय अनुबंध अधिनियम 1872 के आधार पर समीक्षा की गई"
        ],
        "red_flags": red_flags,
        "missing_protections": missing,
        "actionable_advice": advice
    }

def analyze_contract_document(
    client: Any,
    default_model: str,
    document_text: str,
    document_type: str = "General Contract",
    language: str = "English"
) -> Dict[str, Any]:
    is_hindi = "hindi" in str(language).lower()
    if client:
        prompt_lang = "HINDI (देवनागरी)" if is_hindi else "ENGLISH"
        system_instruction = CONTRACT_ANALYSIS_SYSTEM_PROMPT.format(prompt_lang=prompt_lang)
        user_msg = f"Document Type: {document_type}\n\nDocument Text:\n{document_text[:6000]}"

        models_to_try = [default_model]
        for fb in ["qwen/qwen3.8-27b", "openai/gpt-oss-20b"]:
            if fb not in models_to_try:
                models_to_try.append(fb)

        for model in models_to_try:
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": user_msg}
                    ],
                    model=model,
                    temperature=0.2,
                    max_tokens=950,
                    response_format={"type": "json_object"}
                )
                raw_content = chat_completion.choices[0].message.content or ""
                parsed = json.loads(raw_content)
                
                if not parsed.get("is_legal_contract", True):
                    return {
                        "success": False,
                        "error": "This document does not appear to be a legal contract, agreement, or notice. Please upload a valid legal document for audit." if not is_hindi else "यह दस्तावेज़ कोई कानूनी अनुबंध, समझौता या नोटिस प्रतीत नहीं होता है। कृपया ऑडिट के लिए एक वैध कानूनी दस्तावेज़ अपलोड करें।"
                    }

                parsed["success"] = True
                parsed["source"] = f"AI Legal Audit ({model})"
                return parsed
            except Exception as e:
                print(f"[contract_analyzer] Model '{model}' contract analysis failed: {e}. Trying fallback...")
                continue

    return heuristic_contract_analysis(document_text, document_type, is_hindi)
