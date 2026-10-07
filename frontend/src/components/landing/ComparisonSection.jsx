import React from 'react';
import { Scale, X, Check } from 'lucide-react';

export default function ComparisonSection() {
  const traditionalPoints = [
    'Hours spent thumbing through physical digests & law journals',
    'Risk of citing repealed IPC provisions post-July 2024 reform',
    'Disjointed state-by-state court fee circulars & probate charts',
    'Manual first-drafting of routine Section 138 notices and petitions',
    'Fragmented precedent retrieval across multiple court databases'
  ];

  const dhaaraPoints = [
    'Semantic precedent retrieval with verified SC & HC citations in seconds',
    'Automated BNS ↔ IPC concordance across 2,016+ statutory provisions',
    'Unified 28-State & UT court fee and stamp duty valuation engine',
    'Court-ready bilingual draft generation (FIRs, NDAs, statutory notices)',
    'Zero-retention client confidentiality aligned with attorney-client privilege'
  ];

  return (
    <section id="comparison" className="landing-section">
      {/* Header */}
      <div className="landing-section-header">
        <div className="eyebrow-badge">
          <Scale size={14} /> THE COMPETITIVE ADVANTAGE
        </div>
        <h2 className="landing-section-title">
          Traditional Legal Research vs. DhaaraAI
        </h2>
        <p className="landing-section-desc">
          See how modern AI infrastructure transforms time-sink administrative tasks into high-leverage legal counsel.
        </p>
      </div>

      {/* 2-Column Container: Comparison Split on Left, Photo & Quote on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 0.75fr',
        gap: '2.5rem',
        alignItems: 'stretch'
      }} className="comparison-layout-grid">

        {/* Left: Two-sided comparison box with VS badge */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e7e3da',
          boxShadow: '0 10px 35px rgba(11, 19, 41, 0.04)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative'
        }} className="comparison-split-box">

          {/* VS Center Badge */}
          <div className="comparison-vs-badge" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#1d4ed8',
            color: 'white',
            fontWeight: '800',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(29, 78, 216, 0.35)',
            zIndex: 10,
            border: '3px solid #ffffff'
          }}>
            VS
          </div>

          {/* Left Column: Traditional Legal Work */}
          <div style={{
            background: '#fffdfd',
            padding: '2.25rem 2rem',
            borderRight: '1px solid #fee2e2',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#dc2626',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '700',
              fontSize: '1.15rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <X size={16} color="#dc2626" />
              </div>
              <span>Traditional Legal Work</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {traditionalPoints.map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#fef2f2',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    ✕
                  </div>
                  <span style={{ color: '#475569', fontSize: '0.86rem', lineHeight: '1.5' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: With DhaaraAI */}
          <div style={{
            background: '#f0fdf4',
            padding: '2.25rem 2rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#059669',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '700',
              fontSize: '1.15rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check size={16} color="#059669" />
              </div>
              <span>With DhaaraAI</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {dhaaraPoints.map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    ✓
                  </div>
                  <span style={{ color: '#14532d', fontSize: '0.86rem', fontWeight: '500', lineHeight: '1.5' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Authentic Scales of Justice Image & Serif Quote */}
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid #e7e3da',
          background: '#070e20',
          boxShadow: '0 14px 40px rgba(11, 19, 41, 0.12)',
          display: 'flex',
          flexDirection: 'column'
        }} className="scales-photo-card">
          <img
            src="/assets/legal/comparison/scales_of_justice.jpg"
            alt="Brass scales of justice on antique Indian legal reports"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              minHeight: '380px'
            }}
          />
          {/* Dark luxury vignette overlay */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(180deg, rgba(7, 14, 32, 0.2) 0%, rgba(7, 14, 32, 0.85) 90%)'
          }} />

          {/* Golden Serif Quotation Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '1.75rem',
            right: '1.75rem',
            textAlign: 'center',
            zIndex: 10
          }}>
            <h3 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.45rem',
              color: '#fef08a',
              fontWeight: '600',
              fontStyle: 'italic',
              margin: '0 0 0.4rem 0',
              lineHeight: 1.25,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              “Same Law. Smarter Research.”
            </h3>
            <p style={{
              color: '#cbd5e1',
              fontSize: '0.8rem',
              margin: 0,
              letterSpacing: '0.04em'
            }}>
              Accelerating Indian jurisprudence without compromising accuracy.
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .comparison-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .comparison-split-box {
            grid-template-columns: 1fr !important;
          }
          .comparison-split-box > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid #fee2e2;
          }
          .comparison-split-box > div {
            padding: 1.5rem 1.25rem !important;
          }
          .comparison-vs-badge {
            display: none !important;
          }
          .scales-photo-card img {
            min-height: 250px !important;
          }
          .scales-photo-card h3 {
            font-size: 1.45rem !important;
          }
          .scales-photo-card > div:last-child {
            bottom: 1.25rem !important;
            left: 1rem !important;
            right: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
