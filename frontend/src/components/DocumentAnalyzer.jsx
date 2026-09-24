import React, { useState } from 'react';
import axios from 'axios';
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Copy,
  Check,
  Sparkles,
  FileText,
  Scale,
  Lightbulb,
  Info,
  RefreshCw
} from 'lucide-react';

const SAMPLE_CONTRACTS = {
  rent: {
    title: "11-Month Residential Rental Agreement",
    title_hi: "11-महीने का आवासीय किराया अनुबंध",
    text: `RENTAL AGREEMENT
This agreement is made on this 1st day of January 2025 between Mr. R. Sharma (hereinafter called the Landlord) and Mr. Amit Verma (hereinafter called the Tenant).

1. The Tenant shall pay a monthly rent of Rs. 28,000 on or before the 5th of each month.
2. The Tenant has deposited a Security Deposit of Rs. 2,00,000. 
3. UNILATERAL FORFEITURE: In case the Tenant vacates the premises before the completion of 11 months, the entire security deposit of Rs. 2,00,000 shall stand automatically forfeited without any compensation or adjustment.
4. INSPECTION & ENTRY: The Landlord reserves the absolute right to inspect the premises at any hour of the day or night without prior notice.
5. REPAIRS & LIABILITY: All structural, electrical, and plumbing repairs of any nature shall be borne 100% by the Tenant alone. The Landlord shall bear zero responsibility for water seepage, electrical hazards, or building structural damage.
6. TERMINATION: The Landlord may terminate this agreement at 24 hours notice at his sole discretion without assigning any reason.
7. JURISDICTION: Any dispute arising out of this agreement shall be subject to the exclusive jurisdiction of the Courts in Singapore.`
  },
  employment: {
    title: "Employment & Service Bond Contract",
    title_hi: "रोजगार व सेवा अनुबंध (जॉब बॉन्ड)",
    text: `EMPLOYMENT & CONFIDENTIALITY AGREEMENT
Between TechSolutions Pvt Ltd ("Employer") and Employee ("Software Engineer").

1. PROBATION & BOND: The Employee agrees to serve the company for a mandatory period of 3 years. If the Employee resigns before 3 years for any reason, the Employee must pay a liquidated penalty of Rs. 5,00,000 and original college educational certificates shall remain in the company's custody until paid.
2. NON-COMPETE RESTRICTION: The Employee agrees that for a period of 2 years after leaving the company, the Employee shall not work for, consult, or engage with any software company, startup, or competitor anywhere in India.
3. WORKING HOURS: Normal working hours are 9:30 AM to 7:00 PM, and Employee agrees to work up to 4 hours of mandatory overtime on weekends without extra overtime remuneration.
4. TERMINATION: The Company may terminate employment immediately without notice and without severance pay at its sole discretion.`
  },
  freelance: {
    title: "Independent Freelancer Service Agreement",
    title_hi: "स्वतंत्र फ्रीलांसर सेवा अनुबंध",
    text: `FREELANCE SERVICES CONTRACT
Client engages Freelancer to deliver UI/UX Design and Frontend code.

1. DELIVERABLES: Freelancer shall deliver unlimited revisions until the Client is subjectively satisfied.
2. UNLIMITED INDEMNITY: Freelancer shall indemnify and hold harmless the Client against any and all losses, claims, third-party lawsuits, damages, and legal costs without any financial cap or limitation of liability.
3. PAYMENT DELAY: Payments shall be made within 90 days of project delivery. If the Client's end-customer delays payment, the Client owes zero fee to the Freelancer.
4. IP OWNERSHIP: All intellectual property, working files, drafts, and prior portfolio works shall become the exclusive worldwide property of the Client immediately upon creation, regardless of whether payment has been cleared.`
  }
};

