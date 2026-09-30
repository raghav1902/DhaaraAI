"""
draft_templates.py
==================
Fallback procedural drafting templates for FIR Applications and Statutory Legal Demand Notices.
Used by DhaaraRAGEngine when primary AI models are offline or unavailable.
"""

from typing import Dict, Any, Optional

def _safe_str(val: Any, default: str = "") -> str:
    if val is None:
        return default
    s = str(val).strip()
    return s if s else default

def generate_fallback_notice(
    complainant: Optional[Dict[str, Any]],
    accused: Optional[Dict[str, Any]],
    incident_datetime: Optional[str],
    incident_location: Optional[str],
    facts: Optional[str],
    evidence: Optional[str],
    relief: Optional[str],
    sections: Optional[str],
    is_hindi: bool
) -> str:
    comp = complainant or {}
    acc = accused or {}

    dt = _safe_str(incident_datetime, 'आज का दिनांक' if is_hindi else 'CURRENT DATE')
    loc = _safe_str(incident_location, 'स्थान' if is_hindi else 'LOCATION')
    raw_facts = _safe_str(facts, 'घटना के तथ्य' if is_hindi else 'Statement of undisputed facts')
    facts_preview = raw_facts[:60]
    ev = _safe_str(evidence, 'उपलब्ध अभिलेख, बैंक लेनदेन एवं पत्राचार' if is_hindi else 'Bank transfer statements, electronic communications, and transaction slips')
    rel = _safe_str(relief, 'इस नोटिस की प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त देय राशि/क्षतिपूर्ति का भुगतान करें।' if is_hindi else 'Rectify the default / refund the aggrieved amount in full within 15 statutory days.')
    secs = _safe_str(sections, 'भारतीय न्याय संहिता 2023 के सुसंगत प्रावधान' if is_hindi else 'Relevant provisions of Indian Law & BNS 2023')

    c_name = _safe_str(comp.get('name'), 'नोटिसकर्ता का नाम' if is_hindi else 'Complainant Full Name')
    c_father = _safe_str(comp.get('father_name'), 'पिता/पति का नाम' if is_hindi else 'Parent/Spouse Name')
    c_address = _safe_str(comp.get('address'), 'नोटिसकर्ता का पता' if is_hindi else 'Complete Address')
    c_phone = _safe_str(comp.get('phone'), '')

    a_name = _safe_str(acc.get('name'), 'प्रतिवादी का नाम' if is_hindi else 'Name of the Accused / Respondent')
    a_address = _safe_str(acc.get('address'), 'प्रतिवादी का पूर्ण पता' if is_hindi else 'Full Address / Contact Details')

    if is_hindi:
        return f"""रजिस्टर्ड डाक / विधिक मांग नोटिस (LEGAL DEMAND NOTICE)

दिनांक: {dt}
स्थान: {loc}

सेवा में (प्रतिवादी / प्राप्तकर्ता):
श्रीमान/श्रीमती: {a_name}
पता / संपर्क: {a_address}

प्रेषक (परिवादी / नोटिसकर्ता):
{c_name},
आत्मज/पत्नी: {c_father},
निवासी: {c_address},
संपर्क सूत्र: {c_phone}

विषय: विधिक मांग नोटिस बाबत {facts_preview}... 
सुसंगत विधिक धाराएं: {secs}

महोदय,
मेरे मुवक्किल/नोटिसकर्ता की ओर से आपको यह कानूनी नोटिस निम्नलिखित तथ्यों पर प्रेषित किया जाता है:

1. यह कि नोटिसकर्ता का विधिवत परिचय व अधिकार क्षेत्र उपरोक्त पते पर स्थित है।
2. यह कि दिनांक {dt} को स्थान {loc} पर निम्नलिखित कृत्य/घटना घटित हुई:
   {raw_facts}
3. यह कि आपके उक्त कृत्य के विरुद्ध निम्नलिखित साक्ष्य व दस्तावेज सुरक्षित हैं:
   {ev}
4. यह कि आपका यह कृत्य {secs} तथा भारतीय न्याय संहिता, 2023 (BNS) के सुसंगत प्रावधानों के अंतर्गत प्रत्यक्ष रूप से विधि विरुद्ध एवं दंडनीय है।

अतः इस विधिक नोटिस के माध्यम से आपको निर्देशित किया जाता है कि:
{rel}

चेतावनी: यदि आप इस नोटिस की प्राप्ति के 15 दिनों के भीतर उपरोक्त मांग की पूर्ति करने में विफल रहते हैं, तो नोटिसकर्ता आपके विरुद्ध सक्षम न्यायालय एवं पुलिस प्राधिकारियों के समक्ष दीवानी (Civil) एवं आपराधिक (Criminal) विधिक कार्यवाही संस्थित करने के लिए बाध्य होगा, जिसका संपूर्ण हर्ज़ा-खर्चा एवं परिणाम आपके व्यक्तिगत दायित्व पर होगा।

नोटिसकर्ता के हस्ताक्षर: .......................................
({c_name})"""
    else:
        return f"""LEGAL DEMAND NOTICE / STATUTORY NOTICE
(Sent via Registered Post A.D. / Speed Post / Digital Mode)

Date: {dt}
Place: {loc}

TO (NOTICE RECIPIENT / RESPONDENT):
Name: {a_name}
Address / Contact: {a_address}

FROM (COMPLAINANT / SENDER):
{c_name},
S/o, D/o, W/o: {c_father},
Residing at: {c_address},
Contact: {c_phone}

SUBJECT: STATUTORY LEGAL DEMAND NOTICE UNDER INDIAN LAW
GOVERNING STATUTES: {secs}

Sir / Madam,

Under instructions from and on behalf of my client / undersigned, I hereby serve upon you this formal Legal Demand Notice on the following grounds and facts:

1. FACTUAL BACKGROUND:
   On or around {dt} at {loc}, the following incident / dispute transpired:
   {raw_facts}

2. SUPPORTING EVIDENCE & DOCUMENTATION:
   The complainant holds conclusive documentation/evidence regarding the above matter, including:
   {ev}

3. STATUTORY INFRINGEMENT & BREACH:
   Your aforesaid wrongful actions and default constitute serious civil wrongs as well as cognizable offenses under {secs} and governing Indian enactments.

4. DEMAND & RELIEF SOUGHT:
   You are hereby called upon to comply with the following demands:
   {rel}

NOTICE PERIOD & PENAL CONSEQUENCES:
Take notice that if you fail to comply with the aforesaid statutory requisition within 15 (fifteen) calendar days from the receipt of this legal notice, the undersigned shall be constrained to initiate appropriate civil suits and criminal proceedings against you before the competent Courts of Law under the Bharatiya Nyaya Sanhita, 2023 (BNS) and Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS), holding you solely liable for all statutory costs, damages, interest, and legal consequences arising therefrom.

Complainant / Notice Sender Signature: .......................................
({c_name})"""

