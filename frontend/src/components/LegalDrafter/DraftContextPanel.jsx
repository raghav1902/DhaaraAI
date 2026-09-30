import React from 'react';
import {
  FileText,
  CheckCircle2,
  Circle,
  UserRound,
  MapPin,
  CalendarDays,
  Paperclip,
  Stamp,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { EVIDENCE_PRESETS } from './DrafterConstants';

export default function DraftContextPanel({
  step,
  documentType,
  incidentCategory,
  complainant,
  accused,
  isAccusedUnknown,
  incidentDatetime,
  incidentLocation,
  facts,
  selectedEvidences = [],
  customEvidence = '',
  reliefSought,
  isHindi
}) {
  const isFir = documentType === 'FIR Application';

  // Format evidence names
  const evidenceLabels = selectedEvidences.map(id => {
    const item = EVIDENCE_PRESETS.find(p => p.id === id);
    return item ? (isHindi ? item.hi : item.en) : id;
  });
  if (customEvidence && customEvidence.trim()) {
    evidenceLabels.push(customEvidence.trim());
  }

  const sections = [
    { label: isHindi ? 'दस्तावेज़ का प्रकार' : 'Document Type', done: Boolean(documentType) },
    { label: isHindi ? 'पक्षकारों का विवरण' : 'Parties Details', done: Boolean(complainant.name && (isAccusedUnknown || accused?.name)) },
    { label: isHindi ? 'घटना व साक्ष्य' : 'Facts & Evidence', done: Boolean(facts.trim() && incidentLocation.trim()) },
    { label: isHindi ? 'समीक्षा व प्रारूप' : 'Review & Generate', done: step >= 4 }
  ];

  return (
    <aside className="drafter-preview-rail" aria-label={isHindi ? 'लाइव विधिक दस्तावेज़ पूर्वावलोकन' : 'Live Legal Document Preview'}>
      {/* Top Header Card */}
      <div className="drafter-preview-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--primary)' }}><FileText size={17} /></span>
          <div>
            <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '750', color: 'var(--text-main)' }}>
              {isHindi ? 'लाइव A4 दस्तावेज़ पूर्वावलोकन' : 'Live Legal Instrument Preview'}
            </h3>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
              {isHindi ? 'जैसे-जैसे आप फ़ॉर्म भरेंगे, ड्राफ्ट तैयार होता जाएगा' : 'Updates in real-time as you complete fields'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            border: '1px solid var(--primary-border)'
          }}>
            A4 Standard
          </span>
        </div>
      </div>

      {/* Realistic A4 Document Sheet */}
      <div className="a4-document-sheet">
        <div className="a4-watermark" aria-hidden="true">
          SEC 173 BNSS • DRAFT
        </div>

        {/* Official Letterhead */}
        <div className="a4-header-block">
          <div className="a4-emblem-text">
            {isHindi ? '॥ सत्यमेव जयते ॥' : '॥ SATYAMEVA JAYATE ॥'}
          </div>
          <h2 className="a4-title">
            {isFir
              ? (isHindi ? 'प्रथम सूचना रिपोर्ट (FIR) हेतु औपचारिक शिकायत' : 'FORMAL POLICE COMPLAINT / INFORMATION')
              : (isHindi ? 'विधिक मांग नोटिस' : 'STATUTORY LEGAL DEMAND NOTICE')}
          </h2>
          <div className="a4-subtitle">
            {isFir
              ? '[ UNDER SECTION 173 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 ]'
              : '[ UNDER SECTION 138 OF NEGOTIABLE INSTRUMENTS ACT / CONTRACT ACT ]'}
          </div>
        </div>

        {/* Recipient Details */}
        <div className="a4-section">
          <strong>{isHindi ? 'सेवा में / To:' : 'TO:'}</strong>
          {isFir ? (
            <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
              <div>{isHindi ? 'थाना प्रभारी महोदय / The Station House Officer,' : 'The Station House Officer (SHO),'}</div>
              <div>{complainant.police_station || (isHindi ? '[पुलिस स्टेशन का नाम दर्ज करें]' : '[Police Station Jurisdiction]')}</div>
              <div>{complainant.address ? complainant.address.split(',').slice(-1)[0] : '[City / District]'}</div>
            </div>
          ) : (
            <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
              <div><strong>{accused?.name || (isHindi ? '[विपक्षी का नाम]' : '[Opposite Party Name]')}</strong></div>
              <div>{accused?.address || (isHindi ? '[विपक्षी का पता]' : '[Opposite Party Address]')}</div>
            </div>
          )}
        </div>

        {/* Complainant / Informant */}
        <div className="a4-section">
          <strong>{isHindi ? 'शिकायतकर्ता / Informant:' : 'INFORMANT / COMPLAINANT:'}</strong>
          <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
            <span>{complainant.name || (isHindi ? '[शिकायतकर्ता का नाम]' : '[Complainant Full Name]')}</span>
            {complainant.father_name && <span> S/o {complainant.father_name}</span>}
            {complainant.phone && <span> | Ph: {complainant.phone}</span>}
            {complainant.address && <div>Address: {complainant.address}</div>}
          </div>
        </div>

        {/* Subject Line */}
        <div className="a4-section a4-subject-line">
          <strong>{isHindi ? 'विषय: ' : 'SUBJECT: '}</strong>
          <span>
            {isFir
              ? `${isHindi ? 'विरुद्ध प्राथमिकी दर्ज करने बाबत' : 'Complaint regarding'} ${incidentCategory || 'Offense'} under Bharatiya Nyaya Sanhita (BNS 2023).`
              : `Statutory Legal Demand Notice regarding ${incidentCategory || 'Legal Dispute'}.`}
          </span>
        </div>

        {/* Incident Particulars */}
        <div className="a4-section a4-particulars-box">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#475569' }}>Date & Time: </span>
              <strong>{incidentDatetime || (isHindi ? 'अनिर्दिष्ट' : 'As mentioned below')}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Location: </span>
              <strong>{incidentLocation || (isHindi ? 'अनिर्दिष्ट' : 'Within territorial limits')}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Accused/Respondent: </span>
              <strong>{isAccusedUnknown ? (isHindi ? 'अज्ञात व्यक्ति' : 'Unknown Person(s)') : (accused?.name || 'As named')}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Category: </span>
              <strong>{incidentCategory}</strong>
            </div>
          </div>
        </div>

        {/* Facts Statement */}
        <div className="a4-section">
          <strong>{isHindi ? 'घटना का संक्षिप्त विवरण / Statement of Facts:' : 'STATEMENT OF FACTS:'}</strong>
          <p className="a4-body-text">
            {facts.trim() || (
              <em style={{ color: '#94a3b8' }}>
                {isHindi
                  ? 'चरण 3 में आपके द्वारा दर्ज किए गए तथ्य एवं आरोप यहाँ कानूनी भाषा में ड्राफ्ट होंगे...'
                  : 'Chronological statements of facts, occurrences, and unlawful acts entered in Step 3 will be integrated here...'}
              </em>
            )}
          </p>
        </div>

        {/* Evidences */}
        {evidenceLabels.length > 0 && (
          <div className="a4-section">
            <strong>{isHindi ? 'संलग्न साक्ष्य / Annexures & Supporting Evidence:' : 'ANNEXURES & SUPPORTING EVIDENCE:'}</strong>
            <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: '11px', lineHeight: '1.5' }}>
              {evidenceLabels.map((ev, i) => (
                <li key={i}><strong>Annexure A-{i + 1}:</strong> {ev}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Relief Sought */}
        <div className="a4-section">
          <strong>{isHindi ? 'प्रार्थना / Relief & Prayer:' : 'PRAYER & RELIEF SOUGHT:'}</strong>
          <p className="a4-body-text">
            {reliefSought.trim() || (
              <span>
                {isFir
                  ? (isHindi ? 'अतः श्रीमान जी से निवेदन है कि त्वरित प्राथमिकी दर्ज कर कठोर कानूनी कार्रवाई की जाए।' : 'It is therefore respectfully prayed that an FIR be registered under relevant sections of BNS 2023 and strict lawful action taken.')
                  : (isHindi ? 'अतः 15 दिवस के भीतर भुगतान करें अन्यथा सक्षम न्यायालय में विधिक कार्रवाई की जाएगी।' : 'You are hereby demanded to comply and resolve the claim within 15 days, failing which legal proceedings shall follow.')}
              </span>
            )}
          </p>
        </div>

        {/* Verification and Sign-off */}
        <div className="a4-signoff">
          <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', maxWidth: '300px' }}>
            {isHindi
              ? 'सत्यापन: मैं प्रमाणित करता हूँ कि उपरोक्त विवरण मेरे ज्ञान व विश्वास अनुसार सत्य है।'
              : 'Verification: I solemnly state and verify that the facts stated above are true to the best of my knowledge.'}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                {complainant.name || 'Informant'}
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Signature of Informant</div>
          </div>
        </div>
      </div>

      {/* Progress Checklist Bar */}
      <div className="drafter-context-card" style={{ marginTop: '12px' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
          {isHindi ? 'दस्तावेज़ पूर्णता चेकलिस्ट' : 'Document Readiness Checklist'}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sections.map(({ label, done }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: done ? 'var(--accent)' : 'var(--text-muted)' }}>
                {done ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                <span>{label}</span>
              </div>
              <span style={{
                fontSize: '9.5px',
                fontWeight: '700',
                padding: '1px 6px',
                borderRadius: '4px',
                background: done ? 'var(--accent-light)' : 'var(--subtle-bg)',
                color: done ? 'var(--accent)' : 'var(--text-dim)'
              }}>
                {done ? (isHindi ? 'पूर्ण' : 'Ready') : (isHindi ? 'अपूर्ण' : 'Pending')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
