import html2pdf from 'html2pdf.js';

export const getPresetData = (presetKey, isHindi) => {
  if (presetKey === 'cyber') {
    return {
      documentType: 'FIR Application',
      incidentCategory: 'Cyber Fraud',
      complainant: {
        name: isHindi ? 'रमेश कुमार' : 'Ramesh Kumar',
        father_name: isHindi ? 'श्री सुरेश कुमार' : 'Shri Suresh Kumar',
        phone: '9876543210',
        address: isHindi ? 'मकान नंबर 45, विकास नगर, नई दिल्ली' : 'H.No 45, Vikas Nagar, New Delhi - 110059',
        police_station: isHindi ? 'साइबर क्राइम पुलिस स्टेशन, द्वारका' : 'Cyber Crime Police Station, Dwarka'
      },
      isAccusedUnknown: true,
      accused: {
        name: isHindi ? 'अज्ञात साइबर ठग (मो. 9123456780)' : 'Unknown Cyber Fraudster (Phone: +91 9123456780)',
        address: isHindi ? 'फर्जी टेलीग्राम हैंडल @QuickEarn24 एवं बैंक खाता संख्या 9988776655' : 'Telegram handle @QuickEarn24 and Beneficiary A/c 9988776655'
      },
      incidentDatetime: '21-09-2026, 02:30 PM',
      incidentLocation: isHindi ? 'ऑनलाइन (इंटरनेट बैंकिंग / यूपीआई)' : 'Online (UPI & Net Banking)',
      facts: isHindi
        ? 'आरोपी ने पार्ट-टाइम रिव्यू जॉब का झांसा देकर टेलीग्राम पर संपर्क किया। आरोपी ने एक फर्जी लिंक भेजकर मेरे बैंक खाते से 3 अलग-अलग किश्तों में कुल ₹75,000 धोखे से ट्रांसफर करवा लिए।'
        : 'The accused contacted me via WhatsApp offering a work-from-home review task. After building trust, they shared a fraudulent payment gateway link and induced me to transfer Rs. 75,000 across 3 UPI transactions under false promises.',
      selectedEvidences: ['bank_slip', 'chat_history'],
      customEvidence: isHindi ? 'साइबर हेल्पलाइन 1930 शिकायत संख्या #CYB2026/88902' : 'Cyber Helpline 1930 Acknowledgment #CYB2026/88902',
      reliefSought: isHindi
        ? 'धारा 173 BNSS व धारा 318(4) BNS के तहत प्राथमिकी दर्ज कर आरोपी के बैंक खातों को तुरंत फ्रीज करने व राशि वापस दिलाने की कृपा करें।'
        : 'Registration of FIR under Section 173 BNSS and Section 318(4) BNS, freezing of the recipient accounts, and restitution of Rs. 75,000.'
    };
  } else if (presetKey === 'cheque') {
    return {
      documentType: 'Legal Demand Notice',
      incidentCategory: 'Cheque Bounce',
      complainant: {
        name: isHindi ? 'अमित अग्रवाल' : 'Amit Agarwal',
        father_name: isHindi ? 'श्री के.एल. अग्रवाल' : 'Shri K.L. Agarwal',
        phone: '9811223344',
        address: isHindi ? 'बी-12, सिविल लाइन्स, जयपुर, राजस्थान' : 'B-12, Civil Lines, Jaipur, Rajasthan - 302006',
        police_station: isHindi ? 'थाना सिविल लाइन्स' : 'Civil Lines Police Jurisdiction'
      },
      isAccusedUnknown: false,
      accused: {
        name: isHindi ? 'विकास मेहता (निदेशक, मेसर्स सनराइज ट्रेडर्स)' : 'Vikas Mehta (Director, M/s Sunrise Traders)',
        address: isHindi ? 'प्लॉट 88, एमआई रोड, जयपुर' : 'Plot 88, MI Road, Jaipur - 302001'
      },
      incidentDatetime: '18-09-2026',
      incidentLocation: isHindi ? 'एचडीएफसी बैंक, एमआई रोड शाखा' : 'HDFC Bank, MI Road Branch, Jaipur',
      facts: isHindi
        ? 'विपक्षी ने व्यावसायिक देनदारी चुकता करने हेतु चेक क्रमांक 458921 राशि ₹2,50,000/- दिनांकित 15-09-2026 जारी किया था, जो बैंक में प्रस्तुत करने पर "अपर्याप्त कोष (Funds Insufficient)" के कारण अनादरित (बाउंस) हो गया।'
        : 'The accused issued Cheque No. 458921 dated 15-09-2026 for Rs. 2,50,000/- towards commercial debt, which was returned unpaid with the bank memo "Funds Insufficient" on 18-09-2026.',
      selectedEvidences: ['dishonour_memo', 'written_receipt'],
      customEvidence: isHindi ? 'बैंक अनादरण मेमो दिनांक 18-09-2026 व मूल बीजक संख्या #INV-1092' : 'Bank Memo dated 18-09-2026 and Original Invoice #INV-1092',
      reliefSought: isHindi
        ? '15 दिवस के भीतर ₹2,50,000/- मय 18% ब्याज अदा करें, अन्यथा पराक्राम्य लिखत अधिनियम की धारा 138 व बीएनएस की धारा 318 के तहत अदालत में अभियोजन चलाया जाएगा।'
        : 'Pay Rs. 2,50,000/- with 18% contractual interest within 15 days, failing which criminal proceedings under Section 138 of Negotiable Instruments Act and Section 318 BNS shall be instituted.'
    };
  } else if (presetKey === 'tenant') {
    return {
      documentType: 'Legal Demand Notice',
      incidentCategory: 'Tenant/Landlord Dispute',
      complainant: {
        name: isHindi ? 'सुनील शर्मा' : 'Sunil Sharma',
        father_name: isHindi ? 'श्री आर.पी. शर्मा' : 'Shri R.P. Sharma',
        phone: '9822334455',
        address: isHindi ? 'फ्लैट 302, पाम हाइट्स, अंधेरी वेस्ट, मुंबई' : 'Flat 302, Palm Heights, Andheri West, Mumbai - 400053',
        police_station: isHindi ? 'अंधेरी पुलिस स्टेशन' : 'Andheri Police Station'
      },
      isAccusedUnknown: false,
      accused: {
        name: isHindi ? 'राजीव मल्होत्रा (मकान मालिक)' : 'Rajeev Malhotra (Landlord)',
        address: isHindi ? 'कोठी 14, जुहू लेन, मुंबई' : 'Bungalow 14, Juhu Lane, Mumbai - 400049'
      },
      incidentDatetime: '15-09-2026',
      incidentLocation: isHindi ? 'किराया आवास, फ्लैट 302, अंधेरी वेस्ट' : 'Leased Premises, Flat 302, Andheri West, Mumbai',
      facts: isHindi
        ? 'किराया समझौता नियमानुसार 31 अगस्त 2026 को समाप्त होने व बिना किसी बकाए के शांतिपूर्ण कब्जा सौंपने के बावजूद मकान मालिक ने ₹1,20,000 की सुरक्षा जमा (Security Deposit) राशि अवैध रूप से रोक रखी है और लौटाने से मना कर रहा है।'
        : 'Despite peaceful handover of the leased premises on 31-08-2026 without any utility or rent dues, the landlord has unlawfully withheld and failed to refund the refundable security deposit of Rs. 1,20,000.',
      selectedEvidences: ['agreement_copy', 'bank_slip'],
      customEvidence: isHindi ? 'पंजीकृत किराया समझौता व बैंक जमा पावती' : 'Registered Lease Agreement & Deposit Transfer Receipts',
      reliefSought: isHindi
        ? 'सूचना प्राप्ति के 15 दिनों के भीतर ₹1,20,000/- मय 18% वार्षिक ब्याज वापस लौटाएं, अन्यथा मॉडल टेनेंसी एक्ट, दीवानी न्यायालय व बीएनएस के तहत मुकदमा किया जाएगा।'
        : 'Immediate refund of Rs. 1,20,000/- along with 18% p.a. interest within 15 days, failing which civil and criminal proceedings under Model Tenancy principles and BNS shall be initiated.'
    };
  }
  return null;
};

