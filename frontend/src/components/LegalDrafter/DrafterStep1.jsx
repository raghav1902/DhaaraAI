import React from 'react';
import { ShieldCheck, Scale, ArrowRight } from 'lucide-react';
import { CATEGORIES } from './DrafterConstants';

export default function DrafterStep1({
  documentType,
  setDocumentType,
  incidentCategory,
  setIncidentCategory,
  setStep,
  isHindi
}) {
  return (
    <div className="drafter-step-content drafter-step-template animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      <div>
        <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
          {isHindi ? '1. आप कौन सा दस्तावेज़ तैयार करना चाहते हैं?' : '1. Which document do you want to generate?'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <button
            type="button"
            className={`drafter-template-card ${documentType === 'FIR Application' ? 'is-selected' : ''}`}
            onClick={() => setDocumentType('FIR Application')}
            style={{
              border: documentType === 'FIR Application' ? '2px solid var(--primary)' : '1px solid var(--card-border)',
              background: documentType === 'FIR Application' ? 'var(--primary-light)' : 'var(--card-bg)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                {isHindi ? 'पुलिस प्राथमिकी (FIR) शिकायत आवेदन' : 'Police FIR Complaint Application'}
              </strong>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
              {isHindi
                ? 'थाना प्रभारी (SHO) को धारा 173 BNSS के तहत संज्ञेय अपराधों की जांच व कार्रवाई हेतु आवेदन पत्र।'
                : 'Formal application to Jurisdictional SHO under Section 173 BNSS for cognizable offenses, investigation & arrest.'}
            </p>
          </button>

          <button
            type="button"
            className={`drafter-template-card ${documentType === 'Legal Demand Notice' ? 'is-selected' : ''}`}
            onClick={() => setDocumentType('Legal Demand Notice')}
            style={{
              border: documentType === 'Legal Demand Notice' ? '2px solid var(--primary)' : '1px solid var(--card-border)',
              background: documentType === 'Legal Demand Notice' ? 'var(--primary-light)' : 'var(--card-bg)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Scale size={20} color="var(--primary)" />
              <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                {isHindi ? 'विधिक मांग नोटिस (Legal Demand Notice)' : 'Statutory Legal Demand Notice'}
              </strong>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
              {isHindi
                ? 'दूसरी पार्टी को 15 दिन की वैधानिक मोहलत, क्षतिपूर्ति या चेक बाउंस/अनुबंध उल्लंघन की औपचारिक चेतावनी।'
                : 'Formal legal warning giving 15-day cure period before initiating civil suit or criminal prosecution.'}
            </p>
          </button>
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
                background: incidentCategory === cat.id ? 'var(--primary)' : 'var(--card-bg)',
                color: incidentCategory === cat.id ? 'white' : 'var(--text-main)',
                border: incidentCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--card-border)',
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
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
  );
}
