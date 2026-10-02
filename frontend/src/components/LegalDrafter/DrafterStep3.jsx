import React from 'react';
import { Calendar, MapPin, Mic, MicOff, Check, ArrowLeft, ArrowRight, FileSpreadsheet, Scale, ShieldCheck, AlertCircle } from 'lucide-react';
import { EVIDENCE_PRESETS } from './DrafterConstants';

export default function DrafterStep3({
  documentType = 'FIR Application',
  incidentDatetime,
  setIncidentDatetime,
  incidentLocation,
  setIncidentLocation,
  facts,
  setFacts,
  selectedEvidences,
  setSelectedEvidences,
  customEvidence,
  setCustomEvidence,
  reliefSought,
  setReliefSought,
  extraFields = {},
  setExtraFields = () => {},
  isListening,
  handleToggleVoiceInput,
  setStep,
  isHindi
}) {
  const dt = (documentType || '').toLowerCase();
  const isCheque = dt.includes('cheque') || dt.includes('138');
  const isBail = dt.includes('bail') && !dt.includes('anticipatory');
  const isAnticipatoryBail = dt.includes('anticipatory');
  const isConsumer = dt.includes('consumer');
  const isMaintenance = dt.includes('maintenance');
  const isRent = dt.includes('rent') || dt.includes('tenancy') || dt.includes('lease');
  const isRTI = dt.includes('rti');
  const isAffidavit = dt.includes('affidavit');

  const updateExtra = (key, value) => {
    setExtraFields(prev => ({ ...prev, [key]: value }));
  };

  const handleEvidenceToggle = (id) => {
    if (selectedEvidences.includes(id)) {
      setSelectedEvidences(selectedEvidences.filter(item => item !== id));
    } else {
      setSelectedEvidences([...selectedEvidences, id]);
    }
  };

  return (
    <div className="drafter-step-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* 1. Date & Location */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--primary)" />
            {isHindi ? 'दस्तावेज़ / घटना का दिनांक व समय *' : 'Date & Time of Incident / Notice *'}
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
            {isHindi ? 'घटना का स्थान / शहर / अधिकार क्षेत्र *' : 'Place of Incident / Jurisdiction *'}
          </label>
          <input
            type="text"
            className="input-field"
            value={incidentLocation}
            onChange={e => setIncidentLocation(e.target.value)}
            placeholder={isHindi ? 'उदा. रिंग रोड चौराहा, जयपुर / ऑनलाइन' : 'e.g. Sector 18 Market, Delhi / Online'}
            style={{ height: '42px', fontSize: '13.5px' }}
          />
        </div>
      </div>

      {/* 2. DYNAMIC TEMPLATE-SPECIFIC FIELDS BOX */}
      {isCheque && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={16} />
            {isHindi ? 'चेक अनादरण (बाउंस) विशिष्ट विवरण — धारा 138 NI Act' : 'Cheque Dishonour Specific Particulars (Section 138 NI Act)'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'चेक संख्या (Cheque No.) *' : 'Cheque Number *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.cheque_number || ''}
                onChange={e => updateExtra('cheque_number', e.target.value)}
                placeholder="उदा. 458921"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'चेक राशि (Amount in ₹) *' : 'Cheque Amount (₹) *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.cheque_amount || ''}
                onChange={e => updateExtra('cheque_amount', e.target.value)}
                placeholder="उदा. ₹2,50,000/-"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'चेक दिनांक (Cheque Date)' : 'Cheque Date'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.cheque_date || ''}
                onChange={e => updateExtra('cheque_date', e.target.value)}
                placeholder="उदा. 15-09-2026"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'बैंक एवं शाखा का नाम' : 'Bank & Branch Name'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.bank_name || ''}
                onChange={e => updateExtra('bank_name', e.target.value)}
                placeholder="उदा. HDFC Bank, MI Road Branch"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'बैंक वापसी मेमो दिनांक *' : 'Return Memo Date *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.memo_date || ''}
                onChange={e => updateExtra('memo_date', e.target.value)}
                placeholder="उदा. 18-09-2026"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'अनादरण का कारण (Reason)' : 'Dishonour Reason'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.memo_reason || ''}
                onChange={e => updateExtra('memo_reason', e.target.value)}
                placeholder="उदा. Funds Insufficient / खाता बंद"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      )}

      {(isBail || isAnticipatoryBail) && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} />
            {isHindi ? 'जमानत विशिष्ट विवरण (धारा 480 / 482 BNSS)' : 'Bail Specific Particulars (Section 480 / 482 BNSS)'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'न्यायालय का नाम (Court Name) *' : 'Competent Court Name *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.court_name || ''}
                onChange={e => updateExtra('court_name', e.target.value)}
                placeholder={isHindi ? 'उदा. न्यायालय सत्र न्यायाधीश, जयपुर' : 'e.g. In the Court of Sessions Judge, Jaipur'}
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'एफआईआर संख्या व वर्ष *' : 'FIR Number & Year *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.fir_number || ''}
                onChange={e => updateExtra('fir_number', e.target.value)}
                placeholder="उदा. FIR No. 142/2026"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'आरोपित धाराएं (Sections Booked) *' : 'Sections Booked *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.sections_booked || ''}
                onChange={e => updateExtra('sections_booked', e.target.value)}
                placeholder="उदा. Section 115, 318(4), 351(2) BNS"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            {isBail && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                  {isHindi ? 'गिरफ्तारी का दिनांक (Date of Arrest)' : 'Date of Arrest'}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={extraFields.arrest_date || ''}
                  onChange={e => updateExtra('arrest_date', e.target.value)}
                  placeholder="उदा. 20-09-2026"
                  style={{ height: '38px', fontSize: '13px' }}
                />
              </div>
            )}
            {isAnticipatoryBail && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                  {isHindi ? 'संभावित गिरफ्तारी का कारण' : 'Apprehension Grounds'}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={extraFields.apprehension_reason || ''}
                  onChange={e => updateExtra('apprehension_reason', e.target.value)}
                  placeholder="उदा. राजनीतिक दुर्भावना / झूठी शिकायत"
                  style={{ height: '38px', fontSize: '13px' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {isConsumer && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {isHindi ? 'उपभोक्ता संरक्षण विशिष्ट विवरण (धारा 35 CPA, 2019)' : 'Consumer Complaint Specific Particulars (Sec 35 CPA 2019)'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'उत्पाद / सेवा का नाम *' : 'Product / Service Name *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.product_name || ''}
                onChange={e => updateExtra('product_name', e.target.value)}
                placeholder="उदा. Smart LED TV 55 Inch"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'बिल / बीजक संख्या (Invoice No.)' : 'Invoice / Bill No.'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.bill_number || ''}
                onChange={e => updateExtra('bill_number', e.target.value)}
                placeholder="उदा. INV-2026-904"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'भुगतान की गई राशि (₹) *' : 'Amount Paid (₹) *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.amount_paid || ''}
                onChange={e => updateExtra('amount_paid', e.target.value)}
                placeholder="उदा. ₹48,000/-"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'कमी / दोष की प्रकृति' : 'Nature of Defect / Deficiency'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.defect_type || ''}
                onChange={e => updateExtra('defect_type', e.target.value)}
                placeholder="उदा. वारंटी अवधि में डिस्प्ले खराब व सर्विस से मना"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      )}

      {isMaintenance && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} />
            {isHindi ? 'भरण-पोषण विशिष्ट विवरण (धारा 144 BNSS / 125 CrPC)' : 'Maintenance Specific Particulars (Section 144 BNSS)'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'विवाह का दिनांक (Marriage Date)' : 'Marriage Date'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.marriage_date || ''}
                onChange={e => updateExtra('marriage_date', e.target.value)}
                placeholder="उदा. 12-05-2019"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'आश्रित बच्चे (नाम व आयु)' : 'Dependent Children (Names & Ages)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.children_details || ''}
                onChange={e => updateExtra('children_details', e.target.value)}
                placeholder="उदा. 1 पुत्र (उम्र 4 वर्ष)"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'विपक्षी की अनुमानित मासिक आय (₹)' : 'Opposite Party Estimated Income (₹)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.respondent_income || ''}
                onChange={e => updateExtra('respondent_income', e.target.value)}
                placeholder="उदा. ₹80,000/- प्रतिमाह"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'मांगी गई भरण-पोषण राशि (₹/माह) *' : 'Maintenance Claimed (₹/month) *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.claim_amount || ''}
                onChange={e => updateExtra('claim_amount', e.target.value)}
                placeholder="उदा. ₹25,000/- प्रतिमाह"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      )}

      {isRent && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} />
            {isHindi ? 'किरायेदारी व बेदखली विशिष्ट विवरण' : 'Tenancy & Eviction Specific Particulars'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'मासिक किराया राशि (₹) *' : 'Monthly Rent (₹) *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.monthly_rent || ''}
                onChange={e => updateExtra('monthly_rent', e.target.value)}
                placeholder="उदा. ₹18,000/-"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'बकाया किराया अवधि / राशि' : 'Rent Default Period / Dues'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.rent_dues || ''}
                onChange={e => updateExtra('rent_dues', e.target.value)}
                placeholder="उदा. जून 2026 से अगस्त 2026 (कुल ₹54,000)"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'खाली करने की मोहलत (दिन) *' : 'Notice Cure Period (Days) *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.notice_days || '15'}
                onChange={e => updateExtra('notice_days', e.target.value)}
                placeholder="15 या 30 दिन"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      )}

      {isRTI && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} />
            {isHindi ? 'आरटीआई आवेदन विशिष्ट विवरण (धारा 6(1) RTI Act)' : 'RTI Specific Particulars (Section 6(1) RTI Act)'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'सूचना की समयावधि *' : 'Period to which Information Pertains *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.period_of_info || ''}
                onChange={e => updateExtra('period_of_info', e.target.value)}
                placeholder="उदा. 01 अप्रैल 2025 से 31 मार्च 2026"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'आवेदन शुल्क रसीद / IPO सं. *' : 'Fee Receipt / IPO Number *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.fee_receipt || ''}
                onChange={e => updateExtra('fee_receipt', e.target.value)}
                placeholder="उदा. IPO No. 45F 987654"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      )}

      {isAffidavit && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} />
            {isHindi ? 'शपथपत्र (हलफनामा) विशिष्ट विवरण' : 'Sworn Affidavit Specific Particulars'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'शपथकर्ता की आयु व व्यवसाय' : 'Deponent Age & Occupation'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.deponent_age || ''}
                onChange={e => updateExtra('deponent_age', e.target.value)}
                placeholder="उदा. उम्र 34 वर्ष, व्यवसाय: निजी सेवा"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'शपथपत्र का प्रयोजन (Purpose) *' : 'Purpose of Affidavit *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.affidavit_purpose || ''}
                onChange={e => updateExtra('affidavit_purpose', e.target.value)}
                placeholder="उदा. नाम शुद्धि / पता सत्यापन / कोर्ट शपथ"
                style={{ height: '38px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Detailed Facts with Voice Input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
            {isHindi ? 'घटना का संपूर्ण विवरण (Chronological Facts of the Case) *' : 'Chronological Statement of Facts *'}
          </label>
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={isListening ? 'mic-recording-pulse' : 'btn-ghost'}
            style={{
              background: isListening ? '#fee2e2' : 'rgba(59, 130, 246, 0.08)',
              color: isListening ? '#dc2626' : 'var(--primary)',
              border: isListening ? '1px solid #fca5a5' : '1px solid rgba(59, 130, 246, 0.2)',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {isListening ? (
              <>
                <MicOff size={14} />
                {isHindi ? 'बोलना बंद करें' : 'Stop Listening'}
              </>
            ) : (
              <>
                <Mic size={14} />
                {isHindi ? 'बोलकर टाइप करें' : 'Voice Type'}
              </>
            )}
          </button>
        </div>
        <textarea
          className="input-field"
          rows={5}
          value={facts}
          onChange={e => setFacts(e.target.value)}
          placeholder={isHindi
            ? 'घटना का सिलसिलेवार विवरण लिखें (उदा. किसने क्या कहा, कितना लेन-देन हुआ, क्या धोखाधड़ी या घटना घटी)...'
            : 'Detail the facts chronologically (e.g. sequence of events, transaction IDs, breach of trust, verbal communication)...'}
          style={{ width: '100%', resize: 'vertical', fontSize: '13.5px', lineHeight: '1.5' }}
        />
      </div>

      {/* 4. Evidence Presets */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
          {isHindi ? 'संलग्न किए जाने वाले साक्ष्य व अभिलेख (Evidence / Enclosures):' : 'Attached Supporting Evidence & Enclosures:'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
          {EVIDENCE_PRESETS.map(item => {
            const isChecked = selectedEvidences.includes(item.id);
            return (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isChecked ? 'var(--primary-light)' : 'var(--card-bg)',
                  border: isChecked ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: isChecked ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isChecked ? '600' : '400',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleEvidenceToggle(item.id)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: isChecked ? 'none' : '1.5px solid var(--text-muted)',
                  background: isChecked ? 'var(--primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={12} />}
                </span>
                <span>{isHindi ? item.hi : item.en}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Evidence */}
      <div>
        <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
          {isHindi ? 'अन्य कोई विशिष्ट साक्ष्य / दस्तावेज़ संख्या:' : 'Any Other Custom Evidence / Document Reference:'}
        </label>
        <input
          type="text"
          className="input-field"
          value={customEvidence}
          onChange={e => setCustomEvidence(e.target.value)}
          placeholder={isHindi ? 'उदा. स्पीड पोस्ट ट्रैकिंग संख्या, गवाहों के नाम...' : 'e.g. Speed Post Tracking No, Witness particulars...'}
          style={{ height: '38px', fontSize: '13px' }}
        />
      </div>

      {/* 6. Relief / Prayer Sought */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'block' }}>
          {isHindi ? 'मांगी गई राहत / विधिक प्रार्थना (Relief / Prayer Sought) *' : 'Relief / Prayer Demanded *'}
        </label>
        <textarea
          className="input-field"
          rows={2}
          value={reliefSought}
          onChange={e => setReliefSought(e.target.value)}
          placeholder={isHindi
            ? 'उदा. 15 दिन के भीतर ₹2,50,000 लौटाएं अन्यथा धारा 138 NI Act के तहत मुकदमा किया जाएगा / प्राथमिकी दर्ज की जाए / जमानत मंजूर की जाए...'
            : 'e.g. Registration of FIR and recovery of funds / Pay Rs. 2,50,000 within 15 days / Release applicant on bail...'}
          style={{ width: '100%', resize: 'vertical', fontSize: '13px' }}
        />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setStep(2)}
          style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> {isHindi ? 'पीछे (पक्षकारों का विवरण)' : 'Back (Parties Details)'}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(4)}
          style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isHindi ? 'आगे बढ़ें (समीक्षा एवं जनरेट)' : 'Next (Review & Generate)'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
