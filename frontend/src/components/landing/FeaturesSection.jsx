import React from 'react';
import { Scale, MessageSquare, Search, FileText, CheckCircle2 } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-section-header">
        <div className="eyebrow-badge">
          <Scale size={14} /> DEEP-DIVE CAPABILITIES
        </div>
        <h2 className="landing-section-title">
          Engineered for Advocates, Legal Teams & Judiciary Researchers
        </h2>
        <p className="landing-section-desc">
          High-precision Indian legal intelligence designed to eliminate cognitive fatigue and cite authoritative law reports.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
        {/* Feature 1: AI Assistant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }} className="feature-row">
          <div style={{ flex: 1 }}>
            <div className="eyebrow-badge" style={{ marginBottom: '0.85rem' }}>
              <MessageSquare size={14} /> AI Assistant
            </div>
            <h3 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.55rem',
              color: '#0b1329',
              marginBottom: '0.85rem',
              lineHeight: 1.25,
              fontWeight: 600
            }}>
              Ask any legal question. Get verified statutory answers.
            </h3>
            <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Trained extensively on Indian statutory codes including the Bharatiya Nyaya Sanhita (BNS 2023), Indian Penal Code, Code of Criminal Procedure, CPC, and the Constitution of India.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Direct section citations with authentic law report headnotes',
                'Bilingual clarity in plain English and Hindi legal terminology',
                'Comprehensive concordance across old and new statutory frameworks'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: '500' }}>
                  <CheckCircle2 size={16} color="#1d4ed8" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid #e7e3da',
            borderRadius: '22px',
            padding: '2rem',
            boxShadow: '0 12px 35px rgba(11, 19, 41, 0.04)',
            animation: 'floatSlow 7s ease-in-out infinite'
          }}>
            <div style={{
              background: '#faf8f5',
              border: '1px solid #e7e3da',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                <div style={{ width: '28px', height: '28px', background: '#1d4ed8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Scale size={15} />
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: '700', color: '#0b1329' }}>
                  Legal Research Assistant
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', marginBottom: '0.85rem', color: '#0b1329' }}>
                <span style={{ color: '#1d4ed8', fontWeight: '700' }}>Q:</span> What is the sentencing difference for Cheating between IPC 420 and BNS 318?
              </div>

              <div style={{ background: '#eff6ff', padding: '0.95rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.82rem', color: '#1e3a8a', lineHeight: '1.55' }}>
                <strong>A:</strong> Under <strong>Section 318(4) of BNS 2023</strong>, the punishment remains imprisonment up to seven years and fine, but incorporates community service discretion for minor property claims under subsection (2).
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Precedent Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem', flexDirection: 'row-reverse' }} className="feature-row">
          <div style={{ flex: 1 }}>
            <div className="eyebrow-badge" style={{ marginBottom: '0.85rem' }}>
              <Search size={14} /> Case Law Semantic Discovery
            </div>
            <h3 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.55rem',
              color: '#0b1329',
              marginBottom: '0.85rem',
              lineHeight: 1.25,
              fontWeight: 600
            }}>
              Search millions of court cases with semantic understanding.
            </h3>
            <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Stop wasting hours flipping through printed digests. Our semantic neural index retrieves landmark Supreme Court and High Court precedents based on the factual core of your brief.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Full coverage of Supreme Court & 25 High Courts from 1950 to 2026',
                'AI-generated headnotes, legal ratios, and overruled flags',
                'Bench strength filtering: 2-judge, 3-judge, and Constitution Benches'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: '500' }}>
                  <CheckCircle2 size={16} color="#1d4ed8" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid #e7e3da',
            borderRadius: '22px',
            padding: '2rem',
            boxShadow: '0 12px 35px rgba(11, 19, 41, 0.04)',
            animation: 'floatSlow 7s ease-in-out infinite 1s'
          }}>
            <div style={{
              background: '#faf8f5',
              border: '1px solid #e7e3da',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: '700', color: '#0b1329' }}>
                  Precedent Discovery Output
                </div>
                <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                  Match: 99.2%
                </span>
              </div>

              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e7e3da', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0b1329' }}>
                  State of Haryana v. Bhajan Lal (1992) Supp (1) SCC 335
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Supreme Court criteria for quashing criminal complaints under inherent powers.
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e7e3da' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0b1329' }}>
                  Lalita Kumari v. Govt. of U.P. (2014) 2 SCC 1
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Mandatory registration of FIR under Section 154 CrPC (BNSS § 173).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Contract Audit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }} className="feature-row">
          <div style={{ flex: 1 }}>
            <div className="eyebrow-badge" style={{ marginBottom: '0.85rem' }}>
              <FileText size={14} /> Contract Risk Review
            </div>
            <h3 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.55rem',
              color: '#0b1329',
              marginBottom: '0.85rem',
              lineHeight: 1.25,
              fontWeight: 600
            }}>
              Audit contracts, redline clauses, and detect hidden liabilities.
            </h3>
            <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Upload any agreement, lease deed, or commercial contract. Our model highlights risky clauses, void non-compete terms under Section 27, and ambiguous dispute resolution mechanisms.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Instant risk scoring (Low, Medium, Critical) across every paragraph',
                'Suggested redlines aligned with Indian Contract Act precedents',
                'Native PDF and scanned image OCR with high precision'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#1e293b', fontWeight: '500' }}>
                  <CheckCircle2 size={16} color="#1d4ed8" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid #e7e3da',
            borderRadius: '22px',
            padding: '2rem',
            boxShadow: '0 12px 35px rgba(11, 19, 41, 0.04)',
            animation: 'floatSlow 7s ease-in-out infinite 2s'
          }}>
            <div style={{
              background: '#faf8f5',
              border: '1px solid #e7e3da',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: '700', color: '#0b1329' }}>
                  Audit: Master_Vendor_Agreement.pdf
                </span>
                <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                  2 Critical Flags
                </span>
              </div>

              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9f1239' }}>
                  ⚠️ Unilateral Dispute Forum Clause
                </div>
                <div style={{ fontSize: '0.74rem', color: '#be123c', marginTop: '2px' }}>
                  Dispute resolution clause deprives one party of parity under Indian Arbitration Act.
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534' }}>
                  ✓ Limitation of Liability Capped at 100% Fees
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Standard commercial allocation verified.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .feature-row {
            flex-direction: column !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