def generate_fallback_fir(
    complainant: Optional[Dict[str, Any]],
    accused: Optional[Dict[str, Any]],
    incident_datetime: Optional[str],
    incident_location: Optional[str],
    facts: Optional[str],
    evidence: Optional[str],
    sections: Optional[str],
    is_hindi: bool
) -> str:
    comp = complainant or {}
    acc = accused or {}

    dt = _safe_str(incident_datetime, 'विदित नहीं / रिकॉर्ड अनुसार' if is_hindi else 'As per police record')
    loc = _safe_str(incident_location, 'अधिकार क्षेत्र' if is_hindi else 'Jurisdictional area')
    raw_facts = _safe_str(facts, 'घटना का विस्तृत विवरण' if is_hindi else 'Detailed statement of the occurrence')
    ev = _safe_str(evidence, 'संलग्न दस्तावेज व साक्ष्य' if is_hindi else 'Enclosed documentation and evidence')
    secs = _safe_str(sections, 'धारा 173 BNSS एवं BNS 2023' if is_hindi else 'Section 173 BNSS & Bharatiya Nyaya Sanhita 2023')

    ps = _safe_str(comp.get('police_station'), 'स्थानीय पुलिस थाना' if is_hindi else '[Jurisdictional Police Station]')
    c_name = _safe_str(comp.get('name'), 'परिवादी का नाम' if is_hindi else 'Complainant Full Name')
    c_father = _safe_str(comp.get('father_name'), 'पिता/पति का नाम' if is_hindi else 'Parent/Spouse Name')
    c_address = _safe_str(comp.get('address'), 'परिवादी का पता' if is_hindi else 'Complete Address')
    c_phone = _safe_str(comp.get('phone'), '')

    a_name = _safe_str(acc.get('name'), 'अज्ञात / संदिग्ध' if is_hindi else 'Unknown person(s)')
    a_address = _safe_str(acc.get('address'), 'अज्ञात' if is_hindi else 'Unknown / Under Investigation')

    if is_hindi:
        return f"""सेवा में,
श्रीमान थाना प्रभारी (SHO) महोदय,
थाना: {ps},

विषय: धारा 173 भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS) के तहत प्राथमिकी (FIR) दर्ज करने बाबत।
संदर्भ धाराएं: {secs}

महोदय,
सविनय निवेदन है कि प्रार्थी/परिवादी का विवरण निम्नवत है:
1. परिवादी का नाम: {c_name}
   पिता/पति का नाम: {c_father}
   निवासी: {c_address}
   मोबाइल नंबर: {c_phone}

2. आरोपी / संदिग्ध का विवरण:
   नाम: {a_name}
   पता/विवरण: {a_address}

3. घटना का समय व स्थान:
   दिनांक व समय: {dt}
   स्थान: {loc}

4. घटना का विवरण:
   {raw_facts}

5. संलग्न साक्ष्य / दस्तावेज:
   {ev}

6. प्रार्थना:
   अतः श्रीमान जी से सादर प्रार्थना है कि प्रार्थी की उक्त शिकायत को तुरंत धारा 173 BNSS के अंतर्गत प्रथम सूचना रिपोर्ट (FIR) के रूप में दर्ज कर उचित कानूनी कार्रवाई करने की कृपा करें।

सत्यापन:
मैं सत्यनिष्ठा से प्रतिज्ञान करता/करती हूँ कि ऊपर लिखे तथ्य मेरी जानकारी और विश्वास में पूर्णतः सत्य हैं।

दिनांक: ...............
स्थान: ...............

हस्ताक्षर / अंगूठा निशानी: ...................................
({c_name})"""
    else:
        return f"""TO,
THE STATION HOUSE OFFICER (SHO),
POLICE STATION: {ps},

SUBJECT: COMPLAINT UNDER SECTION 173 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS) FOR REGISTRATION OF FIR.
GOVERNING STATUTES: {secs}

Sir/Madam,

I, the undersigned Complainant, state the relevant facts of the case as under:

1. COMPLAINANT PARTICULARS:
   - Full Name: {c_name}
   - S/o, D/o, W/o: {c_father}
   - Address: {c_address}
   - Contact Number: {c_phone}

2. ACCUSED / RESPONDENT PARTICULARS:
   - Name: {a_name}
   - Address/Details: {a_address}

3. INCIDENT TIMELINE & LOCATION:
   - Date & Time: {dt}
   - Location: {loc}

4. STATEMENT OF FACTS:
   {raw_facts}

5. ENCLOSURES & EVIDENCE:
   {ev}

6. PRAYER:
   It is therefore most respectfully prayed that an FIR may kindly be registered immediately under Section 173 of BNSS, 2023 read with applicable provisions of BNS 2023, and rigorous investigation be initiated against the accused person(s) in the interest of justice.

VERIFICATION:
Verified at on this day that the contents of the above complaint are true and correct to the best of my knowledge and belief.

Date: .....................
Place: ....................

Signature of Complainant: .......................................
({c_name})"""

def generate_fallback_draft(
    document_type: str,
    is_hindi: bool,
    complainant: Optional[Dict[str, Any]] = None,
    accused: Optional[Dict[str, Any]] = None,
    incident_datetime: Optional[str] = None,
    incident_location: Optional[str] = None,
    facts: Optional[str] = None,
    evidence: Optional[str] = None,
    relief: Optional[str] = None,
    sections: Optional[str] = None
) -> str:
    is_notice = "notice" in str(document_type or "").lower()
    if is_notice:
        return generate_fallback_notice(
            complainant=complainant,
            accused=accused,
            incident_datetime=incident_datetime,
            incident_location=incident_location,
            facts=facts,
            evidence=evidence,
            relief=relief,
            sections=sections,
            is_hindi=is_hindi
        )
    return generate_fallback_fir(
        complainant=complainant,
        accused=accused,
        incident_datetime=incident_datetime,
        incident_location=incident_location,
        facts=facts,
        evidence=evidence,
        sections=sections,
        is_hindi=is_hindi
    )
