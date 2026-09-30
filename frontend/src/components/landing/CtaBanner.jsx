import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CtaBanner({ onExplore }) {
  return (
    <section className="landing-section" style={{ paddingBottom: '5rem' }}>
      <div style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 25px 65px -15px rgba(11, 19, 41, 0.25)',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* Supreme Court Panoramic Image Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/legal/hero/supreme_court_hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          zIndex: 1
        }} />

        {/* Deep Navy/Twilight Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(8, 15, 36, 0.75) 0%, rgba(8, 15, 36, 0.94) 85%)',
          zIndex: 2
        }} />

        {/* Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '5rem 2rem',
          textAlign: 'center',
          maxWidth: '780px',
          margin: '0 auto',
          color: '#ffffff'
        }}>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 'clamp(2.1rem, 4.4vw, 3.2rem)',
            fontWeight: '600',
            lineHeight: '1.2',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}>
            Ready to transform your legal practice?
          </h2>

          <p style={{
            fontSize: '1.05rem',
            lineHeight: '1.65',
            color: '#cbd5e1',
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
            fontWeight: '400'
          }}>
            Join 10,000+ advocates, corporate counsels, and startups delivering precise legal research in a fraction of the time.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.75rem'
          }}>
            <button
              onClick={onExplore}
              style={{
                background: '#ffffff',
                color: '#1d4ed8',
                padding: '0.85rem 2.4rem',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '1.02rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
              }}
            >
              <span>Start Your 3-Day Free Trial</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Micro-trust indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            color: '#94a3b8'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="#60a5fa" /> No credit card needed
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="#60a5fa" /> Instant Access
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="#60a5fa" /> Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