export const exportDraftToDoc = (documentType, draft) => {
  if (!draft) return;
  const docTitle = documentType === 'Legal Demand Notice' ? 'Legal_Demand_Notice' : 'Police_Complaint_FIR';
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${documentType}</title><style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;margin:1in;text-align:justify;}</style></head><body>`;
  const footer = "</body></html>";
  const content = header + `<h3 style="text-align:center;text-transform:uppercase;font-weight:bold;">${documentType}</h3><pre style="font-family:'Times New Roman',serif;font-size:12pt;white-space:pre-wrap;line-height:1.6;">${draft}</pre>` + footer;
  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${docTitle}_DhaaraAI.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportDraftToPdf = (documentType, draft, isHindi) => {
  if (!draft) return;
  const docTitle = documentType === 'Legal Demand Notice' ? 'Legal_Demand_Notice' : 'Police_Complaint_FIR';

  const element = document.createElement('div');
  element.style.padding = '20mm';
  element.style.fontFamily = '"Times New Roman", Times, serif';
  element.style.fontSize = '12pt';
  element.style.lineHeight = '1.6';
  element.style.textAlign = 'justify';
  element.style.color = '#000000';
  element.style.background = '#ffffff';

  const emblem = isHindi ? 'सत्यमेव जयते' : 'FORMAL LEGAL INSTRUMENT • BHARAT (INDIA)';
  const headerTitle = documentType === 'Legal Demand Notice'
    ? (isHindi ? 'विधिक मांग नोटिस' : 'STATUTORY LEGAL DEMAND NOTICE')
    : (isHindi ? 'प्रथम सूचना रिपोर्ट (FIR) हेतु औपचारिक शिकायत' : 'FORMAL POLICE COMPLAINT (UNDER SECTION 173 BNSS, 2023)');

  element.innerHTML = `
    <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:24px;">
      <div style="font-size:10pt;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">${emblem}</div>
      <h1 style="font-size:16pt;font-weight:bold;margin:6px 0 2px;text-transform:uppercase;">${headerTitle}</h1>
      <div style="font-size:9pt;">Formulated under the Bharatiya Nagarik Suraksha Sanhita, 2023 & BNS 2023</div>
    </div>
    <div style="white-space:pre-wrap;">${draft}</div>
  `;

  const opt = {
    margin: [12, 12, 12, 12],
    filename: `${docTitle}_DhaaraAI.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
};

export const saveDraftToVault = (documentType, complainantName, draft, isHindi) => {
  if (!draft) return;
  const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
  const newDraft = {
    id: Date.now().toString(),
    type: documentType,
    title: complainantName ? `${documentType} - ${complainantName}` : documentType,
    content: draft,
    date: new Date().toISOString()
  };
  drafts.push(newDraft);
  localStorage.setItem('dhaara_vault_drafts', JSON.stringify(drafts));
  alert(isHindi ? 'दस्तावेज़ सुरक्षित वॉल्ट में सहेजा गया!' : 'Document saved to Secure Vault!');
};
