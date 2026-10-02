"""
rag_offline_fallbacks.py
========================
Provides graceful offline statutory concordance fallback when Groq API is unavailable or rate-limited.
"""

from bns_concordance import diagnose_situation
from prompts import LEGAL_DISCLAIMER_EN, LEGAL_DISCLAIMER_HI

def generate_offline_concordance_fallback(
    question: str,
    user_role: str,
    reason: str,
    language: str = "English"
) -> str:
    is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
    q_lower = question.lower()
    diagnosis = diagnose_situation(question, user_role=user_role)
    matched = diagnosis.get("matched_crimes", [])

    # Special handling for Cheque Bounce in offline mode
    if any(k in q_lower for k in ["cheque bounce", "check bounce", "138", "dishonour of cheque", "cheque return"]):
        if is_hindi:
            return f"""**सूचना**: {reason}

### सीधा उत्तर (Direct Answer)
चेक बाउंस का मामला परक्राम्य लिखत अधिनियम, 1881 (Negotiable Instruments Act, 1881) की धारा 138 के तहत एक संज्ञेय, दंडात्मक अपराध है। यदि कोई चेक खाते में अपर्याप्त धनराशि या अन्य कारणों से बाउंस हो जाता है, तो बैंक से मीमो मिलने के 30 दिनों के भीतर कानूनी मांग नोटिस भेजना अनिवार्य है।

### कानून क्या कहता है (What the Law Says)
- **शासी संविधि**: परक्राम्य लिखत अधिनियम, 1881 (NI Act) की धारा 138
- **सजा**: अधिकतम 2 वर्ष का कारावास, या चेक राशि का दोगुना तक जुर्माना, या दोनों।
- **अपराध की प्रकृति**: गैर-संज्ञेय (पुलिस सीधे FIR नहीं करती, सीधे मजिस्ट्रेट कोर्ट में परिवाद दाखिल होता है), जमानती और शमनीय (Compoundable)।
- *नोट*: यह BNS या IPC का मामला नहीं है, जब तक कि शुरुआत से ही चेक देकर धोखा देने की नीयत साबित न हो (BNS 318(4) / IPC 420)।

### प्रक्रिया / आगे क्या होगा (Procedure / What Happens Next)
1. **चरण 1**: बैंक से 'चेक रिटर्न मेमो' प्राप्त करें।
2. **चरण 2**: मेमो मिलने के 30 दिनों के भीतर देनदार (चेक जारीकर्ता) को 15 दिनों का वैधानिक लीगल नोटिस प्रेषित करें।
3. **चरण 3**: नोटिस प्राप्त होने के 15 दिनों तक भुगतान की प्रतीक्षा करें (यह 15 दिन की वैधानिक छूट अवधि है)।
4. **चरण 4**: यदि 15 दिनों में भुगतान नहीं होता है, तो अगले 30 दिनों के भीतर धारा 142 NI Act के तहत सक्षम न्यायिक मजिस्ट्रेट (प्रथम श्रेणी) / मेट्रोपॉलिटन मजिस्ट्रेट के समक्ष आपराधिक परिवाद दर्ज करें।

### महत्वपूर्ण समय-सीमाएं (Important Deadlines)
- चेक की वैधता: जारी तिथि से 3 महीने।
- बैंक मेमो प्राप्ति के बाद लीगल नोटिस भेजने की समय-सीमा: 30 दिन।
- चेक जारीकर्ता को भुगतान हेतु समय: नोटिस प्राप्ति से 15 दिन।
- न्यायालय में परिवाद दाखिल करने की समय-सीमा: 15 दिन की अवधि समाप्त होने के बाद 30 दिनों के भीतर।

### आवश्यक दस्तावेज / साक्ष्य (Required Documents / Evidence)
- मूल चेक (Original Cheque)
- बैंक का मूल चेक रिटर्न मेमो (Bank Return Memo)
- लीगल डिमांड नोटिस की प्रति
- रजिस्टर्ड पोस्ट / स्पीड पोस्ट की रसीद व ट्रैकिंग डिलीवरी रिपोर्ट (Proof of Dispatch & Delivery)
- संबंधित बिल, इनवॉइस, या लेन-देन का प्रमाण (वैध कानूनी देनदारी साबित करने हेतु)

### व्यावहारिक अगले कदम (Practical Next Steps)
- किसी योग्य अधिवक्ता के माध्यम से 30 दिन पूरे होने से पहले धारा 138 का औपचारिक मांग नोटिस रजिस्टर्ड डाक से भेजें।
- DhaaraAI Drafting Studio से 'Cheque Bounce Notice' का ड्राफ्ट प्रारूप तैयार करें।

### स्रोत (Sources)
- परक्राम्य लिखत अधिनियम, 1881 (धारा 138, 141, 142)
- सर्वोच्च न्यायालय दिशानिर्देश (दामोदर एस. प्रभु बनाम सैयद बाबालाल एच.)

*{LEGAL_DISCLAIMER_HI}*"""
        else:
            return f"""**Notice**: {reason}

### Direct Answer
Cheque dishonour is a statutory criminal offense strictly governed under Section 138 of the Negotiable Instruments Act, 1881 (not BNS or IPC). When a cheque is returned unpaid by the bank due to insufficiency of funds or stop-payment, the payee must issue a formal statutory demand notice within 30 days of receiving the bank memo to initiate criminal prosecution.

### What the Law Says
- **Governing Statute**: Section 138, Negotiable Instruments Act, 1881 (Act No. 26 of 1881).
- **Statutory Elements**: The cheque must have been issued towards discharge of an enforceable legal debt or liability, presented within 3 months, dishonoured by the bank, and unpaid despite a statutory demand notice.
- **Punishment**: Imprisonment for a term extending up to 2 years, or fine up to twice the amount of the cheque, or both.
- **Classification**: Non-cognizable (police do not register an FIR; proceedings are initiated via a private complaint before the Magistrate), bailable, and compoundable.
- *Critical Distinction*: Do not treat this as BNS 318(4) or IPC 420 (cheating) unless dishonest intention existed at the inception of the transaction.

### Procedure / What Happens Next
1. **Step 1 — Bank Return Memo**: Obtain the official cheque return memo from the bank stating reason for dishonour (e.g., "Funds Insufficient").
2. **Step 2 — Statutory Demand Notice**: Issue a written legal demand notice through Registered Post A.D. or Speed Post within 30 days of receiving the memo, demanding payment within 15 days of notice receipt.
3. **Step 3 — 15-Day Cure Period**: The drawer has a mandatory statutory cure period of 15 days upon receiving the notice to make the payment.
4. **Step 4 — Criminal Complaint Filing**: If payment is not made within the 15 days, cause of action arises on the 16th day. File a criminal complaint under Section 142 NI Act before the Judicial Magistrate First Class (JMFC) or Metropolitan Magistrate within 30 days thereafter.
5. **Step 5 — Pre-Summoning Evidence**: The complainant gives evidence under Section 145 NI Act on affidavit, following which summons are issued to the accused.

### Important Deadlines & Limitation
- **Cheque Validity**: 3 months from the date of issue.
- **Notice Dispatch Deadline**: Within 30 days from receipt of the bank return memo.
- **Payment Window for Drawer**: 15 days from receipt of legal notice.
- **Court Filing Window**: Within 30 days from the expiry of the 15-day payment period (Section 142(1)(b) NI Act).

### Required Documents / Evidence
- Original dishonoured cheque.
- Original bank return memo.
- Office copy of the statutory legal demand notice.
- Postal receipts and online delivery tracking report (consignment tracking) establishing service of notice.
- Supporting documents proving valid legal debt (invoice, contract, ledger, loan acknowledgment, or promissory note).

### Practical Next Steps
- Preserve the physical cheque and memo without altering or defacing them.
- Immediately engage an advocate or utilize DhaaraAI Drafting Studio to issue the statutory 15-day demand notice before the 30-day deadline lapses.
- Simultaneously explore filing a Summary Suit for civil recovery under Order 37 of the Code of Civil Procedure (CPC).

### Sources
- Negotiable Instruments Act, 1881 (Sections 138, 139, 141, 142, 145).
- Supreme Court Decisions: *Damodar S. Prabhu v. Sayed Babalal H.* & *MSR Leathers v. S. Palaniappan*.

*{LEGAL_DISCLAIMER_EN}*"""

    # General / Criminal Concordance Fallback
    if is_hindi:
        lines = [
            f"**सूचना**: {reason}",
            "",
            "### सीधा उत्तर (Direct Answer)",
            "आपके द्वारा प्रस्तुत कानूनी स्थिति का प्राथमिक विश्लेषण नीचे दिया गया है। संज्ञेय अपराधों में पुलिस धारा 173 BNSS (Zero FIR) के तहत कार्रवाई करने हेतु बाध्य है।",
            "",
            "### कानून क्या कहता है (What the Law Says)",
        ]
        if matched:
            for itm in matched:
                lines.extend([
                    f"#### {itm.get('offense_hi', itm.get('offense_en', 'अपराध'))}",
                    f"- **लागू कानून (BNS 2023)**: धारा {itm.get('bns_section', '?')} ({itm.get('bns_title', 'BNS')})",
                    f"- **पुराना संदर्भ (IPC 1860)**: धारा {itm.get('ipc_section', '?')} ({itm.get('ipc_title', 'IPC')})",
                    f"- **प्रकृति व वर्गीकरण**: {itm.get('nature', '?')} | {itm.get('bailable', '?')} | न्यायालय: {itm.get('triable_by', '?')}",
                    f"- **सजा**: {itm.get('punishment', '?')}",
                    f"- **प्रक्रियात्मक नियम (BNSS)**: {itm.get('bnss_procedure', 'विहित कानूनी प्रक्रिया')}",
                    f"- **तुरंत कार्रवाई**: {itm.get('victim_guidance', '') if user_role == 'victim' else itm.get('accused_guidance', '')}",
                    ""
                ])
        else:
            lines.extend([
                "- भारतीय न्याय संहिता (BNS 2023) तथा भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) 1 जुलाई 2024 से प्रभावी हैं।",
                "- 7 वर्ष तक की सजा वाले अपराधों में BNSS की धारा 35(3) (पूर्व धारा 41A CrPC) के तहत गिरफ्तारी से पहले लिखित नोटिस देना अनिवार्य है।",
                ""
            ])

        lines.extend([
            "### प्रक्रिया / आगे क्या होगा (Procedure / What Happens Next)",
            "1. संज्ञेय अपराध की स्थिति में निकटतम थाने में धारा 173 BNSS के तहत FIR दर्ज कराएं (या Zero FIR दर्ज कराएं)।",
            "2. यदि पुलिस FIR दर्ज करने से मना करे, तो धारा 173(4) BNSS के तहत पुलिस अधीक्षक (SP) को डाक द्वारा शिकायत भेजें।",
            "3. यदि फिर भी कार्रवाई न हो, तो धारा 175(3) BNSS (पूर्व धारा 156(3) CrPC) के तहत न्यायिक मजिस्ट्रेट के समक्ष आवेदन करें।",
            "",
            "### महत्वपूर्ण समय-सीमाएं एवं दस्तावेज (Deadlines & Documents)",
            "- साइबर वित्तीय फ्रॉड में 24 घंटे के भीतर 1930 हेल्पलाइन या cybercrime.gov.in पर रिपोर्ट करें।",
            "- डिजिटल साक्ष्य (व्हाट्सएप चैट, कॉल रिकॉर्डिंग) के लिए BSA 2023 की धारा 63 का प्रमाणपत्र संलग्न करें।",
            "",
            "### व्यावहारिक अगले कदम (Practical Next Steps)",
            "- नजदीकी पुलिस स्टेशन या सक्षम न्यायालय से संपर्क करें।",
            "- आपातकालीन हेल्पलाइन: 112 (आपातकाल), 1930 (साइबर अपराध), 1516 (नालसा मुफ्त कानूनी सहायता)।",
            "",
            "### स्रोत (Sources)",
            "- भारतीय न्याय संहिता, 2023 (BNS)",
            "- भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS)",
            "- भारतीय साक्ष्य अधिनियम, 2023 (BSA)",
            "",
            f"*{LEGAL_DISCLAIMER_HI}*"
        ])
    else:
        lines = [
            f"**Notice**: {reason}",
            "",
            "### Direct Answer",
            "Based on the facts provided, the legal framework applicable under modern Indian statutory law is detailed below. For cognizable grievances, procedural safeguards mandate immediate reporting under BNSS 2023.",
            "",
            "### What the Law Says",
        ]
        if matched:
            for itm in matched:
                lines.extend([
                    f"#### {itm.get('offense_en', 'Legal Matter')}",
                    f"- **Active Law (BNS 2023)**: Section {itm.get('bns_section', '?')} ({itm.get('bns_title', 'BNS')})",
                    f"- **Legacy Law (IPC 1860)**: Section {itm.get('ipc_section', '?')} ({itm.get('ipc_title', 'IPC')})",
                    f"- **Classification**: {itm.get('nature', '?')} | {itm.get('bailable', '?')} | Triable by: {itm.get('triable_by', '?')}",
                    f"- **Prescribed Punishment**: {itm.get('punishment', '?')}",
                    f"- **BNSS Procedure**: {itm.get('bnss_procedure', 'Applicable procedural safeguards under BNSS 2023')}",
                    f"- **Immediate Action**: {itm.get('victim_guidance', '') if user_role == 'victim' else itm.get('accused_guidance', '')}",
                    ""
                ])
        else:
            lines.extend([
                "- Criminal law in India is governed by Bharatiya Nyaya Sanhita, 2023 (BNS) and Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) for offenses committed on or after 1 July 2024.",
                "- Under Section 35(3) BNSS (formerly 41A CrPC), for offenses punishable up to 7 years imprisonment, police must issue a Notice of Appearance prior to any arrest.",
                ""
            ])

        lines.extend([
            "### Procedure / What Happens Next",
            "1. **Filing Complaint**: For cognizable offenses, lodge an FIR under Section 173 BNSS (or Zero FIR at any police station).",
            "2. **Escalation upon Refusal**: If the police refuse to register the FIR, send a written complaint by post to the Superintendent of Police under Section 173(4) BNSS.",
            "3. **Magistrate Route**: If the SP fails to direct an investigation, file an application before the Judicial Magistrate under Section 175(3) BNSS accompanied by an affidavit.",
            "",
            "### Required Documents & Evidence",
            "- Written complaint with date, time, location, and chronological facts.",
            "- Proof of financial transaction / bank statement / UTR numbers.",
            "- Electronic records (WhatsApp chats, call recordings, emails) with Certificate under Section 63 BSA 2023.",
            "",
            "### Practical Next Steps",
            "- Preserve all physical and digital evidence in their original devices.",
            "- Consult an advocate or reach out to government helplines: 112 (Police), 1930 (Cyber Fraud), 1516 (NALSA Free Legal Aid).",
            "",
            "### Sources",
            "- Bharatiya Nyaya Sanhita, 2023 (BNS)",
            "- Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
            "- Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
            "",
            f"*{LEGAL_DISCLAIMER_EN}*"
        ])

    return "\n".join(lines)
