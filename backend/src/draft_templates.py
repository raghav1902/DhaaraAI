"""
draft_templates.py
==================
Production Legal Draft Templates Engine for DhaaraAI (Phase 2).
Provides 12 high-frequency Indian statutory legal draft templates with complete
bilingual (English & Hindi) structured skeletons, required field metadata,
and procedural compliance under Bharatiya Nyaya Sanhita (BNS 2023),
Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Negotiable Instruments Act,
Consumer Protection Act, RTI Act, and relevant civil/criminal enactments.
"""

from typing import Dict, Any, List, Optional
import datetime

# ---------------------------------------------------------------------------
# 1. 12 High-Frequency Legal Draft Templates Registry
# ---------------------------------------------------------------------------
LEGAL_TEMPLATES_REGISTRY: List[Dict[str, Any]] = [
    {
        "template_id": "rti_application",
        "title": "RTI Application (Right to Information)",
        "title_hi": "सूचना का अधिकार (RTI) आवेदन",
        "category": "Statutory & Administrative",
        "description": "Formal application under Section 6(1) of the Right to Information Act, 2005 to seek certified records, status reports, or official information from any Public Authority.",
        "description_hi": "सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत किसी भी सरकारी विभाग या लोक प्राधिकरण से प्रमाणित दस्तावेज या सूचना प्राप्त करने हेतु औपचारिक आवेदन।",
        "legal_basis": "Section 6(1) and Section 7(1) of Right to Information Act, 2005",
        "relevant_act": "Right to Information Act, 2005",
        "relevant_sections": "Section 6(1), Section 7(1), Section 19",
        "required_fields": ["complainant.name", "complainant.address", "accused.name", "facts"],
        "optional_fields": ["complainant.phone", "bpl_card_no", "application_fee_details", "period_of_info"],
        "required_documents": [
            "Application fee of Rs. 10 (IPO / Demand Draft / Court Fee Stamp / Online Receipt)",
            "Copy of BPL card (if seeking fee exemption under Section 7(5))"
        ],
        "source_reference": "Right to Information Act, 2005 (Act No. 22 of 2005) & Central RTI Rules 2012",
        "version_date": "Updated for 2024-2026 practice",
        "disclaimer": "AI-assisted draft — verify facts, public authority jurisdiction, and fee rules before filing."
    },
    {
        "template_id": "legal_demand_notice",
        "title": "Statutory Legal Demand Notice",
        "title_hi": "विधिक मांग नोटिस (Legal Demand Notice)",
        "category": "Civil & Commercial",
        "description": "Formal legal warning giving 15 or 30 days statutory cure period to rectify contractual breach, repay outstanding debt, or remedy civil grievance before filing suit.",
        "description_hi": "दीवानी या आपराधिक मुकदमा दर्ज करने से पूर्व दूसरी पार्टी को 15 या 30 दिन की वैधानिक मोहलत एवं कानूनी चेतावनी देने वाला औपचारिक नोटिस।",
        "legal_basis": "Civil Procedure Code, Indian Contract Act 1872 & Bharatiya Nyaya Sanhita 2023",
        "relevant_act": "Indian Contract Act, 1872 & Specific Relief Act, 1963",
        "relevant_sections": "Section 73, 74 Contract Act; Section 316, 318 BNS 2023",
        "required_fields": ["complainant.name", "accused.name", "incident_datetime", "facts", "relief_sought"],
        "optional_fields": ["complainant.address", "accused.address", "evidence"],
        "required_documents": [
            "Written contracts / Invoices / Account Statements",
            "Proof of dispatch (Registered Post A.D. or Speed Post receipts)"
        ],
        "source_reference": "Section 80 CPC & Standard Indian High Court Pre-Litigation Protocol",
        "version_date": "Updated for BNS 2023 transition",
        "disclaimer": "AI-assisted draft — verify facts, monetary claim calculations, and postal proof before dispatch."
    },
    {
        "template_id": "cheque_bounce_notice",
        "title": "Cheque Bounce Notice (Section 138 NI Act)",
        "title_hi": "चेक बाउंस विधिक नोटिस (धारा 138 पराक्राम्य लिखत अधिनियम)",
        "category": "Commercial & Banking",
        "description": "Mandatory statutory demand notice under Section 138(b) of Negotiable Instruments Act, 1881 to be served within 30 days of bank return memo, demanding payment within 15 days.",
        "description_hi": "बैंक रिटर्न मेमो मिलने के 30 दिनों के भीतर धारा 138(b) NI Act के तहत 15 दिन की मोहलत देकर बकाया चेक राशि की मांग करने वाला अनिवार्य विधिक नोटिस।",
        "legal_basis": "Section 138 read with Section 141 and 142 of Negotiable Instruments Act, 1881",
        "relevant_act": "Negotiable Instruments Act, 1881",
        "relevant_sections": "Section 138, Section 139, Section 141, Section 142(2) NI Act; Section 318 BNS 2023",
        "required_fields": [
            "complainant.name", "accused.name", "cheque_number", "cheque_amount",
            "cheque_date", "bank_name", "memo_date", "memo_reason"
        ],
        "optional_fields": ["accused.address", "invoice_details", "interest_rate"],
        "required_documents": [
            "Original Cheque copy",
            "Bank Return Memo indicating 'Funds Insufficient' or stop payment",
            "Postal receipt of Speed Post / Registered Post A.D."
        ],
        "source_reference": "Supreme Court rulings in Bir Singh v. Mukesh Kumar (2019) & Dashrath Rupsingh Rathod (2014)",
        "version_date": "Active Law (NI Act 1881 as amended 2018)",
        "disclaimer": "AI-assisted draft — strictly ensure notice is dispatched within 30 days of receiving the Bank Return Memo."
    },
    {
        "template_id": "bail_application",
        "title": "Regular Bail Application",
        "title_hi": "नियमित जमानत आवेदन (Regular Bail Application)",
        "category": "Criminal Procedure",
        "description": "Formal bail petition filed before Magistrate or Sessions Court under Section 480 or Section 483 of Bharatiya Nagarik Suraksha Sanhita, 2023 (formerly Section 437/439 CrPC) for release from judicial custody.",
        "description_hi": "न्यायिक हिरासत में बंद अभियुक्त की रिहाई हेतु धारा 480 अथवा 483 BNSS 2023 (पूर्व धारा 437/439 CrPC) के तहत मजिस्ट्रेट या सत्र न्यायालय में पेश किया जाने वाला जमानत प्रार्थना पत्र।",
        "legal_basis": "Section 480 / Section 483 of Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "relevant_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 (formerly CrPC 1973)",
        "relevant_sections": "Section 480, 483, 479 BNSS 2023; Article 21 Constitution of India",
        "required_fields": ["court_name", "accused.name", "police_station", "fir_number", "sections_booked", "facts"],
        "optional_fields": ["arrest_date", "surety_details", "medical_grounds"],
        "required_documents": [
            "Copy of FIR / Charge Sheet / Remand Order",
            "Affidavit of Pairokar / Surety",
            "Proof of residence / Aadhaar Card of accused and local sureties"
        ],
        "source_reference": "Supreme Court rulings in Satender Kumar Antil (2022) & Arnesh Kumar (2014)",
        "version_date": "Updated under BNSS 2023 (w.e.f. 1 July 2024)",
        "disclaimer": "AI-assisted draft — verify court jurisdiction, FIR status, and custody dates with case record."
    },
    {
        "template_id": "anticipatory_bail_application",
        "title": "Anticipatory Bail Application",
        "title_hi": "अग्रिम जमानत आवेदन (Anticipatory Bail Application)",
        "category": "Criminal Procedure",
        "description": "Application filed under Section 482 of Bharatiya Nagarik Suraksha Sanhita, 2023 (formerly Section 438 CrPC) before the Court of Session or High Court directing release in the event of arrest in a non-bailable accusation.",
        "description_hi": "गैर-जमानती अपराध के झूठे आरोप में गिरफ्तारी की आशंका होने पर धारा 482 BNSS 2023 (पूर्व धारा 438 CrPC) के तहत सत्र न्यायालय अथवा उच्च न्यायालय में अग्रिम जमानत याचिका।",
        "legal_basis": "Section 482 of Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "relevant_act": "Bharatiya Nagarik Suraksha Sanhita, 2023",
        "relevant_sections": "Section 482 BNSS 2023; Article 21 Constitution of India",
        "required_fields": ["court_name", "complainant.name", "police_station", "apprehended_sections", "facts"],
        "optional_fields": ["fir_number", "cooperation_undertaking", "surety_readiness"],
        "required_documents": [
            "Affidavit of applicant",
            "Copy of complaint / notice / FIR (if registered)",
            "Clean antecedents certificate or undertaking"
        ],
        "source_reference": "Supreme Court Constitutional Bench in Sushila Aggarwal v. State (NCT of Delhi) (2020)",
        "version_date": "Updated under BNSS 2023 (w.e.f. 1 July 2024)",
        "disclaimer": "AI-assisted draft — must be moved before the Sessions Court or High Court having territorial jurisdiction."
    },
    {
        "template_id": "consumer_complaint",
        "title": "Consumer Complaint (District Commission)",
        "title_hi": "उपभोक्ता शिकायत (जिला उपभोक्ता आयोग)",
        "category": "Consumer Protection",
        "description": "Formal consumer petition under Section 35 of the Consumer Protection Act, 2019 before District Consumer Disputes Redressal Commission for defective goods, deficiency in service, or unfair trade practice.",
        "description_hi": "दोषपूर्ण सामान, सेवा में कमी या अनुचित व्यापार व्यवहार के विरुद्ध उपभोक्ता संरक्षण अधिनियम, 2019 की धारा 35 के तहत जिला उपभोक्ता विवाद प्रतितोष आयोग में शिकायत।",
        "legal_basis": "Section 35 of Consumer Protection Act, 2019",
        "relevant_act": "Consumer Protection Act, 2019",
        "relevant_sections": "Section 2(7), 2(11), 35, 38, 39 Consumer Protection Act 2019",
        "required_fields": ["complainant.name", "accused.name", "purchase_date", "consideration_amount", "facts", "relief_sought"],
        "optional_fields": ["invoice_number", "warranty_terms", "compensation_breakup"],
        "required_documents": [
            "Tax Invoice / Cash Memo / Purchase Receipt",
            "Warranty Card / Product Guarantee documentation",
            "Copy of pre-complaint legal notice and postal proof",
            "Affidavit in support of complaint"
        ],
        "source_reference": "Consumer Protection (Consumer Commission Procedure) Regulations, 2020",
        "version_date": "Updated under Consumer Protection Act 2019",
        "disclaimer": "AI-assisted draft — verify that consideration paid does not exceed Rs. 50 Lakhs for District Commission jurisdiction."
    },
    {
        "template_id": "maintenance_application",
        "title": "Maintenance Application (Section 144 BNSS)",
        "title_hi": "भरण-पोषण आवेदन (धारा 144 BNSS / पूर्व धारा 125 CrPC)",
        "category": "Family & Matrimonial",
        "description": "Petition for grant of monthly interim and final maintenance for wife, dependent children, or parents under Section 144 of Bharatiya Nagarik Suraksha Sanhita, 2023 (formerly Section 125 CrPC).",
        "description_hi": "पत्नी, अवयस्क बच्चों अथवा वृद्ध माता-पिता के मासिक गुजारा भत्ता हेतु धारा 144 BNSS 2023 (पूर्व धारा 125 CrPC) के तहत फैमिली कोर्ट या मुख्य न्यायिक मजिस्ट्रेट के समक्ष आवेदन।",
        "legal_basis": "Section 144 of Bharatiya Nagarik Suraksha Sanhita, 2023",
        "relevant_act": "Bharatiya Nagarik Suraksha Sanhita, 2023",
        "relevant_sections": "Section 144, 145, 147 BNSS 2023; Section 24 Hindu Marriage Act 1955",
        "required_fields": ["court_name", "complainant.name", "accused.name", "marriage_date", "facts", "relief_sought"],
        "optional_fields": ["children_details", "respondent_income", "applicant_income"],
        "required_documents": [
            "Marriage certificate / photographs / Invitation card",
            "Mandatory Affidavit of Assets and Liabilities (as per Rajnesh v. Neha guidelines)",
            "Birth certificates of dependent children"
        ],
        "source_reference": "Supreme Court Landmark Judgment in Rajnesh v. Neha (2020) 13 SCR 883",
        "version_date": "Updated under BNSS 2023 with mandatory Assets Affidavit guidelines",
        "disclaimer": "AI-assisted draft — Supreme Court mandates filing a detailed Affidavit of Assets and Liabilities alongside this application."
    },
    {
        "template_id": "general_affidavit",
        "title": "General Sworn Affidavit",
        "title_hi": "सामान्य शपथ-पत्र (General Sworn Affidavit)",
        "category": "Civil & Evidence",
        "description": "Formal solemn declaration on Non-Judicial Stamp Paper attested before an Oath Commissioner or Notary Public under Order XIX of the Code of Civil Procedure and Bharatiya Sakshya Adhiniyam, 2023.",
        "description_hi": "नोटरी पब्लिक या शपथ आयुक्त के समक्ष गैर-न्यायिक स्टांप पेपर पर निष्पादित व सत्यापित औपचारिक शपथ-पत्र (Order XIX CPC व BSA 2023 के तहत)।",
        "legal_basis": "Order XIX CPC, Section 139 CPC, Section 165 BNSS & Notaries Act 1952",
        "relevant_act": "Code of Civil Procedure, 1908 & Notaries Act, 1952",
        "relevant_sections": "Order XIX CPC; Section 338 BNS 2023 (False statements on oath)",
        "required_fields": ["complainant.name", "complainant.father_name", "complainant.address", "facts"],
        "optional_fields": ["deponent_age", "court_case_title", "verification_place"],
        "required_documents": [
            "Identity Proof (Aadhaar / Voter ID / Passport)",
            "Non-Judicial Stamp Paper of appropriate State stamp duty value"
        ],
        "source_reference": "State Stamp Acts & High Court Rules on Affidavits",
        "version_date": "Updated for 2024-2026 legal practice",
        "disclaimer": "AI-assisted draft — must be attested by a Notary Public or Oath Commissioner with appropriate stamp duty."
    },
    {
        "template_id": "fir_application",
        "title": "Police Complaint for FIR (Section 173 BNSS)",
        "title_hi": "प्राथमिकी (FIR) हेतु औपचारिक पुलिस शिकायत (धारा 173 BNSS)",
        "category": "Criminal Law",
        "description": "Formal written complaint submitted to Station House Officer (SHO) under Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023 (formerly Section 154 CrPC) for mandatory FIR registration in cognizable crimes.",
        "description_hi": "संज्ञेय अपराध घटित होने पर थाना प्रभारी (SHO) को धारा 173 BNSS 2023 (पूर्व धारा 154 CrPC) के तहत तुरंत प्राथमिकी दर्ज कर जांच प्रारंभ करने हेतु औपचारिक शिकायत पत्र।",
        "legal_basis": "Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023",
        "relevant_act": "Bharatiya Nagarik Suraksha Sanhita, 2023 & Bharatiya Nyaya Sanhita, 2023",
        "relevant_sections": "Section 173 BNSS 2023; Governing BNS 2023 penal sections",
        "required_fields": ["complainant.name", "complainant.police_station", "incident_datetime", "incident_location", "facts"],
        "optional_fields": ["accused.name", "accused.address", "evidence"],
        "required_documents": [
            "Photographs of scene of crime / physical damage",
            "Medical Examination Memo / MLC (if bodily injury)",
            "Electronic evidence (Call recordings / WhatsApp / UPI transaction slips)"
        ],
        "source_reference": "Supreme Court Constitution Bench in Lalita Kumari v. Govt. of U.P. (2013)",
        "version_date": "Updated under BNSS 2023 (w.e.f. 1 July 2024)",
        "disclaimer": "AI-assisted draft — obtain dated receiving with GD entry number from the police station upon submission."
    },
    {
        "template_id": "reply_legal_notice",
        "title": "Reply to Legal Notice",
        "title_hi": "विधिक नोटिस का औपचारिक प्रत्युत्तर (Reply to Legal Notice)",
        "category": "Civil & Defense",
        "description": "Formal parawise rebuttal and legal defense served in response to a received Legal Demand Notice, denying frivolous allegations, asserting true facts, and refuting liability.",
        "description_hi": "प्राप्त हुए कानूनी नोटिस के जवाब में सभी झूठे आरोपों का पैरावार खंडन करते हुए वास्तविक तथ्यों व प्रतिरक्षा को प्रस्तुत करने वाला औपचारिक विधिक प्रत्युत्तर।",
        "legal_basis": "Law of Evidence & Standard Pre-Litigation Defense under Civil/Criminal Procedure",
        "relevant_act": "Indian Evidence Act / Bharatiya Sakshya Adhiniyam, 2023",
        "relevant_sections": "Section 103, 106 BSA 2023; Section 318 BNS 2023",
        "required_fields": ["complainant.name", "accused.name", "notice_date", "facts"],
        "optional_fields": ["notice_ref_no", "counter_claim_amount", "evidence"],
        "required_documents": [
            "Copy of original legal notice received with postal envelope",
            "Rebuttal documents, receipts, written communications"
        ],
        "source_reference": "Standard Indian High Court Pre-Trial Pleadings Practice",
        "version_date": "Updated for 2024-2026 practice",
        "disclaimer": "AI-assisted draft — reply must be served within the deadline stipulated in the received legal notice."
    },
    {
        "template_id": "rent_lease_notice",
        "title": "Tenancy & Eviction Legal Notice",
        "title_hi": "किरायेदारी व बेदखली विधिक नोटिस (Rent & Eviction Notice)",
        "category": "Property & Tenancy",
        "description": "Notice served by Landlord or Tenant under Section 106 of Transfer of Property Act, 1882 and Model Tenancy Act principles for termination of tenancy, recovery of rent arrears, or refund of security deposit.",
        "description_hi": "संपत्ति अंतरण अधिनियम की धारा 106 व किरायेदारी कानूनों के तहत किरायेदारी समाप्ति, बकाया किराया वसूली अथवा सिक्योरिटी डिपॉजिट वापसी हेतु कानूनी नोटिस।",
        "legal_basis": "Section 106 of Transfer of Property Act, 1882 & State Rent Control Acts",
        "relevant_act": "Transfer of Property Act, 1882 & Model Tenancy Act",
        "relevant_sections": "Section 106, Section 108, Section 111 Transfer of Property Act 1882",
        "required_fields": ["complainant.name", "accused.name", "property_address", "facts", "relief_sought"],
        "optional_fields": ["monthly_rent", "arrears_amount", "security_deposit"],
        "required_documents": [
            "Registered Lease Deed / Rent Agreement",
            "Bank statements showing rent receipts / non-payment",
            "Handover inspection report (if deposit refund dispute)"
        ],
        "source_reference": "Section 106 T.P. Act (15-day notice for residential, 6-month for manufacturing)",
        "version_date": "Updated under Model Tenancy Principles 2024",
        "disclaimer": "AI-assisted draft — ensure compliance with 15-day notice period for month-to-month residential leases."
    },
    {
        "template_id": "general_petition",
        "title": "General Representation / Citizen Petition",
        "title_hi": "सामान्य प्रशासनिक अभ्यावेदन / नागरिक याचिका (Citizen Petition)",
        "category": "Administrative & Public Law",
        "description": "Formal administrative petition or representation addressed to District Magistrate, Municipal Commissioner, Superintendent of Police, or statutory authority for grievance redressal.",
        "description_hi": "जिलाधिकारी, पुलिस अधीक्षक अथवा नगर निगम आयुक्त आदि सक्षम प्राधिकारियों के समक्ष जनसमस्या या व्यक्तिगत शिकायत निवारण हेतु औपचारिक अभ्यावेदन।",
        "legal_basis": "Article 350 Constitution of India & Administrative Citizen Charters",
        "relevant_act": "Constitution of India",
        "relevant_sections": "Article 350, Article 21 Constitution of India",
        "required_fields": ["complainant.name", "complainant.address", "accused.name", "facts", "relief_sought"],
        "optional_fields": ["complainant.phone", "jurisdictional_office", "evidence"],
        "required_documents": [
            "Supporting identity proof",
            "Copies of earlier unanswered complaints or representations"
        ],
        "source_reference": "Article 350 of the Constitution of India (Right to submit representation for redress of grievance)",
        "version_date": "Updated for 2024-2026 practice",
        "disclaimer": "AI-assisted draft — keep an official receiving stamp with dispatch date and inward diary number."
    }
]

