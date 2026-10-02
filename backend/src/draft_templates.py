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
# 2. Procedural Fallback Generators for all 12 Templates (English & Hindi)
# ---------------------------------------------------------------------------

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

    # 1. RTI Application
    if "rti" in clean_id:
        if is_hindi:
            return f"""सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत आवेदन
(FORM A - APPLICATION UNDER SECTION 6(1) OF RTI ACT, 2005)

दिनांक: {dt_str}
स्थान: {loc_str}

सेवा में,
लोक सूचना अधिकारी (Public Information Officer - PIO),
कार्यालय / विभाग: {a_name},
पता: {a_address}

विषय: सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत प्रमाणित सूचना उपलब्ध कराने बाबत।

महोदय / महोदया,

1. आवेदक का विवरण:
   - पूरा नाम: {c_name}
   - पिता/पति का नाम: {c_father}
   - पत्राचार का पता: {c_address}
   - मोबाइल नंबर: {c_phone}
   - नागरिकता: भारतीय (Indian Citizen)

2. चाही गई विशिष्ट सूचना का विवरण:
   {facts_str}

3. सूचना की समयावधि:
   {extras.get('period_of_info', dt_str)}

4. आवेदन शुल्क का विवरण:
   - आवेदन शुल्क ₹10/- (दस रुपये) का पोस्टल आर्डर / डिमांड ड्राफ्ट / रसीद संख्या: {extras.get('fee_receipt', '[IPO / DD / e-Challan No.]')} संलग्न है।
   - (यदि लागू हो) आवेदक गरीबी रेखा से नीचे (BPL) श्रेणी में आता है, राशन कार्ड सं.: {extras.get('bpl_no', 'लागू नहीं')}।

5. प्रार्थना:
   अतः श्रीमान जी से विनम्र निवेदन है कि अधिनियम की धारा 7(1) के अंतर्गत निर्धारित 30 दिवस की वैधानिक समय-सीमा के भीतर उपरोक्त चाही गई प्रमाणित सूचना आवेदक को रजिस्टर्ड डाक द्वारा उपलब्ध कराने की कृपा करें। यदि सूचना आपके विभाग से संबंधित नहीं है, तो कृपया धारा 6(3) के तहत इसे 5 दिन के भीतर संबंधित लोक प्राधिकारी को अंतरित करें।

संलग्नक:
1. आवेदन शुल्क ₹10/- का पोस्टल आर्डर / चालान
2. पहचान प्रमाण पत्र की प्रतिलिपि

भवदीय / आवेदक के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005
(For seeking official information from Public Authorities)

Date: {dt_str}
Place: {loc_str}

TO,
THE PUBLIC INFORMATION OFFICER (PIO) / APIO,
Office / Department: {a_name},
Address: {a_address}

SUBJECT: APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005.

Sir / Madam,

1. PARTICULARS OF THE APPLICANT:
   - Full Name: {c_name}
   - S/o, D/o, W/o: {c_father}
   - Complete Postal Address: {c_address}
   - Contact Mobile / Email: {c_phone}
   - Citizenship: Citizen of India

2. SPECIFIC PARTICULARS OF INFORMATION SOUGHT:
   {facts_str}

3. PERIOD TO WHICH INFORMATION PERTAINS:
   {extras.get('period_of_info', 'Relevant period up to current date')}

4. FORMAT OF INFORMATION REQUESTED:
   Certified True Copies / Inspection of records as permissible under Section 2(j) of the RTI Act.

5. APPLICATION FEE PARTICULARS:
   Application Fee of Rs. 10/- has been remitted vide Indian Postal Order / Demand Draft / Online Receipt No: {extras.get('fee_receipt', '[IPO / DD / Receipt Number]')} dated {dt_str}.
   (Fee exemption claimed under BPL category: {extras.get('bpl_no', 'N/A')}).

6. PRAYER:
   It is respectfully prayed that the certified information requested above be furnished to the applicant within the statutory period of 30 days as prescribed under Section 7(1) of the RTI Act, 2005. If the subject matter falls under another Public Authority, kindly transfer this application within 5 days under Section 6(3) of the Act with intimation to the undersigned.

ENCLOSURES:
1. Proof of RTI Application Fee (IPO / DD / Receipt)
2. Self-attested copy of Identity Proof

Applicant's Signature: .......................................
({c_name})"""

    # 2. Cheque Bounce Notice (Section 138 NI Act)
    elif "cheque" in clean_id:
        cq_no = extras.get("cheque_number", "[Cheque Number e.g. 458921]")
        cq_amt = extras.get("cheque_amount", "[Amount in Rs. e.g. ₹2,50,000/-]")
        cq_date = extras.get("cheque_date", dt_str)
        cq_bank = extras.get("bank_name", "[Drawee Bank Name & Branch]")
        memo_dt = extras.get("memo_date", dt_str)
        memo_rsn = extras.get("memo_reason", "Funds Insufficient / खाता में अपर्याप्त राशि")

        if is_hindi:
            return f"""रजिस्टर्ड डाक / स्पीड पोस्ट पावती सहित
विधिक मांग नोटिस बाबत चेक अनादरण (धारा 138 पराक्राम्य लिखत अधिनियम)
(STATUTORY NOTICE UNDER SECTION 138 OF NEGOTIABLE INSTRUMENTS ACT, 1881)

दिनांक: {dt_str}
स्थान: {loc_str}

सेवा में (विपक्षी / चेक जारीकर्ता):
नाम: {a_name}
पता: {a_address}

प्रेषक (नोटिसकर्ता / चेक धारक):
{c_name}, आत्मज: {c_father},
निवासी: {c_address}, फोन: {c_phone}

विषय: पराक्राम्य लिखत अधिनियम, 1881 की धारा 138 व BNS 2023 की धारा 318 के तहत चेक क्रमांक {cq_no} राशि {cq_amt} के अनादरण (बाउंस) बाबत 15 दिवसीय विधिक मांग नोटिस।

महोदय,
मेरे मुवक्किल / अधोहस्ताक्षरी की ओर से आपको यह कानूनी नोटिस निम्नलिखित तथ्यों पर प्रेषित किया जाता है:

1. यह कि आपने अपनी वैध कानूनी देनदारी एवं दायित्व के भुगतान स्वरूप नोटिसकर्ता के पक्ष में निम्नलिखित चेक जारी किया था:
   - चेक क्रमांक: {cq_no}
   - दिनांक: {cq_date}
   - राशि: {cq_amt}
   - बैंक व शाखा: {cq_bank}

2. यह कि नोटिसकर्ता द्वारा उक्त चेक को अपने बैंक खाते में वैध अवधि के भीतर भुगतान हेतु प्रस्तुत किया गया। किंतु नोटिसकर्ता का उक्त चेक संबंधित बैंक द्वारा दिनांक {memo_dt} को रिटर्न मेमो सहित अनादरित (Dishonour) कर वापस लौटा दिया गया, जिसका कारण "{memo_rsn}" अंकित था।

3. यह कि आपके द्वारा जानबूझकर दुर्भावनापूर्ण इरादे से उक्त चेक नोटिसकर्ता को थमाया गया, जो कि पराक्राम्य लिखत अधिनियम की धारा 138 तथा भारतीय न्याय संहिता, 2023 की धारा 318(4) के तहत एक गंभीर दाण्डिक अपराध है।

4. अतः इस वैधानिक नोटिस के माध्यम से आपको 15 (पंद्रह) दिनों की कानूनी मोहलत दी जाती है कि इस नोटिस की प्राप्ति से 15 दिवस के भीतर उक्त चेक की संपूर्ण राशि {cq_amt} का भुगतान नोटिसकर्ता को करना सुनिश्चित करें।

चेतावनी: यदि आप 15 दिवस के भीतर भुगतान करने में विफल रहते हैं, तो नोटिसकर्ता आपके विरुद्ध सक्षम न्यायालय में धारा 138 NI Act के तहत आपराधिक परिवाद तथा धारा 318 BNS के तहत अभियोजन संस्थित करेगा, जिसमें आपको 2 वर्ष तक का कारावास एवं चेक राशि का दोगुना जुर्माना भुगतना पड़ सकता है।

नोटिसकर्ता के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""REGISTERED A.D. / SPEED POST NOTICE
STATUTORY DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
(Read with Section 142 NI Act and Section 318 Bharatiya Nyaya Sanhita, 2023)

Date: {dt_str}
Place: {loc_str}

TO (DRAWER / ACCUSED):
Name: {a_name}
Address: {a_address}

FROM (PAYEE / COMPLAINANT):
{c_name}, S/o / D/o / W/o: {c_father},
Residing at: {c_address}, Contact: {c_phone}

SUBJECT: STATUTORY LEGAL NOTICE UNDER SECTION 138(b) OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 FOR DISHONOUR OF CHEQUE NO. {cq_no} DATED {cq_date} FOR RS. {cq_amt}.

Sir / Madam,

Under instructions from and on behalf of my client / undersigned, I hereby serve upon you this mandatory Statutory Demand Notice:

1. FACTUAL BACKGROUND & LIABILITY:
   In discharge of your legally enforceable debt and subsisting commercial liability towards the Complainant, you issued the following Negotiable Instrument:
   - Cheque Number: {cq_no}
   - Cheque Date: {cq_date}
   - Amount: {cq_amt}
   - Drawee Bank & Branch: {cq_bank}

2. PRESENTMENT & DISHONOUR:
   The Complainant presented the aforesaid cheque for encashment through their bankers within its statutory validity period. However, the said cheque was returned unpaid and dishonoured by the bank vide Bank Return Memo dated {memo_dt} with the endorsement: "{memo_rsn}".

3. STATUTORY INFRINGEMENT:
   Despite receipt of the dishonour advice, you have deliberately failed to maintain sufficient balance. Your conduct constitutes a criminal offense punishable under Section 138 of the Negotiable Instruments Act, 1881 and Section 318(4) of the Bharatiya Nyaya Sanhita, 2023.

4. STATUTORY 15-DAY REQUISITION:
   You are hereby called upon to pay the entire cheque amount of {cq_amt} to the Complainant within 15 (fifteen) calendar days from the date of receipt of this notice, failing which:
   The Complainant shall file a formal Criminal Complaint under Section 138 and 142 of the Negotiable Instruments Act before the competent Judicial Magistrate having territorial jurisdiction, holding you liable for imprisonment up to two years, fine extending to twice the cheque amount, and full statutory interest and legal costs.

Complainant / Payee Signature: .......................................
({c_name})"""

    # 3. Regular Bail Application (Section 480 / 483 BNSS)
    elif "anticipatory" not in clean_id and "bail" in clean_id:
        court = extras.get("court_name", "[In the Court of Judicial Magistrate First Class / Sessions Judge]")
        fir_no = extras.get("fir_number", "[FIR No. / Year]")
        secs = sections or extras.get("sections_booked", "BNS 2023 provisions")

        if is_hindi:
            return f"""न्यायालय {court}, {loc_str}
जमानत प्रार्थना पत्र अंतर्गत धारा 480 / 483 भारतीय नागरिक सुरक्षा संहिता, 2023
(पूर्व धारा 437 / 439 दंड प्रक्रिया संहिता, 1973)

केस / FIR संख्या: {fir_no}
थाना: {c_station}
धाराएं: {secs}

प्रार्थी / अभियुक्त:
{c_name}, आत्मज: {c_father},
निवासी: {c_address}
(वर्तमान में न्यायिक हिरासत में...)

बनाम

विपक्षी:
राज्य (State) मार्फत थाना प्रभारी, {c_station}

विषय: अभियुक्त {c_name} की ओर से नियमित जमानत (Regular Bail) प्रार्थना पत्र।

महोदय,
प्रार्थी/अभियुक्त की ओर से सादर निवेदन निम्नवत है:

1. यह कि प्रार्थी को उपरोक्त झूठे व मनगढ़ंत मामले में दिनांक {dt_str} को पुलिस द्वारा गिरफ्तार कर न्यायिक अभिरक्षा में भेजा गया है।
2. यह कि प्रार्थी पूर्णतः निर्दोष है और उसने कथित अपराध नहीं किया है। अभियोजन की कहानी आधारहीन व विरोधाभासी है।
3. यह कि प्रार्थी के विरुद्ध मामले की प्रारंभिक जांच/रिमांड पूर्ण हो चुकी है और अब प्रार्थी से किसी प्रकार की भौतिक बरामदगी शेष नहीं है।
4. यह कि सर्वोच्च न्यायालय के ऐतिहासिक निर्णय 'सतिंदर कुमार अंतिल बनाम सीबीआई (2022)' के सिद्धांत अनुसार "Bail is the rule, jail is the exception"।
5. यह कि प्रार्थी सम्मानित नागरिक है, उसका कोई पूर्व आपराधिक रिकॉर्ड नहीं है तथा उसके फरार होने या साक्ष्यों को प्रभावित करने की कोई संभावना नहीं है।

प्रार्थना:
अतः सादर प्रार्थना है कि प्रार्थी/अभियुक्त का जमानत प्रार्थना पत्र स्वीकार फरमाकर, न्यायालय द्वारा नियत उचित मुचलके व सक्षम ज़मानतदार पेश करने पर प्रार्थी को न्यायिक हिरासत से रिहा करने का आदेश पारित करने की कृपा करें।

प्रार्थी / अधिवक्ता के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""IN THE COURT OF {court} AT {loc_str}
APPLICATION FOR REGULAR BAIL UNDER SECTION 480 / 483 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
(Formerly Section 437 / 439 of the Code of Criminal Procedure, 1973)

IN THE MATTER OF:
CRIME / FIR NO: {fir_no}
POLICE STATION: {c_station}
OFFENSES UNDER SECTIONS: {secs}

APPLICANT / ACCUSED:
{c_name}, S/o: {c_father},
Residing at: {c_address}
(Currently in Judicial Custody at District Jail...)

VERSUS

RESPONDENT:
State of [State Name] through Station House Officer, {c_station}

MOST RESPECTFULLY SHOWETH:

1. CUSTODY PARTICULARS:
   The Applicant was arrested on {dt_str} in connection with the aforementioned FIR and has been remanded to judicial custody since then.

2. FALSE IMPLICATION & INNOCENCE:
   The Applicant is innocent and has been falsely implicated due to rivalry/misunderstanding. The allegations in the FIR do not disclose a prima facie case against the Applicant.

3. INVESTIGATION & RECOVERY COMPLETE:
   The interrogation and relevant custodial inquiry of the Applicant is complete. No weapon, illicit material, or recovery is pending from the Applicant.

4. BINDING PRECEDENT (SATENDER KUMAR ANTIL RULING):
   As authoritatively settled by the Supreme Court in Satender Kumar Antil v. CBI (2022) 10 SCC 51, bail is the rule and jail is an exception. Pre-trial detention cannot be punitive.

5. ROOTS IN SOCIETY & COOPERATION:
   The Applicant is a permanent resident having clean antecedents and deep roots in society. The Applicant undertakes not to tamper with prosecution witnesses and to abide by all bail conditions.

PRAYER:
It is therefore most respectfully prayed that this Hon'ble Court may be pleased to release the Applicant on Regular Bail in FIR No. {fir_no} P.S. {c_station}, upon furnishing sound local sureties and bail bonds to the satisfaction of this Hon'ble Court.

ADVOCATE FOR APPLICANT / ACCUSED: .......................................
Applicant: ({c_name})"""

    # 4. Anticipatory Bail Application (Section 482 BNSS)
    elif "anticipatory" in clean_id:
        court = extras.get("court_name", "[In the Court of Principal Sessions Judge / High Court]")
        secs = sections or extras.get("apprehended_sections", "Non-bailable provisions under BNS 2023")

        if is_hindi:
            return f"""न्यायालय {court}, {loc_str}
अग्रिम जमानत प्रार्थना पत्र अंतर्गत धारा 482 भारतीय नागरिक सुरक्षा संहिता, 2023
(पूर्व धारा 438 दंड प्रक्रिया संहिता, 1973)

थाना: {c_station}
आशंकित धाराएं: {secs}

प्रार्थी / आवेदक:
{c_name}, आत्मज: {c_father},
निवासी: {c_address}

बनाम

विपक्षी:
राज्य (State) मार्फत थाना प्रभारी, {c_station}

विषय: प्रार्थी की संभावित गिरफ्तारी की आशंका के तहत अग्रिम जमानत (Anticipatory Bail) हेतु प्रार्थना पत्र।

महोदय,
प्रार्थी की ओर से सादर निवेदन निम्नवत है:

1. यह कि प्रार्थी को ठोस आधार पर गंभीर आशंका है कि विपक्षी/शिकायतकर्ता के झूठे व रंजिशन आरोपों के आधार पर पुलिस द्वारा प्रार्थी को गैर-जमानती अपराध के तहत गिरफ्तार किया जा सकता है।
2. यह कि प्रार्थी प्रतिष्ठित नागरिक है। सर्वोच्च न्यायालय की संविधान पीठ के निर्णय 'सुशीला अग्रवाल बनाम राज्य (एनसीटी दिल्ली) 2020' के अनुसार अग्रिम जमानत नागरिक की व्यक्तिगत स्वतंत्रता (अनुच्छेद 21) का महत्वपूर्ण सुरक्षा चक्र है।
3. यह कि 7 वर्ष से कम सजा वाले अपराधों में पुलिस द्वारा धारा 35(3) BNSS (अर्नश कुमार गाइडलाइंस) का पालन अनिवार्य है, किंतु प्रार्थी को सीधे गिरफ्तार करने का भय है।
4. यह कि प्रार्थी पुलिस जांच में पूर्ण सहयोग करने तथा साक्षियों को किसी प्रकार से प्रभावित न करने का वचन देता है।

प्रार्थना:
अतः सादर प्रार्थना है कि प्रार्थी का अग्रिम जमानत प्रार्थना पत्र स्वीकार फरमाते हुए निर्देश दिए जाएं कि यदि प्रार्थी को उपरोक्त आशंकित मामले/थाना {c_station} में गिरफ्तार किया जाता है, तो उसे तुरंत उचित जमानत मुचलके पर रिहा किया जाए।

प्रार्थी / अधिवक्ता के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""IN THE COURT OF {court} AT {loc_str}
APPLICATION FOR ANTICIPATORY BAIL UNDER SECTION 482 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
(Formerly Section 438 of the Code of Criminal Procedure, 1973)

POLICE STATION: {c_station}
APPREHENDED OFFENSES UNDER SECTIONS: {secs}

APPLICANT:
{c_name}, S/o / W/o: {c_father},
Residing at: {c_address}, Contact: {c_phone}

VERSUS

RESPONDENT:
State of [State Name] through Station House Officer, {c_station}

MOST RESPECTFULLY SHOWETH:

1. REASONABLE APPREHENSION OF ARREST:
   The Applicant has genuine, well-founded apprehension of being arrested in connection with non-bailable accusations engineered by rival interests at P.S. {c_station}.

2. STATEMENT OF TRUE FACTS:
   {facts_str}

3. SUSHILA AGGARWAL CONSTITUTIONAL BENCH MANDATE:
   The Hon'ble Supreme Court in Sushila Aggarwal v. State (NCT of Delhi) (2020) 1 SCR 1 held that protection under Section 438 (now Section 482 BNSS) is an essential safeguard of personal liberty under Article 21, and should not normally be restricted in duration.

4. STATUTORY UNDERTAKINGS:
   The Applicant undertakes:
   (a) To make himself/herself available for interrogation by police officers as and when required;
   (b) Not to induce, threaten, or tamper with any person acquainted with the facts of the case;
   (c) Not to leave the country without prior permission of this Hon'ble Court.

PRAYER:
It is most respectfully prayed that this Hon'ble Court may graciously be pleased to direct that in the event of arrest of the Applicant in connection with the alleged accusations at P.S. {c_station}, the Applicant be admitted to Anticipatory Bail upon furnishing suitable bail bonds.

ADVOCATE FOR APPLICANT: .......................................
Applicant: ({c_name})"""

    # 5. Consumer Complaint (Section 35 Consumer Protection Act 2019)
    elif "consumer" in clean_id:
        p_date = extras.get("purchase_date", dt_str)
        c_amt = extras.get("consideration_amount", "[Amount Paid in Rs.]")

        if is_hindi:
            return f"""जिला उपभोक्ता विवाद प्रतितोष आयोग, {loc_str}
उपभोक्ता परिवाद अंतर्गत धारा 35 उपभोक्ता संरक्षण अधिनियम, 2019

परिवादी / उपभोक्ता:
{c_name}, आत्मज: {c_father},
निवासी: {c_address}, फोन: {c_phone}

बनाम

विपक्षी / सेवा प्रदाता:
{a_name},
पता: {a_address}

विषय: दोषपूर्ण वस्तु / सेवा में घोर कमी (Deficiency in Service) एवं क्षतिपूर्ति बाबत उपभोक्ता शिकायत।

महोदय,
परिवादी की ओर से परिवाद निम्न प्रकार प्रस्तुत है:

1. परिवादी की उपभोक्ता स्थिति:
   परिवादी ने विपक्षी से दिनांक {p_date} को कुल प्रतिफल राशि {c_amt} का भुगतान कर वस्तु/सेवा क्रय की थी। अतः परिवादी अधिनियम की धारा 2(7) के तहत 'उपभोक्ता' है।

2. विवाद व सेवा में कमी के तथ्य:
   {facts_str}

3. विधिक नोटिस एवं असफलता:
   परिवादी द्वारा विपक्षी को सूचित करने एवं कानूनी मांग करने के बावजूद विपक्षी ने दोष का निवारण नहीं किया, जो अधिनियम की धारा 2(11) के अंतर्गत प्रत्यक्ष रूप से 'सेवा में कमी' है।

प्रार्थना / अनुतोष:
अतः परिवादी प्रार्थना करता है कि विपक्षी को निर्देशित किया जाए:
(क) भुगतान की गई मूल राशि {c_amt} मय 18% वार्षिक ब्याज वापस लौटाएं;
(ख) मानसिक प्रताड़ना व उत्पीड़न हेतु ₹1,00,000/- की क्षतिपूर्ति अदा करें;
(ग) परिवाद व्यय के रूप में ₹25,000/- प्रदान करें।

सत्यापन:
मैं सत्यनिष्ठा से प्रतिज्ञान करता हूँ कि उपरोक्त परिवाद के समस्त तथ्य मेरी व्यक्तिगत जानकारी में सत्य हैं।

परिवादी के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION AT {loc_str}
CONSUMER COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

COMPLAINANT / CONSUMER:
{c_name}, S/o: {c_father},
Residing at: {c_address}, Contact: {c_phone}

VERSUS

OPPOSITE PARTY (TRADER / SERVICE PROVIDER):
{a_name},
Address: {a_address}

SUBJECT: COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE, UNFAIR TRADE PRACTICE AND COMPENSATION.

1. CONSUMER STATUS & CONSIDERATION:
   The Complainant purchased goods / availed services from the Opposite Party on {p_date} against valuable consideration of Rs. {c_amt} and is a bona fide 'Consumer' under Section 2(7) of the Consumer Protection Act, 2019.

2. STATEMENT OF FACTS & DEFICIENCY:
   {facts_str}

3. JURISDICTION & LIMITATION:
   The cause of action arose at {loc_str} and the total value of consideration and claim is within the pecuniary threshold of this Hon'ble District Commission. The complaint is filed well within the 2-year limitation period under Section 69 of the Act.

4. PRAYER / RELIEF SOUGHT:
   The Complainant most respectfully prays that this Hon'ble Commission may be pleased to direct the Opposite Party:
   (a) To refund the amount of Rs. {c_amt} along with interest @ 18% p.a. from payment date;
   (b) To pay compensation of Rs. 1,00,000/- for gross mental agony, physical hardship, and deficiency;
   (c) To award litigation costs of Rs. 25,000/- in favour of the Complainant.

VERIFICATION:
Verified at {loc_str} that the contents of paragraphs 1 to 4 are true to my personal knowledge.

Complainant Signature: .......................................
({c_name})"""

    # 6. Maintenance Application (Section 144 BNSS / Section 125 CrPC)
    elif "maintenance" in clean_id:
        court = extras.get("court_name", "[In the Court of Principal Judge, Family Court / CJM]")
        m_date = extras.get("marriage_date", "[Date of Marriage]")

        if is_hindi:
            return f"""न्यायालय {court}, {loc_str}
भरण-पोषण आवेदन अंतर्गत धारा 144 भारतीय नागरिक सुरक्षा संहिता, 2023
(पूर्व धारा 125 दंड प्रक्रिया संहिता, 1973)

आवेदिका / पत्नी:
{c_name}, पत्नी: {a_name},
निवासी: {c_address}, फोन: {c_phone}

बनाम

विपक्षी / पति:
{a_name}, आत्मज: [ससुर का नाम],
निवासी: {a_address}

विषय: पत्नी एवं आश्रित बच्चों के गुजारा भत्ता (मासिक भरण-पोषण) हेतु आवेदन पत्र।

महोदय,
आवेदिका की ओर से सादर निवेदन निम्नवत है:

1. वैवाहिक संबंध:
   आवेदिका व विपक्षी का विवाह दिनांक {m_date} को हिंदू रीति-रिवाज से संपन्न हुआ था।

2. क्रूरता एवं परित्याग के तथ्य:
   {facts_str}
   विपक्षी ने बिना किसी युक्तिसंगत कारण के आवेदिका का परित्याग कर दिया है और कोई भरण-पोषण नहीं दे रहा है।

3. दोनों पक्षों की आर्थिक स्थिति:
   आवेदिका स्वयं का भरण-पोषण करने में पूर्णतः असमर्थ है, जबकि विपक्षी सक्षम है और प्रतिमाह पर्याप्त आय अर्जित करता है।

4. 'रजनेश बनाम नेहा (2020)' का सर्वोच्च न्यायालय दिशानिर्देश:
   माननीय सुप्रीम कोर्ट के निर्देशानुसार परिसंपत्तियों और देनदारियों का विस्तृत शपथ-पत्र (Affidavit of Assets and Liabilities) साथ में संलग्न है।

प्रार्थना:
अतः प्रार्थना है कि विपक्षी को आवेदिका के जीवन-यापन हेतु ₹35,000/- प्रतिमाह अंतरिम व अंतिम भरण-पोषण तथा ₹25,000/- मुकदमा खर्च आवेदन की तिथि से दिलाने का आदेश पारित किया जाए।

आवेदिका के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""IN THE COURT OF {court} AT {loc_str}
PETITION FOR MAINTENANCE UNDER SECTION 144 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
(Formerly Section 125 of the Code of Criminal Procedure, 1973)

PETITIONER (WIFE):
{c_name}, W/o: {a_name},
Residing at: {c_address}, Contact: {c_phone}

VERSUS

RESPONDENT (HUSBAND):
{a_name}, S/o: [Father's Name],
Residing at: {a_address}

SUBJECT: APPLICATION UNDER SECTION 144 BNSS 2023 FOR GRANT OF MONTHLY INTERIM AND FINAL MAINTENANCE.

1. MATRIMONIAL RELATIONSHIP:
   The solemnization of marriage between Petitioner and Respondent took place on {m_date} as per recognized legal rites.

2. NEGLECT, CRUELTY & ABANDONMENT:
   {facts_str}
   The Respondent has neglected and refused to maintain the Petitioner without just or lawful cause.

3. INABILITY OF PETITIONER & CAPACITY OF RESPONDENT:
   The Petitioner has no independent source of livelihood. The Respondent is an able-bodied person with sound monthly income and assets.

4. COMPLIANCE WITH RAJNESH V. NEHA (2020) 13 SCR 883:
   The mandatory comprehensive Affidavit of Disclosure of Assets and Liabilities as per Supreme Court directions is submitted herewith.

PRAYER:
The Petitioner most respectfully prays that this Hon'ble Court may be pleased to direct the Respondent:
(a) To pay a sum of Rs. 35,000/- per month towards interim and final maintenance from the date of filing;
(b) To pay a sum of Rs. 25,000/- towards litigation expenses.

Petitioner Signature: .......................................
({c_name})"""

    # 7. General Sworn Affidavit
    elif "affidavit" in clean_id:
        if is_hindi:
            return f"""शपथ-पत्र (AFFIDAVIT)
(गैर-न्यायिक स्टांप पेपर पर निष्पादित एवं नोटरी पब्लिक द्वारा सत्यापित)

मैं, {c_name}, आत्मज: {c_father}, आयु लगभग [आयु] वर्ष, निवासी: {c_address}, सत्यनिष्ठापूर्वक प्रतिज्ञान करता/करती हूँ:

1. यह कि मैं उपरोक्त पते का स्थायी निवासी हूँ तथा इस शपथ-पत्र के समस्त तथ्यों से भलीभांति अवगत हूँ।
2. यह कि:
   {facts_str}
3. यह कि मेरे द्वारा प्रस्तुत समस्त अभिलेख, प्रमाण व साक्ष्य पूर्णतः वास्तविक व प्रमाणिक हैं।
4. यह कि मैंने कोई भी सारवान तथ्य छिपाया नहीं है और न ही कोई असत्य कथन किया है।

सत्यापन (VERIFICATION):
मैं, शपथकर्ता, आज दिनांक {dt_str} को स्थान {loc_str} पर सत्यापित करता/करती हूँ कि इस शपथ-पत्र के पैरा 1 से 4 में वर्णित समस्त कथन मेरी निजी जानकारी व विश्वास में पूर्णतः सत्य हैं। इसमें कुछ भी असत्य नहीं है। ईश्वर मेरी सहायता करे।

पहचानकर्ता: .......................................
शपथकर्ता के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""SWORN AFFIDAVIT
(Executed on Non-Judicial Stamp Paper & Attested before Notary Public / Oath Commissioner)

I, {c_name}, S/o / D/o / W/o: {c_father}, aged about [Age] years, residing at: {c_address}, do hereby solemnly affirm and declare on oath as under:

1. That I am a citizen of India and competent to swear this solemn affidavit.
2. That:
   {facts_str}
3. That all documents, statements, and attachments furnished by the Deponent are genuine, true, and authentic.
4. That no material facts have been concealed, suppressed, or misrepresented herein.

VERIFICATION:
Verified at {loc_str} on this {dt_str} that the contents of paragraphs 1 to 4 of this affidavit are true and correct to my personal knowledge and belief. No part of it is false and nothing material has been concealed therefrom. So help me God.

DEPONENT SIGNATURE: .......................................
({c_name})"""

    # 8. Police Complaint / FIR Application (Section 173 BNSS)
    elif "fir" in clean_id or "complaint" in clean_id and "consumer" not in clean_id:
        return generate_fallback_fir(
            complainant=complainant,
            accused=accused,
            incident_datetime=dt_str,
            incident_location=loc_str,
            facts=facts_str,
            evidence=evidence_str,
            sections=sections,
            is_hindi=is_hindi
        )

    # 9. Reply to Legal Notice
    elif "reply" in clean_id:
        n_date = extras.get("notice_date", dt_str)
        if is_hindi:
            return f"""रजिस्टर्ड डाक द्वारा विधिक नोटिस का प्रत्युत्तर
(REPLY TO STATUTORY LEGAL NOTICE)

दिनांक: {dt_str}
स्थान: {loc_str}

सेवा में (मूल नोटिस भेजने वाले के अधिवक्ता / पक्षकार):
{a_name},
पता: {a_address}

प्रेषक (प्रत्युत्तरदाता):
{c_name}, आत्मज: {c_father},
निवासी: {c_address}, फोन: {c_phone}

विषय: आपके कथित विधिक नोटिस दिनांकित {n_date} का सविस्तार प्रत्युत्तर एवं झूठे दावों का खंडन।

महोदय,
आपके कथित विधिक नोटिस दिनांकित {n_date} का उत्तर निम्नानुसार प्रेषित है:

1. प्रारंभिक आपत्तियां:
   आपका कथित नोटिस आधारहीन, भ्रामक, दुर्भावनापूर्ण एवं ब्लैकमेल करने के उद्देश्य से भेजा गया है, जो विधि अनुसार चलने योग्य नहीं है।

2. पैरावार खंडन एवं वास्तविक तथ्य:
   {facts_str}
   कथित नोटिस में लगाए गए समस्त आरोप पूर्णतः असत्य, मनगढ़ंत और सिरे से अस्वीकार किए जाते हैं।

3. देनदारी का अभाव:
   नोटिसकर्ता की प्रत्युत्तरदाता के प्रति कोई विधिक देनदारी नहीं बनती है। उल्टे नोटिसकर्ता ने ही शर्तों का उल्लंघन किया है।

4. चेतावनी:
   अतः आपको निर्देशित किया जाता है कि अपने निराधार नोटिस को तुरंत वापस लें। यदि आप कोई अनावश्यक कानूनी कार्यवाही करते हैं, तो उसका संपूर्ण हर्ज़ा-खर्चा व दायित्व आपका होगा।

प्रत्युत्तरदाता के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""REPLY TO STATUTORY LEGAL NOTICE
(Sent via Registered Post A.D. / Speed Post)

Date: {dt_str}
Place: {loc_str}

TO (ADVOCATE / CLAIMANT):
{a_name},
Address: {a_address}

FROM (RESPONDENT):
{c_name}, S/o / W/o: {c_father},
Residing at: {c_address}, Contact: {c_phone}

SUBJECT: PARAWAISE REPLY AND REBUTTAL TO ALLEGED LEGAL NOTICE DATED {n_date}.

Sir / Madam,

Under instructions from and on behalf of my client / undersigned, this formal Reply to your notice dated {n_date} is served as under:

1. PRELIMINARY OBJECTIONS:
   The notice under reply is frivolous, legally untenable, based on distortion of facts, and an abuse of process.

2. PARAWAISE DENIAL OF FACTS:
   {facts_str}
   All allegations of default, inducement, or liability imputed against the Respondent in the notice under reply are vehemently denied in toto.

3. ABSENCE OF ENFORCEABLE LIABILITY:
   The Respondent owes no liquidated debt or contractual obligation to your client.

4. CAUTION & INDEMNITY:
   You are advised to counsel your client to desist from initiating malicious litigation. Should any frivolous proceeding be instituted, the Respondent shall defend with full statutory counterclaim, seeking exemplary damages and costs.

Respondent Signature: .......................................
({c_name})"""

    # 10. Rent / Lease Legal Notice (Section 106 T.P. Act)
    elif "rent" in clean_id or "lease" in clean_id:
        prop = extras.get("property_address", loc_str)
        if is_hindi:
            return f"""विधिक नोटिस बाबत किरायेदारी समाप्ति एवं बेदखली
(धारा 106 संपत्ति अंतरण अधिनियम, 1882)

दिनांक: {dt_str}
स्थान: {loc_str}

सेवा में (किरायेदार / विपक्षी):
{a_name},
पता (किराया परिसर): {prop}

प्रेषक (मकान मालिक / स्वामी):
{c_name}, आत्मज: {c_father},
निवासी: {c_address}, फोन: {c_phone}

विषय: संपत्ति अंतरण अधिनियम की धारा 106 के तहत किराया परिसर {prop} का कब्जा 15 दिवस के भीतर खाली करने व बकाया किराया चुकाने बाबत।

महोदय,
1. यह कि आप परिसर {prop} में ₹[मासिक किराया]/- प्रति माह की दर से मासिक किरायेदार हैं।
2. यह कि:
   {facts_str}
3. यह कि इस विधिक नोटिस द्वारा आपकी मासिक किरायेदारी को समाप्त (Terminate) किया जाता है।
4. अतः आपको 15 दिवस का वैधानिक नोटिस देते हुए निर्देशित किया जाता है कि नोटिस समाप्ति पर उक्त परिसर का शांतिपूर्ण कब्जा मालिक को सौंपें तथा बकाया किराया अदा करें। अन्यथा आपके विरुद्ध बेदखली वाद (Eviction Suit) व हर्जाने का मुकदमा संस्थित किया जाएगा।

मकान मालिक के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""STATUTORY LEGAL NOTICE FOR TERMINATION OF LEASE & EVICTION
UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882

Date: {dt_str}
Place: {loc_str}

TO (TENANT):
{a_name},
Tenanted Premises: {prop}

FROM (LESSOR / LANDLORD):
{c_name}, S/o: {c_father},
Residing at: {c_address}, Contact: {c_phone}

SUBJECT: 15-DAY NOTICE FOR DETERMINATION OF TENANCY AND VACATION OF PREMISES LOCATED AT {prop}.

1. TENANCY PARTICULARS:
   You have been occupying the tenanted premises situated at {prop} on a month-to-month tenancy against agreed monthly rent.

2. STATEMENT OF DEFAULT / GROUNDS:
   {facts_str}

3. STATUTORY TERMINATION UNDER SECTION 106 T.P. ACT:
   Take formal notice that your month-to-month tenancy in respect of the aforesaid demised premises stands terminated upon the expiry of 15 (fifteen) clear days from the date of receipt of this notice.

4. VACATION & ARREARS REQUISITION:
   You are called upon to peacefully quit, vacate, and deliver vacant possession of the premises to the Lessor and liquidate all arrears of rent and utility bills within the stipulated 15-day period, failing which eviction proceedings under the governing Rent / Civil laws shall be initiated at your sole peril as to costs and mesne profits.

Lessor / Landlord Signature: .......................................
({c_name})"""

    # 11. General Citizen Petition / Representation
    elif "petition" in clean_id or "representation" in clean_id:
        if is_hindi:
            return f"""नागरिक अभ्यावेदन / जन-याचिका (CITIZEN REPRESENTATION)
(संविधान के अनुच्छेद 350 के अंतर्गत शिकायत निवारण हेतु)

दिनांक: {dt_str}
स्थान: {loc_str}

सेवा में,
सक्षम प्राधिकारी / {a_name},
कार्यालय / विभाग: {a_address}

प्रेषक:
{c_name}, आत्मज: {c_father},
निवासी: {c_address}, फोन: {c_phone}

विषय: {relief_str[:70]}... के संबंध में प्रशासनिक अभ्यावेदन।

महोदय,
1. परिवादी का परिचय:
   प्रार्थी उक्त क्षेत्र का शांतिप्रिय नागरिक है।
2. समस्या व तथ्यों का विवरण:
   {facts_str}
3. जनहित व वैधानिक अधिकार:
   उक्त समस्या से नागरिकों के संविधान प्रदत्त अधिकारों एवं जन-सुविधाओं का हनन हो रहा है।
4. प्रार्थना:
   अतः श्रीमान जी से सादर प्रार्थना है कि मामले की तत्काल जांच कराकर {relief_str} करने की कृपा करें।

प्रार्थी के हस्ताक्षर: .......................................
({c_name})"""
        else:
            return f"""FORMAL ADMINISTRATIVE REPRESENTATION / CITIZEN PETITION
(Submitted under Article 350 of the Constitution of India for Redress of Grievances)

Date: {dt_str}
Place: {loc_str}

TO,
THE COMPETENT PUBLIC AUTHORITY / {a_name},
Office / Department: {a_address}

FROM:
{c_name}, S/o / W/o: {c_father},
Residing at: {c_address}, Contact: {c_phone}

SUBJECT: REPRESENTATION FOR ADMINISTRATIVE REDRESSAL REGARDING: {relief_str[:75]}...

Respected Sir / Madam,

1. APPLICANT PARTICULARS:
   The undersigned is a law-abiding citizen residing within your administrative jurisdiction.

2. STATEMENT OF GRIEVANCE & FACTS:
   {facts_str}

3. PUBLIC INTEREST & LEGAL SAFEGUARDS:
   The continued pendency of the above issue affects the legitimate statutory and fundamental rights guaranteed under Article 21 of the Constitution of India.

4. PRAYER / SPECIFIC REQUISITION:
   It is therefore earnestly requested that the competent authority may kindly take immediate administrative cognizance and direct {relief_str}.

Applicant Signature: .......................................
({c_name})"""

    # 12. Default / Legal Notice
    else:
        return generate_fallback_notice(
            complainant=complainant,
            accused=accused,
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


# Backward-compatible wrapper
def generate_fallback_draft(
    document_type: str,
    is_hindi: bool,
    complainant: Dict[str, str],
    accused: Dict[str, str],
    incident_datetime: str,
    incident_location: str,
    facts: str,
    evidence: str,
    relief: str,
    sections: str = "",
    extra_fields: Optional[Dict[str, Any]] = None
) -> str:
    return generate_template_draft(
        template_id=document_type,
        is_hindi=is_hindi,
        complainant=complainant,
        accused=accused,
        incident_datetime=incident_datetime,
        incident_location=incident_location,
        facts=facts,
        evidence=evidence,
        relief=relief,
        sections=sections,
        extra_fields=extra_fields
    )


def generate_fallback_notice(
    complainant: Dict[str, str],
    accused: Dict[str, str],
    incident_datetime: str,
    incident_location: str,
    facts: str,
    evidence: str,
    relief: str,
    sections: str,
    is_hindi: bool
) -> str:
    if is_hindi:
        return f"""रजिस्टर्ड डाक / विधिक मांग नोटिस (LEGAL DEMAND NOTICE)

दिनांक: {incident_datetime or 'आज का दिनांक'}
स्थान: {incident_location or 'स्थान'}

सेवा में (प्रतिवादी / प्राप्तकर्ता):
श्रीमान/श्रीमती: {accused.get('name', 'प्रतिवादी का नाम')}
पता / संपर्क: {accused.get('address', 'प्रतिवादी का पूर्ण पता')}

प्रेषक (परिवादी / नोटिसकर्ता):
{complainant.get('name', 'नोटिसकर्ता का नाम')},
आत्मज/पत्नी: {complainant.get('father_name', 'पिता/पति का नाम')},
निवासी: {complainant.get('address', 'नोटिसकर्ता का पता')},
संपर्क सूत्र: {complainant.get('phone', '')}

विषय: विधिक मांग नोटिस बाबत {facts[:60]}... 
सुसंगत विधिक धाराएं: {sections}

महोदय,
मेरे मुवक्किल/नोटिसकर्ता की ओर से आपको यह कानूनी नोटिस निम्नलिखित तथ्यों पर प्रेषित किया जाता है:

1. यह कि नोटिसकर्ता का विधिवत परिचय व अधिकार क्षेत्र उपरोक्त पते पर स्थित है।
2. यह कि दिनांक {incident_datetime} को स्थान {incident_location} पर निम्नलिखित कृत्य/घटना घटित हुई:
   {facts}
3. यह कि आपके उक्त कृत्य के विरुद्ध निम्नलिखित साक्ष्य व दस्तावेज सुरक्षित हैं:
   {evidence or 'उपलब्ध अभिलेख, बैंक लेनदेन एवं पत्राचार'}
4. यह कि आपका यह कृत्य {sections} तथा भारतीय न्याय संहिता, 2023 (BNS) के सुसंगत प्रावधानों के अंतर्गत प्रत्यक्ष रूप से विधि विरुद्ध एवं दंडनीय है।

अतः इस विधिक नोटिस के माध्यम से आपको निर्देशित किया जाता है कि:
{relief or 'इस नोटिस की प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त देय राशि/क्षतिपूर्ति का भुगतान करें अथवा विवादित कृत्य का तत्काल निवारण करें।'}

चेतावनी: यदि आप इस नोटिस की प्राप्ति के 15 दिनों के भीतर उपरोक्त मांग की पूर्ति करने में विफल रहते हैं, तो नोटिसकर्ता आपके विरुद्ध सक्षम न्यायालय एवं पुलिस प्राधिकारियों के समक्ष दीवानी (Civil) एवं आपराधिक (Criminal) विधिक कार्यवाही संस्थित करने के लिए बाध्य होगा, जिसका संपूर्ण हर्ज़ा-खर्चा एवं परिणाम आपके व्यक्तिगत दायित्व पर होगा।

नोटिसकर्ता के हस्ताक्षर: .......................................
({complainant.get('name', 'नोटिसकर्ता')})"""
    else:
        return f"""LEGAL DEMAND NOTICE / STATUTORY NOTICE
(Sent via Registered Post A.D. / Speed Post / Digital Mode)

Date: {incident_datetime or 'CURRENT DATE'}
Place: {incident_location or 'LOCATION'}

TO (NOTICE RECIPIENT / RESPONDENT):
Name: {accused.get('name', 'Name of the Accused / Respondent')}
Address / Contact: {accused.get('address', 'Full Address / Contact Details')}

FROM (COMPLAINANT / SENDER):
{complainant.get('name', 'Complainant Full Name')},
S/o, D/o, W/o: {complainant.get('father_name', 'Parent/Spouse Name')},
Residing at: {complainant.get('address', 'Complete Address')},
Contact: {complainant.get('phone', '')}

SUBJECT: STATUTORY LEGAL DEMAND NOTICE UNDER INDIAN LAW
GOVERNING STATUTES: {sections}

Sir / Madam,

Under instructions from and on behalf of my client / undersigned, I hereby serve upon you this formal Legal Demand Notice on the following grounds and facts:

1. FACTUAL BACKGROUND:
   On or around {incident_datetime} at {incident_location}, the following incident / dispute transpired:
   {facts}

2. SUPPORTING EVIDENCE & DOCUMENTATION:
   The complainant holds conclusive documentation/evidence regarding the above matter, including:
   {evidence or 'Bank transfer statements, electronic communications, and transaction slips'}

3. STATUTORY INFRINGEMENT & BREACH:
   Your aforesaid wrongful actions and default constitute serious civil wrongs as well as cognizable offenses under {sections} and governing Indian enactments.

4. DEMAND & RELIEF SOUGHT:
   You are hereby called upon to comply with the following demands:
   {relief or 'Rectify the default / refund the aggrieved amount in full within 15 (fifteen) statutory days from receipt of this notice.'}

NOTICE PERIOD & PENAL CONSEQUENCES:
Take notice that if you fail to comply with the aforesaid statutory requisition within 15 (fifteen) calendar days from the receipt of this legal notice, the undersigned shall be constrained to initiate appropriate civil suits and criminal proceedings against you before the competent Courts of Law under the Bharatiya Nyaya Sanhita, 2023 (BNS) and Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS), holding you solely liable for all statutory costs, damages, interest, and legal consequences arising therefrom.

Complainant / Notice Sender Signature: .......................................
({complainant.get('name', 'Complainant / Sender')})"""


def generate_fallback_fir(
    complainant: Dict[str, str],
    accused: Dict[str, str],
    incident_datetime: str,
    incident_location: str,
    facts: str,
    evidence: str,
    sections: str,
    is_hindi: bool
) -> str:
    if is_hindi:
        return f"""सेवा में,
श्रीमान थाना प्रभारी (SHO) महोदय,
थाना: {complainant.get('police_station', 'स्थानीय पुलिस थाना')},

विषय: धारा 173 भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS) के तहत प्राथमिकी (FIR) दर्ज करने बाबत।
संदर्भ धाराएं: {sections}

महोदय,
सविनय निवेदन है कि प्रार्थी/परिवादी का विवरण निम्नवत है:
1. परिवादी का नाम: {complainant.get('name', '')}
   पिता/पति का नाम: {complainant.get('father_name', '')}
   निवासी: {complainant.get('address', '')}
   मोबाइल नंबर: {complainant.get('phone', '')}

2. आरोपी / संदिग्ध का विवरण:
   नाम: {accused.get('name', 'अज्ञात')}
   पता/विवरण: {accused.get('address', 'अज्ञात')}

3. घटना का समय व स्थान:
   दिनांक व समय: {incident_datetime}
   स्थान: {incident_location}

4. घटना का विवरण:
   {facts}

5. संलग्न साक्ष्य / दस्तावेज:
   {evidence}

6. प्रार्थना:
   अतः श्रीमान जी से सादर प्रार्थना है कि प्रार्थी की उक्त शिकायत को तुरंत धारा 173 BNSS के अंतर्गत प्रथम सूचना रिपोर्ट (FIR) के रूप में दर्ज कर उचित कानूनी कार्रवाई करने की कृपा करें।

सत्यापन:
मैं सत्यनिष्ठा से प्रतिज्ञान करता/करती हूँ कि ऊपर लिखे तथ्य मेरी जानकारी और विश्वास में पूर्णतः सत्य हैं।

दिनांक: ...............
स्थान: ...............

हस्ताक्षर / अंगूठा निशानी: ...................................
({complainant.get('name', 'परिवादी')})"""
    else:
        return f"""TO,
THE STATION HOUSE OFFICER (SHO),
POLICE STATION: {complainant.get('police_station', '[Jurisdictional Police Station]')},

SUBJECT: COMPLAINT UNDER SECTION 173 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS) FOR REGISTRATION OF FIR.
GOVERNING STATUTES: {sections}

Sir/Madam,

I, the undersigned Complainant, state the relevant facts of the case as under:

1. COMPLAINANT PARTICULARS:
   - Full Name: {complainant.get('name', '')}
   - S/o, D/o, W/o: {complainant.get('father_name', '')}
   - Address: {complainant.get('address', '')}
   - Contact Number: {complainant.get('phone', '')}

2. ACCUSED / RESPONDENT PARTICULARS:
   - Name: {accused.get('name', 'Unknown person(s)')}
   - Address/Details: {accused.get('address', 'Unknown')}

3. INCIDENT TIMELINE & LOCATION:
   - Date & Time: {incident_datetime}
   - Location: {incident_location}

4. STATEMENT OF FACTS:
   {facts}

5. ENCLOSURES & EVIDENCE:
   {evidence}

6. PRAYER:
   It is therefore most respectfully prayed that an FIR may kindly be registered immediately under Section 173 of BNSS, 2023 read with applicable provisions of BNS 2023, and rigorous investigation be initiated against the accused person(s) in the interest of justice.

VERIFICATION:
Verified at on this day that the contents of the above complaint are true and correct to the best of my knowledge and belief.

Date: .....................
Place: ....................

Signature of Complainant: .......................................
({complainant.get('name', 'Complainant')})"""


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

