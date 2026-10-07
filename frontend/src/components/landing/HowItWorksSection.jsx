import React from 'react';
import { Layers, FileUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: '1',
      icon: FileUp,
      title: 'Query or Case Upload',
      desc: 'Enter statutory queries, or upload trial court orders, contracts, and FIR briefs in PDF or Word formats.',
      accent: '#2563eb',
      bg: '#eff6ff'
    },
    {
      num: '2',
      icon: Sparkles,
      title: 'Statutory Synthesis',
      desc: 'Our engine indexes Supreme Court & High Court precedents alongside the Bharatiya Nyaya Sanhita (BNS 2023) framework.',
      accent: '#1d4ed8',
      bg: '#eff6ff'
    },
    {
      num: '3',
      icon: CheckCircle2,
      title: 'Actionable Legal Output',
      desc: 'Receive structured citations, paragraph references, contractual risk audits, and court-ready drafts in seconds.',
      accent: '#059669',
      bg: '#ecfdf5'
    }
  ];

  return (
    <section id="how-it-works" className="landing-section" style={{
      background: '#ffffff',
      borderRadius: '28px',
      margin: '4rem auto',
      border: '1px solid #e7e3da',
      boxShadow: '0 8px 30px rgba(11, 19, 41, 0.03)'
    }}>
      {/* Header */}
      <div className="landing-section-header" style={{ textAlign: 'left', maxWidth: '850px' }}>
        <div className="eyebrow-badge">
          <Layers size={14} /> HOW IT WORKS
        </div>
        <h2 className="landing-section-title">
          From legal query to actionable intelligence in three simple steps
        </h2>
        <p className="landing-section-desc" style={{ margin: 0, maxWidth: '780px' }}>
          Streamline statutory research, contract analysis, and draft preparation through verified Indian legal data.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 0.75fr',
        gap: '3rem',
        alignItems: 'center'
      }} className="how-it-works-grid">
        {/* Left: 3 Connected Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          position: 'relative'
        }} className="steps-cards-row">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="premium-card"
              style={{
                position: 'relative',
                padding: '1.75rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                background: '#faf8f5',
                border: '1px solid #e7e3da'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step.accent,
                  color: 'white',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '800',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 10px ${step.accent}33`
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: step.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.accent
                }}>
                  <step.icon size={18} />
                </div>
              </div>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#0b1329',
                marginBottom: '0.65rem',
                lineHeight: 1.3
              }}>
                {step.title}
              </h3>

              <p style={{
                color: '#64748b',
                fontSize: '0.86rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Architectural Illustration of Supreme Court */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #e7e3da',
          background: '#faf8f5',
          boxShadow: '0 10px 25px rgba(11, 19, 41, 0.04)',
          display: 'flex',
          flexDirection: 'column'
        }} className="architectural-vignette">
          <div style={{ position: 'relative' }}>
            <img
              src="/assets/legal/how/court_dome_sketch.jpg"
              alt="Supreme Court of India Architectural Sketch"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '270px',
                objectFit: 'cover'
              }}
            />
            {/* Soft parchment gradient blend */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(180deg, rgba(250, 248, 245, 0.1) 0%, rgba(250, 248, 245, 0.8) 95%)'
            }} />
          </div>

          <div style={{
            padding: '1.25rem 1.5rem',
            background: '#ffffff',
            borderTop: '1px solid #e7e3da',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.18rem',
              color: '#1e3a8a',
              fontWeight: '700',
              margin: '0 0 0.25rem 0',
              lineHeight: 1.2
            }}>
              “Grounded in the Indian Constitution. Powered by AI”
            </p>
            <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
              Supreme Court of India • New Delhi
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
          .steps-cards-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
