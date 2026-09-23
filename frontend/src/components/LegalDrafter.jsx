import React, { useState } from 'react';
import axios from 'axios';
import { 
  FileText, Copy, Printer, Check, ArrowRight, ArrowLeft, 
  ShieldCheck, AlertCircle, RefreshCw, User, UserX, 
  Calendar, MapPin, Sparkles, Scale, CheckCircle2, RotateCcw,
  Download
} from 'lucide-react';

import { CATEGORIES, EVIDENCE_PRESETS } from './LegalDrafter/DrafterConstants';

export default function LegalDrafter({ language = 'English', onLanguageChange = () => {} }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  // Step management: 1 (Type & Category), 2 (Parties), 3 (Facts & Evidence), 4 (Review & Generate), 5 (Result)
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('FIR Application');
  const [incidentCategory, setIncidentCategory] = useState('Cyber Fraud');
  
  // Complainant & Accused
  const [complainant, setComplainant] = useState({
    name: '',
    father_name: '',
    phone: '',
    address: '',
    police_station: ''
  });

  const [isAccusedUnknown, setIsAccusedUnknown] = useState(false);
  const [accused, setAccused] = useState({
    name: '',
    address: ''
  });

  // Incident Details
  const [incidentDatetime, setIncidentDatetime] = useState('');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [facts, setFacts] = useState('');
  const [selectedEvidences, setSelectedEvidences] = useState([]);
  const [customEvidence, setCustomEvidence] = useState('');
  const [reliefSought, setReliefSought] = useState('');

  // Generated draft state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [draftError, setDraftError] = useState(null);

  // Quick Preset / Demo Loader
  const loadPreset = (presetKey) => {
    if (presetKey === 'cyber') {
      setDocumentType('FIR Application');
      setIncidentCategory('Cyber Fraud');
      setComplainant({
        name: isHindi ? 'रमेश कुमार' : 'Ramesh Kumar',
        father_name: isHindi ? 'श्री सुरेश कुमार' : 'Shri Suresh Kumar',
        phone: '9876543210',
        address: isHindi ? 'मकान नंबर 45, विकास नगर, नई दिल्ली' : 'H.No 45, Vikas Nagar, New Delhi - 110059',
        police_station: isHindi ? 'साइबर क्राइम पुलिस स्टेशन, द्वारका' : 'Cyber Crime Police Station, Dwarka'
      });
      setIsAccusedUnknown(true);
      setAccused({
        name: isHindi ? 'अज्ञात साइबर ठग (मो. 9123456780)' : 'Unknown Cyber Fraudster (Phone: +91 9123456780)',
        address: isHindi ? 'फर्जी टेलीग्राम हैंडल @QuickEarn24 एवं बैंक खाता संख्या 9988776655' : 'Telegram handle @QuickEarn24 and Beneficiary A/c 9988776655'
      });
      setIncidentDatetime('21-09-2026, 02:30 PM');
      setIncidentLocation(isHindi ? 'ऑनलाइन (इंटरनेट बैंकिंग / यूपीआई)' : 'Online (UPI & Net Banking)');
      setFacts(isHindi 
        ? 'आरोपी ने पार्ट-टाइम रिव्यू जॉब का झांसा देकर टेलीग्राम पर संपर्क किया। आरोपी ने एक फर्जी लिंक भेजकर मेरे बैंक खाते से 3 अलग-अलग किश्तों में कुल ₹75,000 धोखे से ट्रांसफर करवा लिए।'
        : 'The accused contacted me via WhatsApp offering a work-from-home review task. After building trust, they shared a fraudulent payment gateway link and induced me to transfer Rs. 75,000 across 3 UPI transactions under false promises.');
      setSelectedEvidences(['bank_slip', 'chat_history']);
      setCustomEvidence(isHindi ? 'साइबर हेल्पलाइन 1930 शिकायत संख्या #CYB2026/88902' : 'Cyber Helpline 1930 Acknowledgment #CYB2026/88902');
      setReliefSought(isHindi 
        ? 'धारा 173 BNSS व धारा 318(4) BNS के तहत प्राथमिकी दर्ज कर आरोपी के बैंक खातों को तुरंत फ्रीज करने व राशि वापस दिलाने की कृपा करें।'
        : 'Registration of FIR under Section 173 BNSS and Section 318(4) BNS, freezing of the recipient accounts, and restitution of Rs. 75,000.');
      setStep(4);
    } else if (presetKey === 'accident') {
      setDocumentType('FIR Application');
      setIncidentCategory('Accident');
      setComplainant({
        name: isHindi ? 'अनिल वर्मा' : 'Anil Verma',
        father_name: isHindi ? 'श्री रामगोपाल वर्मा' : 'Shri Ramgopal Verma',
        phone: '9811223344',
        address: isHindi ? 'फ्लैट 202, ग्रीन पार्क, जयपुर, राजस्थान' : 'Flat 202, Green Park, Jaipur, Rajasthan',
        police_station: isHindi ? 'थाना मानसरोवर, जयपुर' : 'Police Station Mansarovar, Jaipur'
      });
      setIsAccusedUnknown(false);
      setAccused({
        name: isHindi ? 'अज्ञात चालक (वाहन संख्या RJ-14-CB-9009)' : 'Driver of White SUV (Reg. No: RJ-14-CB-9009)',
        address: isHindi ? 'चालक फरार, वाहन का विवरण आरटीओ रिकॉर्ड अनुसार' : 'Driver fled from spot; registered owner as per Vahan portal'
      });
      setIncidentDatetime('20-09-2026, 08:15 PM');
      setIncidentLocation(isHindi ? 'मानसरोवर चौराहा, मुख्य मार्ग, जयपुर' : 'Mansarovar Chauraha, Main Ring Road, Jaipur');
      setFacts(isHindi 
        ? 'प्रार्थी अपनी मोटरसाइकिल (RJ-14-EM-1234) से घर लौट रहा था। तभी तेज रफ्तार व लापरवाही से आती हुई सफेद कार (RJ-14-CB-9009) ने पीछे से टक्कर मार दी। प्रार्थी के दाहिने पैर में फ्रैक्चर हुआ और वाहन चालक बिना रुके फरार हो गया।'
        : 'The complainant was returning home on his motorcycle when the accused driving a white SUV at excessive speed negligently rammed the complainant from behind, causing severe leg injuries and motorcycle damage, before speeding away.');
      setSelectedEvidences(['cctv_footage', 'photos', 'medical_slip']);
      setCustomEvidence('');
      setReliefSought(isHindi 
        ? 'धारा 281 व 125(a) BNS तथा मोटर वाहन अधिनियम के तहत FIR दर्ज कर अभियुक्त की पहचान कर सख्त कानूनी कार्रवाई की जाए।'
        : 'Immediate registration of FIR under BNS Sections 281 and 125, impounding of offending vehicle, and statutory legal action.');
      setStep(4);
    } else if (presetKey === 'notice') {
      setDocumentType('Legal Demand Notice');
      setIncidentCategory('Cheque Bounce');
      setComplainant({
        name: isHindi ? 'राजेश मल्होत्रा (प्रोपराइटर, आर.के. ट्रेडर्स)' : 'Rajesh Malhotra (Proprietor, RK Traders)',
        father_name: isHindi ? 'श्री के. एल. मल्होत्रा' : 'Shri K. L. Malhotra',
        phone: '9899001122',
        address: isHindi ? 'दुकान नं. 12, चांदनी चौक, दिल्ली' : 'Shop No. 12, Chandni Chowk, Delhi - 110006',
        police_station: isHindi ? 'कोतवाली पुलिस स्टेशन' : 'Kotwali PS'
      });
      setIsAccusedUnknown(false);
      setAccused({
        name: isHindi ? 'विक्रम सेठ' : 'Vikram Seth',
        address: isHindi ? 'मकान 88, मॉडल टाउन, दिल्ली' : 'H.No 88, Model Town, Delhi - 110009'
      });
      setIncidentDatetime('15-09-2026');
      setIncidentLocation(isHindi ? 'चांदनी चौक, दिल्ली' : 'Chandni Chowk, Delhi');
      setFacts(isHindi 
        ? 'विपक्ष ने माल आपूर्ति के एवज में चेक संख्या 451201 राशि ₹1,50,000 HDFC बैंक का जारी किया था। प्रार्थी ने इसे अपने बैंक में लगाया, जो दिनांक 15-09-2026 को "अपर्याप्त राशि (Funds Insufficient)" के मेमो के साथ अनादरित हो गया।'
        : 'In discharge of legally enforceable debt for goods supplied, you issued Cheque No. 451201 for Rs. 1,50,000 drawn on HDFC Bank. The said cheque was dishonored upon presentation with bank return memo dated 15-09-2026 citing "Funds Insufficient".');
      setSelectedEvidences(['cheque_memo', 'written_agreement']);
      setCustomEvidence('');
      setReliefSought(isHindi 
        ? 'इस नोटिस की प्राप्ति के 15 दिनों के भीतर संपूर्ण राशि ₹1,50,000 का भुगतान करें, अन्यथा परक्राम्य लिखत अधिनियम की धारा 138 एवं BNS की धारा 318 के तहत मुकदमा दायर किया जाएगा।'
        : 'Pay the entire cheque amount of Rs. 1,50,000 within 15 days of this notice, failing which legal proceedings under Section 138 NI Act and BNS 318 will be initiated.');
      setStep(4);
    }
  };

  const handleEvidenceToggle = (id) => {
    if (selectedEvidences.includes(id)) {
      setSelectedEvidences(selectedEvidences.filter(item => item !== id));
    } else {
      setSelectedEvidences([...selectedEvidences, id]);
    }
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setDraftError(null);

    // Build evidence list string
    const evidenceList = selectedEvidences.map(id => {
      const item = EVIDENCE_PRESETS.find(p => p.id === id);
      return item ? (isHindi ? item.hi : item.en) : id;
    });
    if (customEvidence.trim()) {
      evidenceList.push(customEvidence.trim());
    }

    try {
      const response = await axios.post('http://localhost:8000/api/draft', {
        document_type: documentType,
        language: language,
        complainant: complainant,
        accused: {
          name: isAccusedUnknown ? (isHindi ? 'अज्ञात व्यक्ति' : 'Unknown Person(s)') : accused.name,
          address: isAccusedUnknown ? (isHindi ? 'अज्ञात (जांच का विषय)' : 'Unknown / Matter of Investigation') : accused.address
        },
        incident_category: incidentCategory,
        incident_datetime: incidentDatetime,
        incident_location: incidentLocation,
        facts: facts,
        evidence: evidenceList.join(', '),
        relief_sought: reliefSought
      });

      setGeneratedResult(response.data);
      setStep(5);
    } catch (err) {
      console.error('Drafting request error:', err);
      setDraftError(isHindi 
        ? 'ड्राफ्ट जनरेट करने में त्रुटि हुई। कृपया जांचें कि बैकएंड सर्वर चल रहा है।'
        : 'Failed to generate draft. Please ensure the backend server is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult?.draft) return;
    navigator.clipboard.writeText(generatedResult.draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDoc = () => {
    if (!generatedResult?.draft) return;
    const docTitle = documentType === 'Legal Demand Notice' ? 'Legal_Demand_Notice' : 'Police_Complaint_FIR';
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${documentType}</title><style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.6;margin:1in;text-align:justify;}</style></head><body>`;
    const footer = "</body></html>";
    const content = header + `<h3 style="text-align:center;text-transform:uppercase;font-weight:bold;">${documentType}</h3><pre style="font-family:'Times New Roman',serif;font-size:12pt;white-space:pre-wrap;line-height:1.6;">${generatedResult.draft}</pre>` + footer;
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

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              {isHindi ? 'स्वचालित FIR एवं विधिक नोटिस जनरेटर' : 'Automated FIR & Legal Notice Drafter'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {isHindi ? 'धारा 173 BNSS एवं भारतीय न्याय संहिता (BNS 2023) के प्रमाणित कानूनी प्रारूप' : 'Statutory procedural formats under Section 173 BNSS & BNS 2023'}
            </p>
          </div>
        </div>

        {/* Language selector & Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value)}
            className="input-field"
            style={{ width: '135px', padding: '6px 10px', fontSize: '13px', height: '36px' }}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Quick Fill Preset Buttons */}
      {step < 5 && (
        <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed rgba(59, 130, 246, 0.25)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={15} /> {isHindi ? 'त्वरित नमूना भरें:' : 'Quick Sample Autofill:'}
          </span>
          <button 
            type="button"
            onClick={() => loadPreset('cyber')}
            style={{ background: 'white', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}
          >
            💳 {isHindi ? 'यूपीआई साइबर फ्रॉड FIR' : 'UPI Cyber Fraud FIR'}
          </button>
          <button 
            type="button"
            onClick={() => loadPreset('accident')}
            style={{ background: 'white', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}
          >
            🏍️ {isHindi ? 'बाइक एक्सीडेंट टक्कर FIR' : 'Bike Hit & Run FIR'}
          </button>
          <button 
            type="button"
            onClick={() => loadPreset('notice')}
            style={{ background: 'white', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}
          >
            📄 {isHindi ? 'चेक बाउंस लीगल नोटिस' : 'Cheque Bounce Legal Notice'}
          </button>
        </div>
      )}

      {/* Wizard Step Progress Bar */}
      {step < 5 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '8px 0' }}>
          <div style={{ position: 'absolute', top: '16px', left: '40px', right: '40px', height: '3px', background: '#e2e8f0', zIndex: 0 }} />
          <div 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '40px', 
              width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '90%', 
              height: '3px', 
              background: 'var(--primary)', 
              zIndex: 0,
              transition: 'width 0.3s ease'
            }} 
          />

          {[
            { num: 1, labelEn: 'Document & Type', labelHi: 'दस्तावेज़ का प्रकार' },
            { num: 2, labelEn: 'Parties Details', labelHi: 'पक्षकारों का विवरण' },
            { num: 3, labelEn: 'Incident & Evidence', labelHi: 'घटना व साक्ष्य' },
            { num: 4, labelEn: 'Review & Draft', labelHi: 'समीक्षा व प्रारूप' }
          ].map(s => (
            <div 
              key={s.num} 
              onClick={() => s.num < step && setStep(s.num)}
              style={{ 
                zIndex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '6px',
                cursor: s.num < step ? 'pointer' : 'default'
              }}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: step >= s.num ? 'var(--primary)' : 'white', 
                border: step >= s.num ? 'none' : '2px solid #cbd5e1',
                color: step >= s.num ? 'white' : '#64748b',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '13px',
                boxShadow: step === s.num ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span style={{ fontSize: '12px', fontWeight: step === s.num ? '600' : '500', color: step === s.num ? 'var(--primary)' : '#64748b' }}>
                {isHindi ? s.labelHi : s.labelEn}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: DOCUMENT TYPE & CATEGORY */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              {isHindi ? '1. आप कौन सा दस्तावेज़ तैयार करना चाहते हैं?' : '1. Which document do you want to generate?'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div 
                onClick={() => setDocumentType('FIR Application')}
                style={{
                  border: documentType === 'FIR Application' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: documentType === 'FIR Application' ? 'rgba(59, 130, 246, 0.05)' : 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <ShieldCheck size={20} color="var(--primary)" />
                  <strong style={{ fontSize: '15px' }}>
                    {isHindi ? 'पुलिस प्राथमिकी (FIR) शिकायत आवेदन' : 'Police FIR Complaint Application'}
                  </strong>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {isHindi 
                    ? 'थाना प्रभारी (SHO) को धारा 173 BNSS के तहत संज्ञेय अपराधों की जांच व कार्रवाई हेतु आवेदन पत्र।' 
                    : 'Formal application to Jurisdictional SHO under Section 173 BNSS for cognizable offenses, investigation & arrest.'}
                </p>
              </div>

              <div 
                onClick={() => setDocumentType('Legal Demand Notice')}
                style={{
                  border: documentType === 'Legal Demand Notice' ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                  background: documentType === 'Legal Demand Notice' ? 'rgba(59, 130, 246, 0.05)' : 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Scale size={20} color="var(--primary)" />
                  <strong style={{ fontSize: '15px' }}>
                    {isHindi ? 'विधिक मांग नोटिस (Legal Demand Notice)' : 'Statutory Legal Demand Notice'}
                  </strong>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {isHindi 
                    ? 'दूसरी पार्टी को 15 दिन की वैधानिक मोहलत, क्षतिपूर्ति या चेक बाउंस/अनुबंध उल्लंघन की औपचारिक चेतावनी।' 
                    : 'Formal legal warning giving 15-day cure period before initiating civil suit or criminal prosecution.'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              {isHindi ? '2. अपराध / मामले की मुख्य श्रेणी चुनें:' : '2. Select the main incident / case category:'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setIncidentCategory(cat.id)}
                  style={{
                    background: incidentCategory === cat.id ? 'var(--primary)' : 'white',
                    color: incidentCategory === cat.id ? 'white' : 'var(--text-main)',
                    border: incidentCategory === cat.id ? '1px solid var(--primary)' : '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontWeight: incidentCategory === cat.id ? '600' : '400'
                  }}
                >
                  {isHindi ? cat.hi : cat.en}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setStep(2)}
              style={{ padding: '10px 22px' }}
            >
              {isHindi ? 'आगे बढ़ें (पक्षकारों का विवरण)' : 'Next (Parties Details)'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PARTIES DETAILS */}
      {step === 2 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Complainant Section */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--primary)" />
              {isHindi ? 'परिवादी / आवेदक का विवरण (Complainant Particulars)' : 'Complainant / Sender Particulars'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                  {isHindi ? 'आवेदक का पूरा नाम *' : 'Full Name *'}
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={complainant.name} 
                  onChange={e => setComplainant({ ...complainant, name: e.target.value })}
                  placeholder={isHindi ? 'उदा. राजेश शर्मा' : 'e.g. Rajesh Sharma'}
                  style={{ height: '40px', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                  {isHindi ? 'पिता / पति का नाम' : 'Father / Spouse Name'}
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={complainant.father_name} 
                  onChange={e => setComplainant({ ...complainant, father_name: e.target.value })}
                  placeholder={isHindi ? 'उदा. श्री मोहन शर्मा' : 'e.g. Shri Mohan Sharma'}
                  style={{ height: '40px', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                  {isHindi ? 'मोबाइल नंबर *' : 'Contact Mobile No. *'}
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={complainant.phone} 
                  onChange={e => setComplainant({ ...complainant, phone: e.target.value })}
                  placeholder="98XXXXXXXX"
                  style={{ height: '40px', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                  {isHindi ? 'संबंधित पुलिस थाना / शहर *' : 'Jurisdictional Police Station / City *'}
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={complainant.police_station} 
                  onChange={e => setComplainant({ ...complainant, police_station: e.target.value })}
                  placeholder={isHindi ? 'उदा. थाना कोतवाली, जयपुर' : 'e.g. PS Cyber Crime / Connaught Place'}
                  style={{ height: '40px', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                  {isHindi ? 'आवेदक का पूरा स्थायी/वर्तमान पता *' : 'Full Residential Address *'}
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={complainant.address} 
                  onChange={e => setComplainant({ ...complainant, address: e.target.value })}
                  placeholder={isHindi ? 'मकान नंबर, गली, इलाका, शहर, पिन कोड' : 'House No, Street, Landmark, City, PIN Code'}
                  style={{ height: '40px', fontSize: '13.5px' }}
                />
              </div>
            </div>
          </div>

          {/* Accused Section */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserX size={18} color="#dc2626" />
                {isHindi ? 'आरोपी / प्रतिवादी का विवरण (Accused Particulars)' : 'Accused / Respondent Particulars'}
              </h4>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}>
                <input 
                  type="checkbox" 
                  checked={isAccusedUnknown} 
                  onChange={e => setIsAccusedUnknown(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <strong>{isHindi ? 'आरोपी अज्ञात है (उदा. साइबर फ्रॉड, चोरी, हिट एंड रन)' : 'Accused is Unknown / Cyber Culprit'}</strong>
              </label>
            </div>

            {!isAccusedUnknown ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                    {isHindi ? 'आरोपी का नाम या संस्था *' : 'Accused Name / Organization *'}
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={accused.name} 
                    onChange={e => setAccused({ ...accused, name: e.target.value })}
                    placeholder={isHindi ? 'उदा. सुमित सक्सेना / एक्सवाईजेड फाइनेंस' : 'e.g. Sumit Saxena / XYZ Finance'}
                    style={{ height: '40px', fontSize: '13.5px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                    {isHindi ? 'आरोपी का पता / मोबाइल / डिजिटल हैंडल' : 'Address / Mobile / Handle'}
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={accused.address} 
                    onChange={e => setAccused({ ...accused, address: e.target.value })}
                    placeholder={isHindi ? 'पता, फोन नंबर, या डिजिटल खाता' : 'Known residence, phone, or Telegram/bank ID'}
                    style={{ height: '40px', fontSize: '13.5px' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '13px', color: '#64748b' }}>
                {isHindi 
                  ? 'ℹ️ आरोपी को "अज्ञात व्यक्ति (Unknown Culprit)" के रूप में चिह्नित किया गया है। पुलिस धारा 173 BNSS के तहत तकनीकी विश्लेषण, बैंक UTR व कॉल रिकॉर्ड के आधार पर आरोपी की शिनाख्त करेगी।'
                  : 'ℹ️ Accused will be formally addressed as "Unknown Person(s)". Investigating officers will trace the culprits using cyber/banking audit trails under Section 173 BNSS.'}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> {isHindi ? 'पीछे जाएं' : 'Back'}
            </button>

            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setStep(3)}
              disabled={!complainant.name || !complainant.phone}
              style={{ opacity: (!complainant.name || !complainant.phone) ? 0.6 : 1 }}
            >
              {isHindi ? 'आगे बढ़ें (घटना व साक्ष्य)' : 'Next (Incident & Evidence)'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INCIDENT DETAILS & EVIDENCE */}
      {step === 3 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="var(--primary)" />
                {isHindi ? 'घटना का दिनांक व समय *' : 'Date & Time of Occurrence *'}
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={incidentDatetime} 
                onChange={e => setIncidentDatetime(e.target.value)}
                placeholder={isHindi ? 'उदा. 21-09-2026, दोपहर 02:30 बजे' : 'e.g. 21-09-2026, 02:30 PM'}
                style={{ height: '42px', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--primary)" />
                {isHindi ? 'घटना का स्थान *' : 'Exact Place of Occurrence *'}
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={incidentLocation} 
                onChange={e => setIncidentLocation(e.target.value)}
                placeholder={isHindi ? 'उदा. रिंग रोड चौराहा / ऑनलाइन इंटरनेट बैंकिंग' : 'e.g. Sector 18 Market / Online Banking'}
                style={{ height: '42px', fontSize: '13.5px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              {isHindi ? 'घटना का संपूर्ण विवरण (Facts of the Case) *' : 'Detailed Statement of Facts *'}
            </label>
            <textarea 
              rows={5}
              className="input-field"
              value={facts}
              onChange={e => setFacts(e.target.value)}
              placeholder={isHindi 
                ? 'क्रमबद्ध रूप से लिखें कि क्या हुआ, आरोपी ने क्या कहा या किया, क्या नुकसान हुआ, आदि...' 
                : 'State what happened in chronological order: what the accused did, transaction details, loss or injury caused...'}
              style={{ fontSize: '13.5px', lineHeight: '1.5', resize: 'vertical' }}
            />
          </div>

          {/* Evidence Checklist */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
              {isHindi ? 'संलग्न साक्ष्य व प्रमाण चुनें (Checklist of Evidence):' : 'Select Attached Evidence & Enclosures:'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {EVIDENCE_PRESETS.map(item => {
                const isSelected = selectedEvidences.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleEvidenceToggle(item.id)}
                    style={{
                      background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'white',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: isSelected ? 'none' : '1px solid #94a3b8',
                      background: isSelected ? 'var(--primary)' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {isSelected && <Check size={12} />}
                    </div>
                    <span>{isHindi ? item.hi : item.en}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '10px' }}>
              <input 
                type="text" 
                className="input-field" 
                value={customEvidence} 
                onChange={e => setCustomEvidence(e.target.value)}
                placeholder={isHindi ? 'अन्य कोई दस्तावेज या शिकायत संख्या (उदा. 1930 साइबर कंप्लेंट पावती)' : 'Other additional documents or complaint references (optional)'}
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Relief / Prayer */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              {isHindi ? 'मांगी गई राहत / कानूनी प्रार्थना (Relief / Prayer)' : 'Relief / Demands Sought'}
            </label>
            <input 
              type="text" 
              className="input-field" 
              value={reliefSought} 
              onChange={e => setReliefSought(e.target.value)}
              placeholder={isHindi 
                ? 'उदा. धारा 173 BNSS के तहत तुरंत FIR दर्ज कर अभियुक्तों की गिरफ्तारी व वसूली की जाए।' 
                : 'e.g. Immediate registration of FIR, freezing of beneficiary accounts, and recovery of damages.'}
              style={{ height: '42px', fontSize: '13.5px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => setStep(2)}
              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> {isHindi ? 'पीछे जाएं' : 'Back'}
            </button>

            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setStep(4)}
              disabled={!facts.trim() || !incidentLocation.trim()}
              style={{ opacity: (!facts.trim() || !incidentLocation.trim()) ? 0.6 : 1 }}
            >
              {isHindi ? 'समीक्षा करें' : 'Review & Generate'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & GENERATE */}
      {step === 4 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '17px', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="var(--primary)" />
              {isHindi ? 'विवरण की अंतिम समीक्षा (Draft Summary)' : 'Draft Parameters Summary'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '13.5px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'दस्तावेज़:' : 'Document:'}</span>
                <strong>{documentType}</strong> ({isHindi ? 'हिंदी प्रारूप' : 'English Draft'})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'श्रेणी:' : 'Category:'}</span>
                <strong>{incidentCategory}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'परिवादी:' : 'Complainant:'}</span>
                <strong>{complainant.name || 'N/A'}</strong> ({complainant.phone})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'आरोपी:' : 'Accused:'}</span>
                <strong>{isAccusedUnknown ? (isHindi ? 'अज्ञात व्यक्ति' : 'Unknown Person') : accused.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'समय व स्थान:' : 'Time & Place:'}</span>
                <span>{incidentDatetime || 'N/A'} | {incidentLocation || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'संबंधित थाना:' : 'Police Station:'}</span>
                <span>{complainant.police_station || 'Jurisdictional PS'}</span>
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                {isHindi ? 'घटना के तथ्य:' : 'Factual Brief:'}
              </span>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', background: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                {facts}
              </p>
            </div>
          </div>

          {draftError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
              <AlertCircle size={18} />
              <span>{draftError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={() => setStep(3)}
              disabled={isGenerating}
              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> {isHindi ? 'बदलाव करें' : 'Edit Details'}
            </button>

            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '600' }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  {isHindi ? 'कानूनी ड्राफ्ट तैयार किया जा रहा है...' : 'Generating Official Legal Draft...'}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {isHindi ? 'अंतिम ड्राफ्ट जनरेट करें' : 'Generate Formal Legal Draft'}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: GENERATED DOCUMENT DISPLAY (PRINT READY) */}
      {step === 5 && generatedResult && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action Toolbar (Hidden during print) */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: 'rgba(255, 255, 255, 0.8)', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> {isHindi ? 'ड्राफ्ट तैयार है' : 'Draft Generated'}
              </span>
              {generatedResult.sections_referenced && generatedResult.sections_referenced.length > 0 && (
                <span style={{ fontSize: '12px', color: '#1e3a8a', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px' }}>
                  {generatedResult.sections_referenced.join(', ')}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: copied ? '#10b981' : 'white',
                  color: copied ? 'white' : 'var(--text-main)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'कॉपी करें' : 'Copy Text')}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <Printer size={16} />
                {isHindi ? 'प्रिंट / PDF सेव करें' : 'Print / Save PDF'}
              </button>

              <button
                type="button"
                onClick={handleExportDoc}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title={isHindi ? 'Word (.doc) प्रारूप डाउनलोड करें' : 'Download Word (.doc) format'}
              >
                <Download size={16} />
                {isHindi ? 'Word (.doc) डाउनलोड' : 'Download Word (.doc)'}
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer' }}
                title={isHindi ? 'विवरण बदलें' : 'Edit details'}
              >
                {isHindi ? 'संशोधन' : 'Edit'}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setGeneratedResult(null); }}
                style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                title={isHindi ? 'नया ड्राफ्ट' : 'New Draft'}
              >
                <RotateCcw size={14} /> {isHindi ? 'नया' : 'New'}
              </button>
            </div>
          </div>

          {/* Printable Official Paper Container */}
          <div 
            id="printable-legal-document"
            className="official-legal-document"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '40px 48px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              fontFamily: '"Times New Roman", Times, serif, "Georgia"',
              lineHeight: '1.7',
              fontSize: '15px',
              whiteSpace: 'pre-wrap',
              position: 'relative'
            }}
          >
            {/* Header Emblem Stamp Watermark Effect */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#475569' }}>
                {isHindi ? 'सत्यमेव जयते' : 'FORMAL LEGAL INSTRUMENT • BHARAT (INDIA)'}
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '6px 0 2px', textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a' }}>
                {documentType === 'Legal Demand Notice' 
                  ? (isHindi ? 'विधिक मांग नोटिस' : 'STATUTORY LEGAL DEMAND NOTICE')
                  : (isHindi ? 'प्रथम सूचना रिपोर्ट (FIR) हेतु औपचारिक शिकायत' : 'FORMAL POLICE COMPLAINT (UNDER SECTION 173 BNSS, 2023)')}
              </h1>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {isHindi ? 'भारतीय न्याय संहिता (BNS 2023) एवं BNSS 2023 के अंतर्गत तैयार' : 'Formulated under the Bharatiya Nagarik Suraksha Sanhita, 2023 & BNS 2023'}
              </div>
            </div>

            {/* Document Body */}
            <div style={{ textAlign: 'justify' }}>
              {generatedResult.draft}
            </div>

            {/* Footer statutory assurance */}
            <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px dashed #94a3b8', fontSize: '11px', color: '#64748b', textAlign: 'center', fontFamily: 'sans-serif' }}>
              {isHindi 
                ? 'यह विधिक प्रारूप भारतीय संसद द्वारा पारित भारतीय न्याय संहिता (BNS 2023) एवं भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) के प्रावधानों के अनुरूप तैयार किया गया है।'
                : 'This statutory document is drafted in strict adherence to Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) and Bharatiya Nyaya Sanhita (BNS 2023).'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
