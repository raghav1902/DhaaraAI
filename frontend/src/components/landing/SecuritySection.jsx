import React from 'react';
import { ShieldCheck, Lock, Award, Shield } from 'lucide-react';

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'AES-256 Encryption',
      desc: 'All uploads and queries encrypted at rest and in transit via TLS 1.3.',
      accent: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)'
    },
    {
      icon: Lock,
      title: 'Zero Data Retention',
      desc: 'Files are not used to train public AI models. Strictly session-isolated.',
      accent: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)'
    },
    {
      icon: Award,
      title: 'Privileged Work-Product',
      desc: 'Built to align with Attorney-Client Privilege and India’s DPDP Act.',
      accent: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.12)'
    }
  ];

  return (
    <section id="security" className="landing-section">
      <div style={{
        background: 'linear-gradient(135deg, #070e20 0%, #0a1532 50%, #0c1a40 100%)',
        borderRadius: '28px',
        padding: '4rem 2.5rem',
        color: '#ffffff',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: '0 25px 65px -15px rgba(7, 14, 32, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative mesh background glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '10%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Content Layout: Shield on left, text & 3 cards on right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr',
          gap: '3rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }} className="security-inner-grid">

          {/* Big Glowing Digital Shield Emblem */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }} className="security-shield-col">
            <div style={{
              width: '120px',
              height: '130px',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.35) 0%, rgba(14, 165, 233, 0.1) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.25), inset 0 0 20px rgba(56, 189, 248, 0.15)',
              position: 'relative'
            }}>
              <Shield size={64} color="#60a5fa" strokeWidth={1.5} />
              <Lock size={26} color="#ffffff" style={{ position: 'absolute' }} />
            </div>
            <span style={{
              fontSize: '0.72rem',
              color: '#93c5fd',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: '700',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              DPDP Compliant
            </span>
          </div>

          {/* Right: Text and 3 Dark Glass Feature Cards */}
          <div>
            <div className="eyebrow-badge dark-mode" style={{ marginBottom: '0.85rem' }}>
              <ShieldCheck size={14} /> BUILT-IN SECURITY & PRIVILEGE
            </div>
            <h2 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)',
              fontWeight: '600',
              lineHeight: '1.2',
              color: '#ffffff',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em'
            }}>
              Your Client Documents Are Strictly Confidential
            </h2>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.96rem',
              lineHeight: '1.6',
              maxWidth: '720px',
              margin: '0 0 2rem 0'
            }}>
              DhaaraAI is engineered with military-grade encryption and zero public training retention. Your legal data stays yours, always.
            </p>

            {/* 3 Dark Glass Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.25rem'
            }} className="security-cards-row">
              {securityFeatures.map((feat, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.4rem',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: feat.bg,
                    color: feat.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <feat.icon size={20} />
                  </div>
                  <h4 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.02rem',
                    color: '#ffffff',
                    fontWeight: '700',
                    marginBottom: '0.4rem'
                  }}>
                    {feat.title}
                  </h4>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    lineHeight: '1.55',
                    margin: 0
                  }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .security-inner-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .security-shield-col {
            margin: 0 auto;
          }
          .security-cards-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
