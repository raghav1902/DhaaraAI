import React from 'react';
import {
  FileSpreadsheet,
  ShieldCheck,
  AlertCircle,
  Scale
} from 'lucide-react';

export default function DrafterTemplateFields({
  documentType = '',
  extraFields = {},
  updateExtra,
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

  return (
    <>
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
                {isHindi ? 'पति की मासिक आय का अनुमान (₹)' : 'Estimated Husband Income (₹)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.husband_income || ''}
                onChange={e => updateExtra('husband_income', e.target.value)}
                placeholder="उदा. ₹80,000/- प्रतिमाह"
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
            {isHindi ? 'किराया बेदखली नोटिस विशिष्ट विवरण (धारा 106 T.P. Act)' : 'Tenancy / Eviction Notice Particulars (Sec 106 T.P. Act)'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                {isHindi ? 'मासिक किराया (₹) *' : 'Monthly Rent (₹) *'}
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
                {isHindi ? 'बकाया किराये की कुल राशि (₹)' : 'Total Rent Arrears Due (₹)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={extraFields.arrears_amount || ''}
                onChange={e => updateExtra('arrears_amount', e.target.value)}
                placeholder="उदा. ₹54,000/- (3 माह)"
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
    </>
  );
}
