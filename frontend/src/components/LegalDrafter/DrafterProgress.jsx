import React from 'react';
import { FileText, Check, Sparkles } from 'lucide-react';

export function DrafterHeader({ language, onLanguageChange, isHindi }) {
  return (
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
      <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed rgba(59, 130, 246, 0.25)', borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={15} /> {isHindi ? 'त्वरित नमूना भरें:' : 'Quick Sample Autofill:'}
        </span>
        <button
          type="button"
          onClick={() => onLoadPreset('cyber')}
          style={{ background: 'white', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}
        >
          {isHindi ? 'साइबर ठगी FIR' : 'Cyber Fraud FIR'}
        </button>
        <button
          type="button"
          onClick={() => onLoadPreset('cheque')}
          style={{ background: 'white', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}
        >
          {isHindi ? 'चेक बाउंस नोटिस' : 'Cheque Bounce Notice'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '10px 0 20px', padding: '0 20px' }}>
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '40px',
            right: '40px',
            height: '3px',
            background: '#e2e8f0',
            zIndex: 0
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '40px',
            width: `${((step - 1) / 3) * 80}%`,
            height: '3px',
            background: 'var(--primary)',
            zIndex: 0,
            transition: 'width 0.3s ease'
          }}
        />

        {steps.map(s => (
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
    </>
  );
}