export default function DocumentAnalyzer({ language = 'English' }) {
  const isHindi = language === 'Hindi';
  const [documentType, setDocumentType] = useState('Rental / Lease Agreement');
  const [documentText, setDocumentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const loadSample = (key) => {
    const sample = SAMPLE_CONTRACTS[key];
    if (sample) {
      setDocumentText(sample.text);
      if (key === 'rent') setDocumentType('Rental / Lease Agreement');
      else if (key === 'employment') setDocumentType('Employment Contract / Bond');
      else setDocumentType('Freelance / Service Agreement');
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError(isHindi ? 'कृपया अनुबंध का टेक्स्ट दर्ज करें।' : 'Please enter or paste the contract text to audit.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8000/api/analyze-contract', {
        document_text: documentText,
        document_type: documentType,
        language: language
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error('Contract audit error:', err);
      setError(isHindi
        ? '[500 Internal Server Error] दस्तावेज विश्लेषण में त्रुटि आई। कृपया पुनः प्रयास करें या बैकएंड की स्थिति जांचें।'
        : '[500 Internal Server Error] Failed to analyze document. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyClause = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRiskBadgeColor = (score) => {
    const s = String(score).toLowerCase();
    if (s.includes('critical')) return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    if (s.includes('high')) return { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' };
    if (s.includes('medium')) return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
    return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="" style={{ padding: '24px', borderRadius: '16px', borderLeft: '5px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', padding: '12px', borderRadius: '14px', color: '#fff' }}>
              <FileSearch size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                {isHindi ? 'AI विधिक दस्तावेज व अनुबंध समीक्षक (Contract Audit)' : 'AI Legal Document & Contract Risk Analyzer'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                {isHindi
                  ? 'भारतीय अनुबंध कानून (Indian Contract Act 1872), मॉडल टेनेंसी एक्ट व उपभोक्ता संरक्षण कानूनों के तहत एकतरफा व गैर-कानूनी शर्तों की जांच करें।'
                  : 'Screen rental deeds, employment bonds, and freelance agreements for unfair clauses, unlawful forfeiture, and Indian statutory compliance.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
            {isHindi ? 'नमूना अनुबंध लोड करें:' : 'Load Sample Contract:'}
          </span>
          <button
            type="button"
            onClick={() => loadSample('rent')}
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: 'var(--primary)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isHindi ? 'आवासीय किराया अनुबंध' : 'Rental Agreement'}
          </button>
          <button
            type="button"
            onClick={() => loadSample('employment')}
            style={{
              background: 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              color: '#ea580c',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isHindi ? 'जॉब व सर्विस बॉन्ड' : 'Employment Bond'}
          </button>
          <button
            type="button"
            onClick={() => loadSample('freelance')}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#059669',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isHindi ? 'फ्रीलांस सर्विस अनुबंध' : 'Freelance Agreement'}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              {isHindi ? 'दस्तावेज का प्रकार' : 'Document Category'}
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                fontSize: '14px',
                outline: 'none',
                color: 'var(--text-main)'
              }}
            >
              <option value="Rental / Lease Agreement">Residential / Commercial Rental Agreement</option>
              <option value="Employment Contract / Bond">Employment Offer, Service Bond & Non-Compete</option>
              <option value="Freelance / Service Agreement">Freelancer / Consultancy / Vendor Agreement</option>
              <option value="Loan & Promissory Note">Personal / Business Loan Deed</option>
              <option value="NDA & Confidentiality">Non-Disclosure Agreement (NDA)</option>
              <option value="General Legal Agreement">General Civil Contract</option>
            </select>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
              {isHindi ? 'अनुबंध का पाठ (Text) पेस्ट करें' : 'Paste Contract Clauses or Agreement Text'}
            </label>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {documentText.length} {isHindi ? 'अक्षर' : 'characters'}
            </span>
          </div>
          <textarea
            rows={8}
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder={isHindi
              ? "यहाँ अनुबंध की शर्तें, एग्रीमेंट का टेक्स्ट अथवा विवादित क्लाउज पेस्ट करें..."
              : "Paste the contract clauses, rent agreement, or employment contract text here to inspect..."}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              background: '#f8fafc',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          {documentText && (
            <button
              type="button"
              onClick={() => { setDocumentText(''); setAnalysis(null); setError(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '13.5px',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              {isHindi ? 'साफ़ करें' : 'Clear'}
            </button>
          )}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 24px',
              fontSize: '14.5px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" />
                {isHindi ? 'कानूनी ऑडिट जारी है...' : 'Auditing Contract...'}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {isHindi ? 'अनुबंध की कानूनी समीक्षा करें' : 'Audit Document for Red Flags'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Scorecard */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  {isHindi ? 'समग्र विधिक जोखिम स्तर' : 'Overall Contract Risk Score'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  {(() => {
                    const badge = getRiskBadgeColor(analysis.risk_score);
                    return (
                      <span style={{
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '15px'
                      }}>
                        {analysis.risk_score} Risk ({analysis.risk_percentage || 50}%)
                      </span>
                    );
                  })()}
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {analysis.red_flags?.length || 0} {isHindi ? 'आपत्तिजनक धाराएं पाई गईं' : 'problematic clauses flagged'}
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>Engine: {analysis.source || 'Indian Legal Audit Engine'}</span>
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginTop: '18px', padding: '14px 18px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                {isHindi ? 'दस्तावेज का सरल सारांश' : 'Plain Language Executive Summary'}
              </h4>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-main)' }}>
                {analysis.summary}
              </p>
            </div>
          </div>

          {/* Red Flags Breakdown */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldAlert size={22} color="#dc2626" />
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-main)' }}>
                {isHindi ? 'चिन्हित आपत्तिजनक शर्तें (Red Flags & Legal Issues)' : 'Flagged Red Flags & Problematic Clauses'}
              </h3>
            </div>

            {analysis.red_flags && analysis.red_flags.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analysis.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #fee2e2',
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14.5px', color: '#991b1b' }}>
                        Clause #{idx + 1}: {flag.clause}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: flag.severity === 'High' ? '#fee2e2' : '#fef9c3',
                        color: flag.severity === 'High' ? '#991b1b' : '#854d0e'
                      }}>
                        {flag.severity || 'Medium'} Severity
                      </span>
                    </div>

                    <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                      <strong>{isHindi ? 'कानूनी समस्या:' : 'Why it is problematic:'}</strong> {flag.issue}
                    </p>

                    {flag.statute && (
                      <div style={{ display: 'inline-block', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                        <strong>{isHindi ? 'लागू भारतीय कानून:' : 'Indian Statute:'}</strong> {flag.statute}
                      </div>
                    )}

                    {flag.fair_alternative && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={14} /> {isHindi ? 'संतुलित वैकल्पिक शर्त (हस्ताक्षर हेतु सुझाई गई):' : 'Recommended Fair Alternative Clause:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyClause(flag.fair_alternative, idx)}
                            style={{
                              background: '#fff',
                              border: '1px solid #86efac',
                              color: '#15803d',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '11.5px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: '600'
                            }}
                          >
                            <Copy size={12} /> {isHindi ? 'कॉपी करें' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#14532d', fontFamily: 'monospace', lineHeight: '1.5' }}>
                          "{flag.fair_alternative}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '16px', background: '#f0fdf4', color: '#166534', borderRadius: '8px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> {isHindi ? 'कोई गंभीर एकतरफा शर्त नहीं मिली।' : 'No egregious statutory red flags detected.'}
              </div>
            )}
          </div>

          {/* Missing Protections & Advice */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Missing Protections */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Lightbulb size={18} color="#eab308" />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isHindi ? 'दस्तावेज में अनुपस्थित सुरक्षाएं' : 'Missing Crucial Protections'}
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.7' }}>
                {analysis.missing_protections?.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                )) || <li>{isHindi ? 'दस्तावेज का ढांचा संतोषजनक है।' : 'Standard clauses present.'}</li>}
              </ul>
            </div>

            {/* Actionable Advice */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Scale size={18} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isHindi ? 'हस्ताक्षर से पूर्व विधिक सलाह' : 'Actionable Negotiation Advice'}
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.7' }}>
                {analysis.actionable_advice?.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
                )) || <li>{isHindi ? 'वकील से परामर्श अवश्य लें।' : 'Verify terms with an advocate.'}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {copiedIndex !== null && (
        <div className="toast-container">
          <div className="toast-message">
            <CheckCircle2 size={18} color="#4ade80" />
            {isHindi ? 'शर्त क्लिपबोर्ड पर कॉपी की गई!' : 'Clause copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
