import React from 'react';
import { FileText, Check, Sparkles } from 'lucide-react';

export function DrafterHeader({ language, onLanguageChange, isHindi, onNewDraft }) {
  return (
    <div className="drafter-header" style={{
      padding: '16px 20px',
      borderRadius: '16px',
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: 'var(--card-shadow)',
      flexShrink: 0,
      minHeight: '76px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2, flex: 1, minWidth: 0 }}>
        <div style={{
          background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
          color: 'white',
          padding: '10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)'
        }}>
          <FileText size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
              {isHindi ? 'स्वचालित FIR एवं विधिक नोटिस ड्राफ्टर' : 'Automated FIR & Legal Notice Drafter'}
            </h2>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            {isHindi ? 'धारा 173 BNSS एवं भारतीय न्याय संहिता (BNS 2023) के प्रमाणित प्रारूप' : 'Statutory procedural formats under Section 173 BNSS & BNS 2023'}
          </p>
        </div>
      </div>
      <div className="drafter-header-visual" aria-hidden="true">
        <img
          src="/assets/legal/drafting/drafting_desk.webp"
          alt=""
          className="drafter-header-image"
          loading="lazy"
        />
        <div className="drafter-header-gradient" />
      </div>
    </div>
  );
}

export function DrafterProgress({ step, setStep, isHindi, onLoadPreset }) {
  const steps = [
    { num: 1, labelEn: 'Document & Type', labelHi: 'दस्तावेज़ का प्रकार' },
    { num: 2, labelEn: 'Parties Details', labelHi: 'पक्षकारों का विवरण' },
    { num: 3, labelEn: 'Incident & Evidence', labelHi: 'घटना व साक्ष्य' },
    { num: 4, labelEn: 'Review & Draft', labelHi: 'समीक्षा व प्रारूप' }
  ];

  return (
    <>
      <div className="drafter-presets" style={{ background: 'var(--primary-light)', border: '1px dashed var(--primary-border)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={15} /> {isHindi ? 'त्वरित नमूना भरें:' : 'Quick Sample Autofill:'}
        </span>
        <button
          type="button"
          onClick={() => onLoadPreset('cyber')}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '500' }}
        >
          {isHindi ? 'साइबर ठगी FIR' : 'Cyber Fraud FIR'}
        </button>
        <button
          type="button"
          onClick={() => onLoadPreset('cheque')}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '500' }}
        >
          {isHindi ? 'चेक बाउंस नोटिस' : 'Cheque Bounce Notice'}
        </button>
        <button
          type="button"
          onClick={() => onLoadPreset('tenant')}
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: 'var(--text-main)', fontWeight: '500' }}
        >
          {isHindi ? 'किराया डिपॉजिट नोटिस' : 'Tenant Deposit Notice'}
        </button>
      </div>

      <div className="drafter-stepper" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '14px 0 20px', padding: '0 12px' }}>
        <div
          style={{
            position: 'absolute',
            top: '17px',
            left: '32px',
            right: '32px',
            height: '3px',
            background: 'var(--card-border)',
            zIndex: 0
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '17px',
            left: '32px',
            width: `${((step - 1) / 3) * 82}%`,
            height: '3px',
            background: 'var(--primary)',
            zIndex: 0,
            transition: 'width 0.3s ease'
          }}
        />

        {steps.map(s => (
          <div
            key={s.num}
            className={`drafter-step ${step === s.num ? 'is-current' : step > s.num ? 'is-complete' : ''}`}
            onClick={() => s.num < step && setStep(s.num)}
            style={{
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: s.num < step ? 'pointer' : 'default',
              maxWidth: '85px',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: step > s.num ? 'var(--accent)' : step === s.num ? 'var(--primary)' : 'var(--card-bg)',
              border: step >= s.num ? 'none' : '2px solid var(--card-border)',
              color: step >= s.num ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '13px',
              boxShadow: step === s.num ? '0 0 0 4px var(--primary-light)' : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}>
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span style={{ fontSize: '11px', lineHeight: '1.2', fontWeight: step === s.num ? '700' : '500', color: step === s.num ? 'var(--primary)' : 'var(--text-muted)' }}>
              {isHindi ? s.labelHi : s.labelEn}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