# Ensure dual-key compatibility for disclaimer / legal_disclaimer
for _tmpl in LEGAL_TEMPLATES_REGISTRY:
    if "disclaimer" in _tmpl and "legal_disclaimer" not in _tmpl:
        _tmpl["legal_disclaimer"] = _tmpl["disclaimer"]
    elif "legal_disclaimer" in _tmpl and "disclaimer" not in _tmpl:
        _tmpl["disclaimer"] = _tmpl["legal_disclaimer"]

# Quick lookup dictionary by template_id
TEMPLATES_BY_ID: Dict[str, Dict[str, Any]] = {
    t["template_id"]: t for t in LEGAL_TEMPLATES_REGISTRY
}


def get_all_templates() -> List[Dict[str, Any]]:
    """Returns metadata for all 12 legal draft templates."""
    return LEGAL_TEMPLATES_REGISTRY


def get_template_by_id(template_id: str) -> Optional[Dict[str, Any]]:
    """Fetches a specific template by its identifier or matching title."""
    clean_id = str(template_id).strip().lower().replace("-", "_").replace(" ", "_")
    if clean_id in TEMPLATES_BY_ID:
        return TEMPLATES_BY_ID[clean_id]
    
    # Fuzzy match on title or aliases
    for tid, t in TEMPLATES_BY_ID.items():
        if tid in clean_id or clean_id in tid:
            return t
        if t["title"].lower() in clean_id or clean_id in t["title"].lower():
            return t
    return None


