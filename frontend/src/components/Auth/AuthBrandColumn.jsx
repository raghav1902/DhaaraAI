import React from 'react';
import { Scale, Check } from 'lucide-react';

export default function AuthBrandColumn() {
  return (
    <section className="auth-brand-col">
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* DhaaraAI Logo */}
        <div className="auth-brand-logo-wrap" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: '#1d4ed8',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)'
          }}>
            <Scale size={18} />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.35rem',
            fontWeight: '800',
            color: '#0b1329',
            letterSpacing: '-0.02em'
          }}>
            Dhaara<span style={{ color: '#1d4ed8' }}>AI</span>
          </span>
        </div>

        {/* Short Stately Headline */}
        <h1 style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 'clamp(1.85rem, 2.6vw, 2.35rem)',
          fontWeight: '600',
          lineHeight: '1.25',
          color: '#0b1329',
          margin: '0 0 1.25rem 0',
          letterSpacing: '-0.02em'
        }}>
          India’s Legal Intelligence,<br />
          <span style={{ color: '#1d4ed8' }}>Built for Indian Law.</span>
        </h1>

        {/* 2-3 Short Benefit Points */}
        <div className="auth-brand-benefits" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          marginTop: '1.5rem',
          maxWidth: '380px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <Check size={12} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
              Native BNS 2023 & IPC statutory concordance
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <Check size={12} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
              Supreme Court & High Court verified precedents
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px'
            }}>
              <Check size={12} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
              Private legal workspace with zero AI training retention
            </span>
          </div>
        </div>

        {/* Chamber Trust Assurance Box */}
        <div className="auth-brand-trust-box" style={{
          marginTop: '1.75rem',
          padding: '0.85rem 1rem',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          border: '1px solid #e7e3da',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          maxWidth: '380px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1e293b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Judicial Research Grade
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.79rem', color: '#64748b', lineHeight: '1.45' }}>
            Conforms with DPDP Act 2023 data residency. Client briefs & vault uploads are private with zero LLM model retention.
          </p>
        </div>
      </div>

      {/* Background Illustration blended softly at column base */}
      <div className="auth-bg-art" aria-hidden="true" />
    </section>
  );
}
