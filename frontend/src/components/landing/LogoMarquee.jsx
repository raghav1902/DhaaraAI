import React from 'react';
import { Users, BookOpen, Star, Scale, ShieldCheck, FileCheck, Landmark, Building2 } from 'lucide-react';

const INSTITUTIONAL_PARTNERS = [
  { icon: Scale, text: 'Supreme Court Bar Advocates', color: '#1d4ed8', bg: '#eff6ff' },
  { icon: Landmark, text: 'High Court Practitioners (Delhi, Bombay, Madras)', color: '#059669', bg: '#ecfdf5' },
  { icon: BookOpen, text: 'National Law School Scholars (NLSIU, NALSAR)', color: '#d97706', bg: '#fffbeb' },
  { icon: FileCheck, text: 'BNS 2023 Statutory Transition Cell', color: '#dc2626', bg: '#fef2f2' },
  { icon: ShieldCheck, text: 'Legal Aid & Human Rights Clinics', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Building2, text: 'Tier-1 Corporate In-House Counsels', color: '#0284c7', bg: '#f0f9ff' }
];

export default function LogoMarquee() {
  return (
    <div style={{
      background: '#ffffff',
      borderTop: '1px solid #e7e3da',
      borderBottom: '1px solid #e7e3da',
      padding: '2.5rem 1.5rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '3rem',
        alignItems: 'center'
      }} className="trust-strip-grid">
        {/* Left: 3 Core Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.75rem',
          flexWrap: 'wrap'
        }} className="trust-metrics-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#1d4ed8" />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: '800', color: '#0b1329', lineHeight: 1 }}>
                10,000+
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>
                Legal Professionals
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="#059669" />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: '800', color: '#0b1329', lineHeight: 1 }}>
                2.4M+
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>
                Statutes & Precedents
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: '800', color: '#0b1329', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                4.9<span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: '600' }}>/5</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500', marginTop: '0.25rem' }}>
                Advocate Rating
              </div>
            </div>
          </div>
        </div>

        {/* Right: Badges & Label */}
        <div style={{
          borderLeft: '1px solid #e7e3da',
          paddingLeft: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }} className="trust-badges-wrapper">
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: '700' }}>
            Trusted by practitioners and legal scholars across India
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ea580c' }} />
              Law School Students
            </span>
            <span style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #f3e8ff', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9333ea' }} />
              Legal Aid Clinics
            </span>
            <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              BNS/BNSS Transition Cell
            </span>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />
              Corporate Legal Teams
            </span>
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px dashed #e7e3da',
        overflow: 'hidden',
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}>
        <div className="marquee-track" style={{ display: 'flex', gap: '1.25rem', width: 'max-content' }}>
          {[...Array(3)].map((_, loopIdx) => (
            <div key={loopIdx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {INSTITUTIONAL_PARTNERS.map((partner, pIdx) => {
                const IconComponent = partner.icon;
                return (
                  <div
                    key={pIdx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      background: '#fcfbf9',
                      border: '1px solid #e7e3da',
                      borderRadius: '999px',
                      padding: '0.45rem 1.15rem 0.45rem 0.75rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: partner.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComponent size={14} color={partner.color} />
                    </div>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      color: '#334155'
                    }}>
                      {partner.text}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .trust-strip-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }
          .trust-badges-wrapper {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid #e7e3da;
            padding-top: 1.5rem;
          }
        }
        @media (max-width: 640px) {
          .trust-metrics-container {
            gap: 1.5rem !important;
            justifyContent: space-between;
          }
        }
      `}</style>
    </div>
  );
}
