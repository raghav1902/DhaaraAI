"""
draft_builders_civil.py
=======================
Civil, administrative, and notice draft template builders for DhaaraAI.
"""
from typing import Dict, Any, Optional

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
    c = complainant or {}
    a = accused or {}
    c_name = c.get('name', 'नोटिसकर्ता' if is_hindi else 'Complainant / Sender')
    c_father = c.get('father_name', 'पिता/पति का नाम' if is_hindi else 'Parent/Spouse Name')
    c_address = c.get('address', 'नोटिसकर्ता का पता' if is_hindi else 'Complete Address')
    c_phone = c.get('phone', '')
    a_name = a.get('name', 'प्रतिवादी का नाम' if is_hindi else 'Name of the Accused / Respondent')
    a_address = a.get('address', 'प्रतिवादी का पूर्ण पता' if is_hindi else 'Full Address / Contact Details')
    if is_hindi:
        return f"""रजिस्टर्ड डाक / विधिक मांग नोटिस (LEGAL DEMAND NOTICE)

दिनांक: {incident_datetime or 'आज का दिनांक'}
स्थान: {incident_location or 'स्थान'}

सेवा में (प्रतिवादी / प्राप्तकर्ता):
श्रीमान/श्रीमती: {a_name}
पता / संपर्क: {a_address}

प्रेषक (परिवादी / नोटिसकर्ता):
{complainant.get('name', 'नोटिसकर्ता का नाम')},
आत्मज/पत्नी: {c_father},
निवासी: {c_address},
संपर्क सूत्र: {c_phone}

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
({c_name})"""
    else:
        return f"""LEGAL DEMAND NOTICE / STATUTORY NOTICE
(Sent via Registered Post A.D. / Speed Post / Digital Mode)

Date: {incident_datetime or 'CURRENT DATE'}
Place: {incident_location or 'LOCATION'}

TO (NOTICE RECIPIENT / RESPONDENT):
Name: {a_name}
Address / Contact: {a_address}

FROM (COMPLAINANT / SENDER):
{complainant.get('name', 'Complainant Full Name')},
S/o, D/o, W/o: {c_father},
Residing at: {c_address},
Contact: {c_phone}

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
({c_name})"""




def build_civil_template(
    clean_id: str,
    is_hindi: bool,
    c_name: str,
    c_father: str,
    c_phone: str,
    c_address: str,
    a_name: str,
    a_address: str,
    dt_str: str,
    loc_str: str,
    facts_str: str,
    relief_str: str,
    evidence_str: str,
    extras: Dict[str, Any],
    sections: str,
    complainant: Optional[Dict[str, str]] = None,
    accused: Optional[Dict[str, str]] = None
) -> Optional[str]:
    """Generates civil statutory drafts if matching template found."""
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

    elif 'consumer' in clean_id:
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

    elif 'affidavit' in clean_id:
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

    elif 'reply' in clean_id:
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

    elif 'rent' in clean_id or 'lease' in clean_id:
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

    elif 'petition' in clean_id or 'representation' in clean_id:
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


    return None
