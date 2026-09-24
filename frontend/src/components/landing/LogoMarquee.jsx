import React from 'react';
import { Scale, BookOpen, ShieldCheck, FileCheck, Award, Zap, Building2, Landmark } from 'lucide-react';

const TRUST_PARTNERS = [
  { icon: Scale, text: 'Supreme Court Bar Advocates', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.08)' },
  { icon: BookOpen, text: 'Bar Council of India Fellows', color: '#059669', bg: 'rgba(5, 150, 105, 0.08)' },
  { icon: ShieldCheck, text: 'National Law School Scholars', color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)' },
  { icon: FileCheck, text: 'High Court Legal Aid Clinics', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.08)' },
  { icon: Award, text: 'BNS 2023 Transition Cell', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.08)' },
  { icon: Zap, text: 'YC & Top Tech Legal Counsels', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.08)' },
  { icon: Building2, text: 'Tier-1 Corporate In-House Teams', color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.08)' },
  { icon: Landmark, text: 'District Court Legal Desks', color: '#0d9488', bg: 'rgba(13, 148, 136, 0.08)' }
];

export default function LogoMarquee() {
  return (
    <div style={{
      overflow: 'hidden',
      padding: '1.75rem 0',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      {/* Title with clean badge accent */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#3b82f6'
        }} />
        <span style={{
          fontSize: '0.74rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#64748b'
        }}>
          Trusted by practitioners and legal scholars across India
        </span>
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#3b82f6'
        }} />
      </div>

      {/* Marquee with fade mask */}
      <div style={{
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
      }}>
        <div className="marquee-track" style={{ display: 'flex', gap: '1.25rem', width: 'max-content' }}>
          {[...Array(3)].map((_, loopIdx) => (
            <div key={loopIdx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {TRUST_PARTNERS.map((partner, pIdx) => {
                const IconComponent = partner.icon;
                return (
                  <div
                    key={pIdx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '9999px',
                      padding: '0.45rem 1rem 0.45rem 0.65rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      cursor: 'default'
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
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      color: '#334155',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap'
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
    </div>
  );
}
