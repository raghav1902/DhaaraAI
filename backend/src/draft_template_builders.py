"""
draft_template_builders.py
==========================
Central coordinator for statutory legal draft template builders in DhaaraAI.
Delegates to specialized civil and criminal drafting builders.
"""
import datetime
from typing import Dict, Any, Optional

try:
    from backend.src.draft_builders_civil import build_civil_template, generate_fallback_notice
    from backend.src.draft_builders_criminal import build_criminal_template, generate_fallback_fir
except ImportError:
    try:
        from src.draft_builders_civil import build_civil_template, generate_fallback_notice
        from src.draft_builders_criminal import build_criminal_template, generate_fallback_fir
    except ImportError:
        from draft_builders_civil import build_civil_template, generate_fallback_notice
        from draft_builders_criminal import build_criminal_template, generate_fallback_fir


def _build_template_draft_content(
    template_id: str,
    is_hindi: bool = False,
    complainant: Optional[Dict[str, str]] = None,
    accused: Optional[Dict[str, str]] = None,
    incident_datetime: str = "",
    incident_location: str = "",
    facts: str = "",
    evidence: str = "",
    relief: str = "",
    sections: str = "",
    extra_fields: Optional[Dict[str, Any]] = None,
    **kwargs
) -> str:
    """
    Generates a formal, structured, court-compliant legal draft for any of the 12 templates.
    """
    clean_id = str(template_id).strip().lower().replace("-", "_").replace(" ", "_")
    extras = extra_fields or {}
    c_dict = complainant or {}
    a_dict = accused or {}

    c_name = c_dict.get("name") or ("प्रार्थी" if is_hindi else "[Complainant / Applicant Full Name]")
    c_father = c_dict.get("father_name") or ("पिता/पति" if is_hindi else "[Parent / Spouse Name]")
    c_phone = c_dict.get("phone") or "[Contact Mobile Number]"
    c_address = c_dict.get("address") or ("स्थायी पता" if is_hindi else "[Complete Residential Address]")
    c_station = c_dict.get("police_station") or ("संबंधित थाना / शहर" if is_hindi else "[Jurisdictional Police Station / City]")

    a_name = a_dict.get("name") or ("विपक्षी / आरोपी" if is_hindi else "[Opposite Party / Accused Name]")
    a_address = a_dict.get("address") or ("विपक्षी का पता" if is_hindi else "[Opposite Party Address / Details]")

    dt_str = incident_datetime or kwargs.get("date") or (datetime.date.today().strftime("%d-%m-%Y"))
    loc_str = incident_location or kwargs.get("location") or ("[Place of Occurrence / City]")
    facts_str = facts or kwargs.get("factual_background") or ("[Chronological statement of facts]")
    relief_str = relief or kwargs.get("relief_sought") or ("[Specific relief, payment, or action demanded]")
    evidence_str = evidence or kwargs.get("documents") or ("[Enclosed documents, bank slips, and communications]")

    # 1. Try criminal / procedural templates (Cheque Bounce, Bail, Anticipatory Bail, Maintenance, FIR)
    crim_res = build_criminal_template(
        clean_id=clean_id,
        is_hindi=is_hindi,
        c_name=c_name,
        c_father=c_father,
        c_phone=c_phone,
        c_address=c_address,
        c_station=c_station,
        a_name=a_name,
        a_address=a_address,
        dt_str=dt_str,
        loc_str=loc_str,
        facts_str=facts_str,
        relief_str=relief_str,
        evidence_str=evidence_str,
        extras=extras,
        sections=sections,
        complainant=c_dict,
        accused=a_dict
    )
    if crim_res is not None:
        return crim_res

    # 2. Try civil / administrative templates (RTI, Consumer, Affidavit, Reply Notice, Rent, Petition)
    civil_res = build_civil_template(
        clean_id=clean_id,
        is_hindi=is_hindi,
        c_name=c_name,
        c_father=c_father,
        c_phone=c_phone,
        c_address=c_address,
        a_name=a_name,
        a_address=a_address,
        dt_str=dt_str,
        loc_str=loc_str,
        facts_str=facts_str,
        relief_str=relief_str,
        evidence_str=evidence_str,
        extras=extras,
        sections=sections,
        complainant=c_dict,
        accused=a_dict
    )
    if civil_res is not None:
        return civil_res

    # 3. Default statutory legal demand notice
    return generate_fallback_notice(
        complainant=c_dict,
        accused=a_dict,
        incident_datetime=dt_str,
        incident_location=loc_str,
        facts=facts_str,
        evidence=evidence_str,
        relief=relief_str,
        sections=sections,
        is_hindi=is_hindi
    )


def generate_template_draft(
    template_id: str,
    is_hindi: bool = False,
    complainant: Optional[Dict[str, str]] = None,
    accused: Optional[Dict[str, str]] = None,
    incident_datetime: str = "",
    incident_location: str = "",
    facts: str = "",
    evidence: str = "",
    relief: str = "",
    sections: str = "",
    extra_fields: Optional[Dict[str, Any]] = None,
    **kwargs
) -> str:
    """
    Public entrypoint for generating structured, court-compliant drafts with mandatory disclaimer.
    """
    raw_draft = _build_template_draft_content(
        template_id=template_id,
        is_hindi=is_hindi,
        complainant=complainant,
        accused=accused,
        incident_datetime=incident_datetime,
        incident_location=incident_location,
        facts=facts,
        evidence=evidence,
        relief=relief,
        sections=sections,
        extra_fields=extra_fields,
        **kwargs
    )
    disclaimer = (
        "\n\n---\n[DISCLAIMER: AI-assisted draft — verify facts, applicable law, jurisdiction and procedural requirements before filing.]"
        if not is_hindi else
        "\n\n---\n[अस्वीकरण: यह AI-सहायित विधिक प्रारूप है — न्यायालय/प्राधिकरण में प्रस्तुत करने से पूर्व तथ्यों, लागू कानून, अधिकार क्षेत्र एवं प्रक्रियात्मक नियमों का सत्यापन अवश्य करें।]"
    )
    if "[DISCLAIMER:" not in raw_draft and "[अस्वीकरण:" not in raw_draft:
        return raw_draft.rstrip() + disclaimer
    return raw_draft


def generate_fallback_draft(
    document_type: str = "",
    is_hindi: bool = False,
    complainant: Optional[Dict[str, str]] = None,
    accused: Optional[Dict[str, str]] = None,
    incident_datetime: str = "",
    incident_location: str = "",
    facts: str = "",
    evidence: str = "",
    relief: str = "",
    sections: str = "",
    extra_fields: Optional[Dict[str, Any]] = None,
    **kwargs
) -> str:
    """Fallback generator when generative AI model response is unavailable."""
    tmpl_id = kwargs.pop("template_id", None) or document_type
    return generate_template_draft(
        template_id=tmpl_id,
        is_hindi=is_hindi,
        complainant=complainant,
        accused=accused,
        incident_datetime=incident_datetime,
        incident_location=incident_location,
        facts=facts,
        evidence=evidence,
        relief=relief,
        sections=sections,
        extra_fields=extra_fields,
        **kwargs
    )
