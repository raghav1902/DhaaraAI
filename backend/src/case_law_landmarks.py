"""
case_law_landmarks.py
=====================
Curated Landmark Supreme Court Judgments Layer & Statutory Cross-Links.
Provides high-value verified precedents across 12 legal domains and maps them
directly to new statutory provisions (BNS 2023, BNSS 2023, BSA 2023, NI Act, IT Act).
"""

from typing import List, Dict, Any, Optional

# 12 Landmark Categories with verified Supreme Court precedents from the corpus
LANDMARK_JUDGMENTS_REGISTRY: List[Dict[str, Any]] = [
    {
        "category": "Constitutional Law",
        "case_name": "Chiranjit Lal Chowdhuri v. The Union of India and Others",
        "citation": "[1950] 1 S.C.R. 869 | 1950 INSC 36",
        "court": "Supreme Court of India",
        "judgment_date": "1950",
        "bench": "Harilal Kania C.J., Fazl Ali, Patanjali Sastri, Mukherjea, S.R. Das JJ.",
        "articles": "Article 14, Article 19, Article 31, Article 32",
        "acts": "Constitution of India",
        "sections": "",
        "key_ratio": "Article 32 provides a guaranteed right to move the Supreme Court by appropriate proceedings for enforcement of Fundamental Rights. Equality before the law under Article 14 permits reasonable classification based on intelligible differentia.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "1950_1_869_940_EN"
    },
    {
        "category": "Fundamental Rights",
        "case_name": "Justice K.S. Puttaswamy (Retd.) v. Union of India",
        "citation": "[2017] 10 S.C.R. 1 | 2017 INSC 752",
        "court": "Supreme Court of India",
        "judgment_date": "24-08-2017",
        "bench": "9-Judge Constitutional Bench (J.S. Khehar C.J., J. Chelameswar, S.A. Bobde, D.Y. Chandrachud JJ.)",
        "articles": "Article 21, Article 14, Article 19",
        "acts": "Constitution of India, Information Technology Act",
        "sections": "",
        "key_ratio": "The Right to Privacy is an intrinsic and fundamental part of the Right to Life and Personal Liberty guaranteed under Article 21 and the freedoms guaranteed by Part III of the Constitution.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2017_10_1_EN"
    },
    {
        "category": "Bail",
        "case_name": "Arnesh Kumar v. State of Bihar",
        "citation": "[2014] 8 S.C.R. 128 | 2014 INSC 492",
        "court": "Supreme Court of India",
        "judgment_date": "02-07-2014",
        "bench": "Chandramauli Kr. Prasad, Pinaki Chandra Ghose JJ.",
        "articles": "Article 21, Article 22",
        "acts": "Code of Criminal Procedure, Bharatiya Nagarik Suraksha Sanhita, Indian Penal Code",
        "sections": "Section 41A CrPC, Section 35(3) BNSS, Section 498A IPC",
        "key_ratio": "Arrest brings humiliation, curtails freedom and casts scars forever. For offenses punishable with up to 7 years imprisonment, police cannot arrest casually. Serving Section 41A (now BNSS Section 35(3)) notice is mandatory.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2014_8_128_EN"
    },
    {
        "category": "Bail",
        "case_name": "Satender Kumar Antil v. Central Bureau of Investigation",
        "citation": "[2022] 10 S.C.R. 351 | 2022 INSC 690",
        "court": "Supreme Court of India",
        "judgment_date": "11-07-2022",
        "bench": "Sanjay Kishan Kaul, M.M. Sundresh JJ.",
        "articles": "Article 21",
        "acts": "Code of Criminal Procedure, Bharatiya Nagarik Suraksha Sanhita",
        "sections": "Section 436, Section 437, Section 438, Section 439 CrPC, Section 479 BNSS",
        "key_ratio": "Bail is the rule, jail is the exception. Categorized offenses into Category A, B, C, D with clear directions for bail without custody where accused cooperated with probe. Undertrials who served half maximum sentence must be released under statutory bail.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2022_10_351_EN"
    },
    {
        "category": "Bail",
        "case_name": "Sushila Aggarwal and Others v. State (NCT of Delhi) and Another",
        "citation": "[2020] 1 S.C.R. 1 | 2020 INSC 106",
        "court": "Supreme Court of India",
        "judgment_date": "29-01-2020",
        "bench": "5-Judge Constitutional Bench (Arun Mishra, Indira Banerjee, Vineet Saran, M.R. Shah, S. Ravindra Bhat JJ.)",
        "articles": "Article 21",
        "acts": "Code of Criminal Procedure, Bharatiya Nagarik Suraksha Sanhita",
        "sections": "Section 438 CrPC, Section 482 BNSS",
        "key_ratio": "Anticipatory bail under Section 438 CrPC (now Section 482 BNSS) should not normally be subjected to a fixed time limit; protection granted can continue until the conclusion of the trial.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2020_1_1_EN"
    },
    {
        "category": "Cheque Bounce",
        "case_name": "Dashrath Rupsingh Rathod v. State of Maharashtra and Another",
        "citation": "[2014] 9 S.C.R. 1001 | 2014 INSC 559",
        "court": "Supreme Court of India",
        "judgment_date": "01-08-2014",
        "bench": "T.S. Thakur, Vikramajit Sen, C. Nagappan JJ.",
        "articles": "",
        "acts": "Negotiable Instruments Act, Code of Criminal Procedure",
        "sections": "Section 138, Section 142 NI Act",
        "key_ratio": "Territorial jurisdiction in Section 138 NI Act complaints is restricted to the place where the drawee bank is located and cheque is dishonoured (prompted subsequent parliamentary amendment establishing payee bank branch rule under Sec 142(2)).",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2014_9_1001_EN"
    },
    {
        "category": "Cheque Bounce",
        "case_name": "Bir Singh v. Mukesh Kumar",
        "citation": "[2019] 3 S.C.R. 297 | 2019 INSC 152",
        "court": "Supreme Court of India",
        "judgment_date": "06-02-2019",
        "bench": "R. Banumathi, Indira Banerjee JJ.",
        "articles": "",
        "acts": "Negotiable Instruments Act",
        "sections": "Section 138, Section 139 NI Act",
        "key_ratio": "Under Section 139 NI Act, a mandatory presumption of legally enforceable debt arises in favour of holder once execution of cheque is admitted. The burden shifts to the drawer to rebut presumption with cogent evidence.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2019_3_297_EN"
    },
    {
        "category": "Evidence",
        "case_name": "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal and Others",
        "citation": "[2020] 7 S.C.R. 1 | 2020 INSC 465",
        "court": "Supreme Court of India",
        "judgment_date": "14-07-2020",
        "bench": "R.F. Nariman, S. Ravindra Bhat, V. Ramasubramanian JJ.",
        "articles": "",
        "acts": "Indian Evidence Act, Bharatiya Sakshya Adhiniyam",
        "sections": "Section 65B Evidence Act, Section 61, Section 63 BSA",
        "key_ratio": "Certificate under Section 65B(4) is a condition precedent to the admissibility of secondary electronic records in evidence. Clarified that where device is not in possession of party, court summons must be issued to produce certificate.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2020_7_1_EN"
    },
    {
        "category": "Cyber Law",
        "case_name": "Shreya Singhal v. Union of India",
        "citation": "[2015] 5 S.C.R. 1 | 2015 INSC 244",
        "court": "Supreme Court of India",
        "judgment_date": "24-03-2015",
        "bench": "J. Chelameswar, Rohinton Fali Nariman JJ.",
        "articles": "Article 19(1)(a), Article 19(2)",
        "acts": "Information Technology Act, Constitution of India",
        "sections": "Section 66A, Section 79 IT Act",
        "key_ratio": "Section 66A of the Information Technology Act struck down in its entirety as unconstitutional and violative of free speech under Article 19(1)(a). Intermediate safe harbour clarified under Section 79.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2015_5_1_EN"
    },
    {
        "category": "Matrimonial / Family Law",
        "case_name": "Rajnesh v. Neha and Another",
        "citation": "[2020] 12 S.C.R. 1047 | 2020 INSC 629",
        "court": "Supreme Court of India",
        "judgment_date": "04-11-2020",
        "bench": "Indu Malhotra, R. Subhash Reddy JJ.",
        "articles": "Article 15(3), Article 21",
        "acts": "Code of Criminal Procedure, Protection of Women from Domestic Violence Act, Hindu Marriage Act",
        "sections": "Section 125 CrPC, Section 144 BNSS, Section 12 DV Act",
        "key_ratio": "Laid down comprehensive pan-India uniform guidelines for payment of maintenance in matrimonial disputes; mandated filing of comprehensive Affidavits of Assets and Liabilities by both spouses at initial stage.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2020_12_1047_EN"
    },
    {
        "category": "Consumer Law",
        "case_name": "Lucknow Development Authority v. M.K. Gupta",
        "citation": "[1994] 1 S.C.R. 61 | 1993 INSC 321",
        "court": "Supreme Court of India",
        "judgment_date": "05-11-1993",
        "bench": "R.M. Sahai, B.L. Hansaria JJ.",
        "articles": "",
        "acts": "Consumer Protection Act",
        "sections": "Section 2(1)(o), Section 14 Consumer Protection Act",
        "key_ratio": "Statutory authorities and housing boards are amenable to consumer jurisdiction for deficiency in service (e.g. failure to deliver allotted plots/houses on time). Public officers causing harassment to citizens can be held personally liable for damages.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "1994_1_61_EN"
    },
    {
        "category": "Contract Law",
        "case_name": "Satyabrata Ghose v. Mugneeram Bangur & Co. and Another",
        "citation": "[1954] 1 S.C.R. 310 | 1953 INSC 81",
        "court": "Supreme Court of India",
        "judgment_date": "16-11-1953",
        "bench": "B.K. Mukherjea, Vivian Bose, Ghulam Hasan JJ.",
        "articles": "",
        "acts": "Indian Contract Act",
        "sections": "Section 56 Indian Contract Act",
        "key_ratio": "Doctrine of frustration under Section 56 of the Contract Act applies when an untoward event or change of circumstances totally upsets the very foundation upon which the parties agreed, rendering performance impossible or unlawful.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "1954_1_310_EN"
    },
    {
        "category": "Criminal Law",
        "case_name": "Lalita Kumari v. Govt. of U.P. and Others",
        "citation": "[2013] 14 S.C.R. 713 | 2013 INSC 790",
        "court": "Supreme Court of India",
        "judgment_date": "12-11-2013",
        "bench": "5-Judge Constitutional Bench (P. Sathasivam C.J., B.S. Chauhan, Ranjana P. Desai, Ranjan Gogoi, S.A. Bobde JJ.)",
        "articles": "Article 21",
        "acts": "Code of Criminal Procedure, Bharatiya Nagarik Suraksha Sanhita",
        "sections": "Section 154 CrPC, Section 173 BNSS",
        "key_ratio": "Registration of FIR is mandatory under Section 154 CrPC (now BNSS 173) if information discloses commission of a cognizable offence. Police officer cannot conduct preliminary inquiry before lodging FIR in cognizable crimes.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2013_14_713_EN"
    },
    {
        "category": "Property Law",
        "case_name": "Suraj Lamp & Industries Pvt. Ltd. v. State of Haryana and Another",
        "citation": "[2011] 14 S.C.R. 848 | 2011 INSC 786",
        "court": "Supreme Court of India",
        "judgment_date": "11-10-2011",
        "bench": "R.V. Raveendran, A.K. Patnaik JJ.",
        "articles": "",
        "acts": "Transfer of Property Act, Registration Act",
        "sections": "Section 54 T.P. Act, Section 17 Registration Act",
        "key_ratio": "Immovable property can be legally transferred or conveyed only by a registered deed of conveyance. Power of Attorney (GPA) sales, Agreement to Sell, or Will transfers do not convey any title or ownership rights.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2011_14_848_EN"
    },
    {
        "category": "Administrative Law",
        "case_name": "A.K. Kraipak and Others v. Union of India and Others",
        "citation": "[1970] 1 S.C.R. 457 | 1969 INSC 124",
        "court": "Supreme Court of India",
        "judgment_date": "29-04-1969",
        "bench": "M. Hidayatullah C.J., J.M. Shelat, V. Bhargava, K.S. Hegde, A.N. Grover JJ.",
        "articles": "Article 14, Article 16",
        "acts": "Constitution of India",
        "sections": "",
        "key_ratio": "The rules of natural justice apply to administrative inquiries as well as quasi-judicial proceedings. A person who is a candidate for selection cannot sit on the selection board; real likelihood of bias vitiates selection.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "1970_1_457_EN"
    },
    {
        "category": "Criminal Law",
        "case_name": "D.K. Basu v. State of West Bengal",
        "citation": "[1997] 1 S.C.R. 249 | (1997) 1 SCC 416",
        "court": "Supreme Court of India",
        "judgment_date": "18-12-1996",
        "bench": "Kuldip Singh, A.S. Anand JJ.",
        "articles": "Article 21, Article 22",
        "acts": "Code of Criminal Procedure, Bharatiya Nagarik Suraksha Sanhita, Constitution of India",
        "sections": "Section 41B, 41D, 50, 50A CrPC, Section 36, 37, 47 BNSS",
        "key_ratio": "Custodial violence, torture, and deaths in custody violate Article 21. Formulated 11 mandatory arrest safeguards: preparation of arrest memo, right of arrested person to inform a friend/relative, right to meet advocate during interrogation, and mandatory medical checkup every 48 hours.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "1997_1_249_EN"
    },
    {
        "category": "Matrimonial / Family Law",
        "case_name": "Rajnesh v. Neha and Another",
        "citation": "[2020] 13 S.C.R. 883 | 2020 INSC 629",
        "court": "Supreme Court of India",
        "judgment_date": "04-11-2020",
        "bench": "Indu Malhotra, R. Subhash Reddy JJ.",
        "articles": "Article 21",
        "acts": "Code of Criminal Procedure, Bharatiya Nagarik Suraksha Sanhita, Hindu Marriage Act, Protection of Women from Domestic Violence Act",
        "sections": "Section 125 CrPC, Section 144 BNSS, Section 24 HMA, Section 12 DV Act",
        "key_ratio": "Laid down comprehensive national uniform guidelines for determination of maintenance in matrimonial disputes. Made it mandatory for both parties to file a detailed Affidavit of Assets and Liabilities. Maintenance is payable from the date of filing of the application.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2020_13_883_EN"
    },
    {
        "category": "Property Law",
        "case_name": "Ravinder Kaur Grewal and Others v. Manjit Kaur and Others",
        "citation": "[2019] 8 S.C.R. 329 | 2019 INSC 885",
        "court": "Supreme Court of India",
        "judgment_date": "07-08-2019",
        "bench": "Arun Mishra, S. Abdul Nazeer, M.R. Shah JJ.",
        "articles": "",
        "acts": "Limitation Act, Specific Relief Act, Transfer of Property Act",
        "sections": "Section 27, Article 64, Article 65 Limitation Act",
        "key_ratio": "Adverse possession can be used as a sword by the plaintiff, not merely as a shield by a defendant. A person who has perfected title through continuous, open, and hostile possession for 12 years can sue to protect possession or seek declaration of ownership.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "2019_8_329_EN"
    },
    {
        "category": "Consumer Law",
        "case_name": "Lucknow Development Authority v. M.K. Gupta",
        "citation": "[1993] Supp. 3 S.C.R. 615 | 1993 INSC 485",
        "court": "Supreme Court of India",
        "judgment_date": "05-11-1993",
        "bench": "R.M. Sahai, B.L. Hansaria JJ.",
        "articles": "",
        "acts": "Consumer Protection Act",
        "sections": "Section 2(1)(o), Section 14 Consumer Protection Act",
        "key_ratio": "Housing construction and real estate services by statutory development authorities or private builders constitute a 'service' under the Consumer Protection Act. Public authorities are liable for deficiency in service, administrative delays, and harassment of consumers.",
        "source_url": "https://digiscr.sci.gov.in/",
        "cnr": "1993_3_615_EN"
    }
]