# ---------------------------------------------------------------------------
# 2. Procedural Fallback Generators (Modularized in draft_template_builders)
# ---------------------------------------------------------------------------

try:
    from backend.src.draft_template_builders import (
        _build_template_draft_content,
        generate_template_draft,
        generate_fallback_draft
    )
except ImportError:
    try:
        from src.draft_template_builders import (
            _build_template_draft_content,
            generate_template_draft,
            generate_fallback_draft
        )
    except ImportError:
        from draft_template_builders import (
            _build_template_draft_content,
            generate_template_draft,
            generate_fallback_draft
        )


def find_matching_template_for_query(query: str) -> Optional[Dict[str, Any]]:
    """
    Identifies if a user query is specifically seeking to create, draft, or obtain a legal template.
    Returns the matching template metadata dictionary ONLY if genuine drafting intent is detected.
    Substantive legal research questions must NOT be intercepted here.
    """
    import re
    q = query.lower().strip()
    
    # Specific drafting / document creation action markers
    draft_action_markers = [
        "draft", "make a", "create a", "format", "template", "sample", "how to write",
        "prepare a", "drafting", "banao", "banana", "tyar karo", "praroop", "khaka",
        "sample draft", "legal draft"
    ]
    has_explicit_draft_action = any(k in q for k in draft_action_markers)

    # 1. Cheque Bounce Notice (Only when drafting/notice creation intent exists)
    if ("cheque bounce notice" in q or "check bounce notice" in q or 
        (has_explicit_draft_action and any(k in q for k in ["cheque bounce", "check bounce", "138 ni", "section 138"]))):
        return get_template_by_id("cheque_bounce_notice")

    # 2. Anticipatory Bail Application (Only when drafting intent exists)
    if (("anticipatory bail" in q or "agrim jamanat" in q) and 
        (has_explicit_draft_action or any(k in q for k in ["application", "draft", "format", "petition", "arzi", "aavedan"]))):
        return get_template_by_id("anticipatory_bail_application")

    # 3. Regular Bail Application
    if ("bail application" in q or "zamanat aavedan" in q or "jamanat arzi" in q or 
        (has_explicit_draft_action and "bail" in q)):
        return get_template_by_id("bail_application")

    # 4. RTI Application
    if (("rti" in q or "right to information" in q or "suchna ka adhikar" in q) and 
        (has_explicit_draft_action or any(k in q for k in ["application", "format", "draft", "sample", "aavedan", "kese likhe"]))):
        return get_template_by_id("rti_application")

    # 5. Consumer Complaint
    if (("consumer complaint" in q or "consumer court" in q or "upbhokta shikayat" in q) and 
        (has_explicit_draft_action or any(k in q for k in ["complaint draft", "format", "sample", "filing draft", "aavedan"]))):
        return get_template_by_id("consumer_complaint")

    # 6. Maintenance Application
    if (("maintenance" in q or "guzara bhatta" in q or "kharcha" in q) and 
        (has_explicit_draft_action or any(k in q for k in ["application", "format", "draft", "petition", "aavedan"]))):
        return get_template_by_id("maintenance_application")

    # 7. Affidavit
    if (("affidavit" in q or "shapath patra" in q or "halfnama" in q) and 
        (has_explicit_draft_action or any(k in q for k in ["format", "draft", "sample", "template"]))):
        return get_template_by_id("general_affidavit")

    # 8. Reply to Legal Notice
    if "reply to legal notice" in q or "reply to notice" in q or (has_explicit_draft_action and "notice reply" in q):
        return get_template_by_id("reply_legal_notice")

    # 9. Rent / Eviction Notice
    if (("rent notice" in q or "eviction notice" in q or "lease notice" in q) or 
        (has_explicit_draft_action and any(k in q for k in ["kirayedar", "makan malik", "rent", "tenant"]))):
        return get_template_by_id("rent_lease_notice")

    # 10. FIR / Police Complaint Draft
    if (has_explicit_draft_action and any(k in q for k in ["fir", "police complaint", "tahrir", "shikayat patra"])) or "fir draft" in q or "police complaint format" in q:
        return get_template_by_id("fir_application")

    # 11. General Legal Notice
    if has_explicit_draft_action and "legal notice" in q:
        return get_template_by_id("legal_demand_notice")

    # 12. General Petition / Representation
    if has_explicit_draft_action and any(k in q for k in ["petition", "representation", "gyapan"]):
        return get_template_by_id("general_petition")

    return None

