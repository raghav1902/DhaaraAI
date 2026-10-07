import React from 'react';
import {
  ArrowRightLeft, ShieldAlert, FileText, Calculator, Lock,
  Cpu, CheckCircle2, Scale, ExternalLink, Sparkles
} from 'lucide-react';

export default function ToolkitSection() {
  const tools = [
    {
      icon: ArrowRightLeft,
      title: 'BNS ↔ IPC Concordance Explorer',
      badge: '2,016+ Mappings',
      desc: 'Seamless transition between IPC 1860, CrPC, IEA and the new BNS 2023, BNSS & BSA frameworks with comparative tables and classification.',
      accent: '#2563eb',
      bg: '#eff6ff',
      tagColor: '#1e40af'
    },
    {
      icon: Scale,
      title: 'AI Statutory & Precedent Intelligence',
      badge: 'SC & 25 High Courts',
      desc: 'Instant answers with verifiable citations from Supreme Court and High Court law reports, bare act provisions, and landmark constitution bench rulings.',
      accent: '#1d4ed8',
      bg: '#eef2ff',
      tagColor: '#3730a3'
    },
    {
      icon: ShieldAlert,
      title: 'Cyber Threat & Exposure Scanner',
      badge: 'IT Act & 1930 Helpline',
      desc: 'Check emails and phone numbers for known data leaks, assess financial fraud exposure, and receive direct remedies under IT Act Sections 66 & 72A.',
      accent: '#ea580c',
      bg: '#fff7ed',
      tagColor: '#9a3412'
    },
    {
      icon: FileText,
      title: 'Court-Ready Smart Legal Drafter',
      badge: 'Bilingual (EN / HI)',
      desc: 'Generate formal Section 138 NI notices, FIR applications, eviction demands, commercial NDAs, and rental deeds formatted for advocate stationery.',
      accent: '#7c3aed',
      bg: '#faf5ff',
      tagColor: '#6b21a8'
    },
    {
      icon: Calculator,
      title: 'Court Fee & Stamp Duty Calculator',
      badge: 'All 28 States & UTs',
      desc: 'Accurately compute ad-valorem court fees, probate rates, and stamp duties across state-specific amendments (Delhi, Bombay, UP, Karnataka, etc.).',
      accent: '#d97706',
      bg: '#fffbeb',
      tagColor: '#92400e'
    },
    {
      icon: Lock,
      title: 'Encrypted Zero-Knowledge Vault',
      badge: 'PIN Protected AES-256',
      desc: 'Confidential client session storage with local encryption, PIN lockout, and zero-knowledge privacy — strictly preventing training on client data.',
      accent: '#0284c7',
      bg: '#f0f9ff',
      tagColor: '#075985'
    }
  ];

  return (
    <section id="toolkit" className="landing-section" style={{
      background: '#ffffff',
      borderRadius: '28px',
      margin: '4rem auto',
      border: '1px solid #e7e3da',
      boxShadow: '0 8px 30px rgba(11, 19, 41, 0.03)',
      padding: '3rem 2.5rem'
    }}>
      {/* Header */}
      <div className="landing-section-header" style={{ textAlign: 'left', maxWidth: '880px', marginBottom: '2.5rem' }}>
        <div className="eyebrow-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          padding: '0.3rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.76rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.75rem'
        }}>
          <Cpu size={14} /> SPECIALIZED LEGAL TOOLKIT
        </div>
        <h2 className="landing-section-title" style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 'clamp(2rem, 3.2vw, 2.7rem)',
          fontWeight: '600',
          color: '#0b1329',
          lineHeight: '1.2',
          margin: '0 0 0.75rem 0'
        }}>
          Everything an Indian Advocate &amp; Legal Team Needs in One Platform
        </h2>
        <p className="landing-section-desc" style={{ margin: 0, maxWidth: '780px', color: '#64748b', fontSize: '1rem', lineHeight: '1.6' }}>
          Eliminate tedious manual searches through fat commentaries. DhaaraAI unifies statutory concordance, bilingual drafting, cyber security, and court fee computation.
        </p>
      </div>

      {/* Grid: 6 Capabilities Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="premium-card"
            style={{
              background: '#faf8f5',
              border: '1px solid #e7e3da',
              borderRadius: '18px',
              padding: '1.65rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: tool.bg,
                  color: tool.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${tool.bg}`
                }}>
                  <tool.icon size={22} />
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: tool.tagColor,
                  background: tool.bg,
                  border: `1px solid ${tool.accent}33`,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  letterSpacing: '0.02em'
                }}>
                  {tool.badge}
                </span>
              </div>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#0b1329',
                marginBottom: '0.5rem',
                lineHeight: '1.3'
              }}>
                {tool.title}
              </h3>

              <p style={{
                color: '#64748b',
                fontSize: '0.86rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {tool.desc}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid #e7e3da',
              fontSize: '0.76rem',
              color: tool.accent,
              fontWeight: '600'
            }}>
              <CheckCircle2 size={13} /> Integrated into DhaaraAI
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