# Statutory Provision -> Supreme Court Landmark Judgments cross-linkage
STATUTE_TO_PRECEDENT_MAP: Dict[str, List[Dict[str, str]]] = {
    # BNS 318(4) & IPC 420 (Cheating & Fraud)
    "bns_318_4": [
        {"case_name": "Vesa Holdings P. Ltd. v. State of Kerala", "citation": "[2015] 8 S.C.R. 320", "principle": "Fraudulent or dishonest intention at the inception of the transaction is indispensable for offense of cheating."},
        {"case_name": "Prof. R.K. Vijayasarathy v. Sudha Seetharam", "citation": "[2019] 3 S.C.R. 696", "principle": "Breach of contract without dishonest intention from the very beginning does not amount to cheating under Sec 420 (now BNS 318(4))."}
    ],
    # BNS 316 & IPC 406 (Criminal Breach of Trust)
    "bns_316": [
        {"case_name": "Dalip Kaur v. Jagnar Singh", "citation": "[2009] 11 S.C.R. 732", "principle": "Dishonest misappropriation must be accompanied by fraudulent intention to constitute criminal breach of trust."}
    ],
    # BNS 106 & IPC 304A (Hit and Run / Death by Negligence)
    "bns_106": [
        {"case_name": "State of Arunachal Pradesh v. Ramchandra Rabidas", "citation": "[2019] 13 S.C.R. 518", "principle": "Motor accident causing death warrants prosecution under Penal Code negligence independently of Motor Vehicles Act penalties."}
    ],
    # BNS 85/86 & IPC 498A (Cruelty by Husband/Relatives)
    "bns_85": [
        {"case_name": "Arnesh Kumar v. State of Bihar", "citation": "[2014] 8 S.C.R. 128", "principle": "Mandatory notice under Sec 35(3) BNSS required before arrest; mechanical arrest of relatives prohibited."},
        {"case_name": "Kahkashan Kausar v. State of Bihar", "citation": "[2020] 4 S.C.R. 856", "principle": "General and omnibus allegations against in-laws without specific overt acts cannot be sustained under 498A."}
    ],
    # BNSS 35 & CrPC 41A (Notice of Appearance / Arrest Safeguards)
    "bnss_35": [
        {"case_name": "Arnesh Kumar v. State of Bihar", "citation": "[2014] 8 S.C.R. 128", "principle": "Notice to appear is mandatory for offenses punishable up to 7 years. Arrest without reasons in writing is actionable contempt."},
        {"case_name": "D.K. Basu v. State of West Bengal", "citation": "[1997] 1 S.C.R. 249", "principle": "Mandatory arrest memo, informing family member, right to consult advocate, and regular medical checkup."}
    ],
    # BNSS 173 & CrPC 154 (Mandatory FIR & Zero FIR)
    "bnss_173": [
        {"case_name": "Lalita Kumari v. Govt. of U.P.", "citation": "[2013] 14 S.C.R. 713", "principle": "Registration of FIR is mandatory if information discloses commission of a cognizable offence."}
    ],
    # BNSS 144 & CrPC 125 (Maintenance for Wife, Children & Parents)
    "bnss_144": [
        {"case_name": "Rajnesh v. Neha", "citation": "[2020] 13 S.C.R. 883", "principle": "Mandatory filing of Affidavit of Assets and Liabilities; maintenance payable from date of application."}
    ],
    # BNSS 482 & CrPC 438 (Anticipatory Bail)
    "bnss_482": [
        {"case_name": "Sushila Aggarwal v. State (NCT of Delhi)", "citation": "[2020] 1 S.C.R. 1", "principle": "Anticipatory bail should not be restricted to a limited time period; can continue till conclusion of trial."},
        {"case_name": "Satender Kumar Antil v. CBI", "citation": "[2022] 10 S.C.R. 351", "principle": "Bail is the rule, jail is the exception. Guidelines for non-custodial bail where probe was cooperated with."},
        {"case_name": "Gurbaksh Singh Sibbia v. State of Punjab", "citation": "[1980] 3 S.C.R. 383", "principle": "Anticipatory bail under Section 438 is a device to secure personal liberty guaranteed by Article 21."}
    ],
    # BSA 61/63 & Evidence Act 65B (Electronic Evidence)
    "bsa_63": [
        {"case_name": "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal", "citation": "[2020] 7 S.C.R. 1", "principle": "Section 63 BSA certificate is mandatory for secondary electronic records (CCTV, WhatsApp, call recordings)."}
    ],
    # NI Act 138 (Cheque Bounce)
    "ni_act_138": [
        {"case_name": "Bir Singh v. Mukesh Kumar", "citation": "[2019] 3 S.C.R. 297", "principle": "Presumption under Sec 139 in favour of cheque holder is mandatory unless rebutted with evidence by drawer."},
        {"case_name": "Dashrath Rupsingh Rathod v. State of Maharashtra", "citation": "[2014] 9 S.C.R. 1001", "principle": "Governs statutory notice requirements and jurisdiction for dishonoured cheques."}
    ],
    # IT Act 66C/66D & Privacy (Cybercrime & Digital Rights)
    "it_act": [
        {"case_name": "Shreya Singhal v. Union of India", "citation": "[2015] 5 S.C.R. 1", "principle": "Digital speech safeguards under Article 19(1)(a) and intermediary liability guidelines."},
        {"case_name": "Justice K.S. Puttaswamy v. Union of India", "citation": "[2017] 10 S.C.R. 1", "principle": "Informational privacy and data autonomy form part of the fundamental right to life."}
    ],
    # Article 21 (Right to Life & Personal Liberty)
    "article_21": [
        {"case_name": "Justice K.S. Puttaswamy v. Union of India", "citation": "[2017] 10 S.C.R. 1", "principle": "Right to privacy is an intrinsic part of the right to life and liberty under Article 21."},
        {"case_name": "Maneka Gandhi v. Union of India", "citation": "[1978] 2 S.C.R. 621", "principle": "Procedure depriving personal liberty must be just, fair and reasonable, not arbitrary or fanciful."},
        {"case_name": "D.K. Basu v. State of West Bengal", "citation": "[1997] 1 S.C.R. 249", "principle": "Protection against custodial violence and torture as basic human rights under Article 21."}
    ],
    # Property Law & Adverse Possession
    "property_law": [
        {"case_name": "Suraj Lamp & Industries v. State of Haryana", "citation": "[2011] 14 S.C.R. 848", "principle": "GPA sales and agreement to sell do not convey title; registered deed of conveyance is mandatory."},
        {"case_name": "Ravinder Kaur Grewal v. Manjit Kaur", "citation": "[2019] 8 S.C.R. 329", "principle": "Adverse possession can be used affirmatively by plaintiff to protect or declare ownership after 12 years."}
    ],
    # Consumer Protection
    "consumer_law": [
        {"case_name": "Lucknow Development Authority v. M.K. Gupta", "citation": "[1993] Supp. 3 S.C.R. 615", "principle": "Housing construction is a consumer service; builders and development authorities are liable for delayed possession."}
    ]
}


def get_landmark_categories() -> List[str]:
    """Returns the list of 12 supported legal categories."""
    cats = []
    for item in LANDMARK_JUDGMENTS_REGISTRY:
        if item["category"] not in cats:
            cats.append(item["category"])
    return cats


def get_landmark_cases_by_category(category: str) -> List[Dict[str, Any]]:
    """Returns landmark judgments belonging to a specific category."""
    cat_lower = category.lower().strip()
    return [
        item for item in LANDMARK_JUDGMENTS_REGISTRY
        if cat_lower == "all" or cat_lower in item["category"].lower()
    ]


def get_precedents_for_statute(statute_key: str) -> List[Dict[str, str]]:
    """Returns matching Supreme Court precedents for a given statutory key."""
    clean_k = statute_key.lower().replace(" ", "_").replace("(", "_").replace(")", "").replace(".", "")
    for k, v in STATUTE_TO_PRECEDENT_MAP.items():
        if k in clean_k or clean_k in k:
            return v
    return []
