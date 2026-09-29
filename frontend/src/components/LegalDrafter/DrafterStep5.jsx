import React from 'react';
import {
  CheckCircle2, Copy, Check, Printer, Download,
  ShieldCheck, RotateCcw
} from 'lucide-react';

export default function DrafterStep5({
  generatedResult,
  documentType,
  copied,
  handleCopy,
  handlePrint,
  handleExportDoc,
  handleExportPdf,
  handleSaveToVault,
  setStep,
  setGeneratedResult,
  isHindi
}) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Action Toolbar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', background: 'var(--card-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#166534', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> {isHindi ? 'ड्राफ्ट तैयार है' : 'Draft Generated'}
          </span>
          {generatedResult.sections_referenced && generatedResult.sections_referenced.length > 0 && (
            <span style={{ fontSize: '12px', color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: '12px' }}>
              {generatedResult.sections_referenced.join(', ')}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: copied ? '#10b981' : 'var(--subtle-bg)',
              color: copied ? 'white' : 'var(--text-main)',
              border: '1px solid var(--card-border)',
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
            {isHindi ? 'Word (.doc)' : 'Word (.doc)'}
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
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
            title={isHindi ? 'PDF प्रारूप डाउनलोड करें' : 'Download PDF format'}
          >
            <Download size={16} />
            {isHindi ? 'PDF डाउनलोड' : 'Download PDF'}
          </button>

          <button
            type="button"
            onClick={handleSaveToVault}
            style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
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
            title={isHindi ? 'वॉल्ट में सुरक्षित करें' : 'Save to Vault'}
          >
            <ShieldCheck size={16} />
            {isHindi ? 'वॉल्ट में सहेजें' : 'Save to Vault'}
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

        <div style={{ textAlign: 'justify' }}>
          {generatedResult.draft}
        </div>

        <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px dashed #94a3b8', fontSize: '11px', color: '#64748b', textAlign: 'center', fontFamily: 'sans-serif' }}>
          {isHindi
            ? 'यह विधिक प्रारूप भारतीय संसद द्वारा पारित भारतीय न्याय संहिता (BNS 2023) एवं भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) के प्रावधानों के अनुरूप तैयार किया गया है।'
            : 'This statutory document is drafted in strict adherence to Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) and Bharatiya Nyaya Sanhita (BNS 2023).'}
        </div>
      </div>
    </div>
  );
}
