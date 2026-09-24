import React from 'react';
import { Scale, MessageSquare, Search, FileText, CheckCircle2 } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="section-container">
      <div className="section-header">
        <div className="feature-badge"><Scale size={14} /> Core Capabilities</div>
        <h2 className="section-title">Everything you need for efficient legal work</h2>
        <p className="section-desc">An all-in-one platform combining AI research, document review, and drafting in one seamless experience.</p>
      </div>

      <div className="feature-grid" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
        {/* Feature 1 */}
        <div className="feature-row" style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          <div className="feature-content" style={{ flex: 1 }}>
            <div className="feature-badge"><MessageSquare size={14} /> AI Assistant</div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.85rem', color: '#0f172a' }}>Ask any legal question. Get verified answers.</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              Trained on Indian law including the Indian Penal Code, BNS 2023, Code of Civil Procedure, and Constitution. Provides accurate answers with exact section citations.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Direct statutory citations', 'Plain English & Hindi explanations', 'Case law context & precedents'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                  <CheckCircle2 size={16} color="#2563eb" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="feature-visual" style={{
            flex: 1,
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
            borderRadius: '20px',
            aspectRatio: '4/3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'floatSlow 6s ease-in-out infinite'
          }}>
            <div style={{ width: '85%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', background: '#2563eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={14} color="white" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Legal Research Assistant</div>
              </div>
              <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.82rem', marginBottom: '0.75rem', color: '#334155' }}>
                <strong>Q:</strong> What is Section 420 IPC in the new BNS?
              </div>
              <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.8rem', color: '#1e40af', lineHeight: '1.5' }}>
                <strong>A:</strong> Under the new Bharatiya Nyaya Sanhita (BNS) 2023, Cheating (formerly Section 420 IPC) is governed by <strong>Section 318(4)</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="feature-row" style={{ display: 'flex', alignItems: 'center', gap: '3.5rem', flexDirection: 'row-reverse' }}>
          <div className="feature-content" style={{ flex: 1 }}>
            <div className="feature-badge"><Search size={14} /> Case Law AI</div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.85rem', color: '#0f172a' }}>Search millions of court cases instantly</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              Stop spending hours reading law reports. Our semantic search engine understands the nuance of your case and retrieves relevant precedents from the Supreme Court and High Courts.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Supreme Court & High Court judgments', 'AI-generated headnotes and ratios', 'Filter by court, year, and bench strength'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                  <CheckCircle2 size={16} color="#2563eb" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="feature-visual" style={{
            flex: 1,
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
            borderRadius: '20px',
            aspectRatio: '4/3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'floatSlow 6s ease-in-out infinite'
          }}>
            <div style={{ width: '85%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0f172a' }}>Precedent Discovery</div>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>Match: 98%</span>
              </div>
              <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>State of Haryana v. Bhajan Lal (1992)</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Quashing of FIR under Section 482 CrPC guidelines</div>
              </div>
              <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0f172a' }}>Lalita Kumari v. Govt. of U.P. (2014)</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Mandatory registration of FIR in cognizable offenses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="feature-row" style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          <div className="feature-content" style={{ flex: 1 }}>
            <div className="feature-badge"><FileText size={14} /> Document Review</div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.85rem', color: '#0f172a' }}>Review contracts & documents in minutes</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              Upload any contract, agreement, or petition. Our AI identifies risky clauses, ambiguous language, and non-compliance flags before you sign.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {['Automatic risk scoring for every clause', 'Redlining and suggested improvements', 'PDF & Image document support'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                  <CheckCircle2 size={16} color="#2563eb" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="feature-visual" style={{
            flex: 1,
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.05)',
            borderRadius: '20px',
            aspectRatio: '4/3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'floatSlow 6s ease-in-out infinite'
          }}>
            <div style={{ width: '85%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 8px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600' }}>Contract Audit: NDA_Master.pdf</span>
                <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>2 High Risks</span>
              </div>
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#9f1239' }}>⚠️ Non-Compete Period Excessive</div>
                <div style={{ fontSize: '0.74rem', color: '#e11d48' }}>5-year restraint may be void under Section 27 of Indian Contract Act.</div>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#166534' }}>✓ Governing Law: New Delhi, India</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
