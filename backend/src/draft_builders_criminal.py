"""
draft_builders_criminal.py
==========================
Criminal, bail, maintenance, and FIR draft template builders for DhaaraAI.
"""
from typing import Dict, Any, Optional

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
    c = complainant or {}
    a = accused or {}
    c_name = c.get('name', 'परिवादी' if is_hindi else 'Complainant')
    c_father = c.get('father_name', '')
    c_address = c.get('address', '')
    c_phone = c.get('phone', '')
    c_station = c.get('police_station', 'स्थानीय पुलिस थाना' if is_hindi else '[Jurisdictional Police Station]')
    a_name = a.get('name', 'अज्ञात' if is_hindi else 'Unknown person(s)')
    a_address = a.get('address', 'अज्ञात' if is_hindi else 'Unknown')
    if is_hindi:
        return f"""सेवा में,
श्रीमान थाना प्रभारी (SHO) महोदय,
थाना: {c_station},

विषय: धारा 173 भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS) के तहत प्राथमिकी (FIR) दर्ज करने बाबत।
संदर्भ धाराएं: {sections}

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
({c_name})"""
    else:
        return f"""TO,
THE STATION HOUSE OFFICER (SHO),
POLICE STATION: {c_station},

SUBJECT: COMPLAINT UNDER SECTION 173 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS) FOR REGISTRATION OF FIR.
GOVERNING STATUTES: {sections}

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
({c_name})"""




def build_criminal_template(
    clean_id: str,
    is_hindi: bool,
    c_name: str,
    c_father: str,
    c_phone: str,
    c_address: str,
    c_station: str,
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
    """Generates criminal and statutory procedure drafts if matching template found."""
    court = extras.get("court_name") or ("माननीय न्यायालय" if is_hindi else "[Court of Sessions / High Court]")

    if 'cheque' in clean_id:
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

    elif 'anticipatory' not in clean_id and 'bail' in clean_id:
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

    elif 'anticipatory' in clean_id:
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

    elif 'maintenance' in clean_id:
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

    elif 'fir' in clean_id or ('complaint' in clean_id and 'consumer' not in clean_id):
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

    return None
