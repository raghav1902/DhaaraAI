"""
draft_templates.py
==================
Fallback procedural drafting templates for FIR Applications and Statutory Legal Demand Notices.
Used by DhaaraRAGEngine when primary AI models are offline or unavailable.
"""

from typing import Dict

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
    sections: str
) -> str:
    is_notice = "notice" in str(document_type).lower()
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
