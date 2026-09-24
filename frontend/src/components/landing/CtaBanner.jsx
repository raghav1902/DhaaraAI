import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner({ onExplore }) {
  return (
    <section className="section-container" style={{ paddingBottom: '5rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
        borderRadius: '26px',
        padding: '4.5rem 2.5rem',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 25px 60px -12px rgba(37, 99, 235, 0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative shapes */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: '800', marginBottom: '1rem', color: 'white', lineHeight: '1.2' }}>
            Ready to transform your legal practice?
          </h2>
          <p style={{ fontSize: '1.02rem', opacity: 0.92, marginBottom: '2.25rem', lineHeight: '1.6' }}>
            Join 10,000+ advocates, corporate counsels, and startups delivering precise legal research in a fraction of the time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onExplore} style={{
              background: 'white',
              color: '#1e40af',
              padding: '0.85rem 2.25rem',
              borderRadius: '999px',
              fontWeight: '700',
              fontSize: '1.05rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Start Your 3-Day Free Trial <ArrowRight size={18} />
            </button>
          </div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.82rem', opacity: 0.85 }}>
            Instant access • No credit card required • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
