import React from 'react';
import { ArrowRightLeft, ShieldAlert, Globe, FileText, Calculator, Lock, Cpu, CheckCircle } from 'lucide-react';

export default function ToolkitSection() {
  const tools = [
    {
      icon: ArrowRightLeft,
      title: 'BNS ↔ IPC Converter',
      desc: 'Transition to the 2023 legal framework with comparative tables and instant mapping.',
      accent: '#2563eb',
      bg: '#eff6ff'
    },
    {
      icon: ShieldAlert,
      title: 'Citizen Rights & Legal SOS',
      desc: 'Know your rights during traffic stops, police inquiries, and emergency situations.',
      accent: '#ea580c',
      bg: '#fff7ed'
    },
    {
      icon: Globe,
      title: 'Cyber Threat Scanner',
      desc: 'Audit suspicious links, fraud claims, and investment schemes against IT Act rules.',
      accent: '#059669',
      bg: '#ecfdf5'
    },
    {
      icon: FileText,
      title: 'Smart Legal Drafting',
      desc: 'Generate court-formatted FIRs, legal notices, agreements, and petitions in minutes.',
      accent: '#7c3aed',
      bg: '#faf5ff'
    },
    {
      icon: Calculator,
      title: 'Court Fee & Stamp Calculator',
      desc: 'Accurately compute court fees and stamp duty across all 28 Indian states & UTs.',
      accent: '#d97706',
      bg: '#fffbeb'
    },
    {
      icon: Lock,
      title: 'Encrypted Legal Vault',
      desc: 'Securely store client documents with PIN protection and zero-knowledge local encryption.',
      accent: '#0284c7',
      bg: '#f0f9ff'
    }
  ];

  return (
    <section id="toolkit" className="landing-section" style={{
      background: '#ffffff',
      borderRadius: '28px',
      margin: '4rem auto',
      border: '1px solid #e7e3da',
      boxShadow: '0 8px 30px rgba(11, 19, 41, 0.03)'
    }}>
      {/* Header */}
      <div className="landing-section-header" style={{ textAlign: 'left', maxWidth: '850px' }}>
        <div className="eyebrow-badge">
          <Cpu size={14} /> CORE CAPABILITIES
        </div>
        <h2 className="landing-section-title">
          Everything you need for efficient legal work
        </h2>
        <p className="landing-section-desc" style={{ margin: 0, maxWidth: '780px' }}>
          An all-in-one platform combining AI research, document review, and drafting in one seamless experience.
        </p>
      </div>

      {/* Grid: 6 Cards on Left, Photographic Still-Life on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.35fr 0.75fr',
        gap: '2.5rem',
        alignItems: 'stretch'
      }} className="toolkit-layout-grid">
        {/* 6 Capabilities Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem'
        }} className="toolkit-cards-row">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="premium-card"
              style={{
                background: '#faf8f5',
                border: '1px solid #e7e3da',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                background: tool.bg,
                color: tool.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <tool.icon size={20} />
              </div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#0b1329',
                marginBottom: '0.45rem'
              }}>
                {tool.title}
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '0.84rem',
                lineHeight: '1.55',
                margin: 0
              }}>
                {tool.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side: Authentic Indian Legal Still Life */}
        <div style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #e7e3da',
          background: '#0b1329',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 35px rgba(11, 19, 41, 0.08)'
        }}>
          <img
            src="/assets/legal/capabilities/books_petition_still.jpg"
            alt="Authentic Indian Law Commentary and High Court Petition Brief"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              minHeight: '360px'
            }}
          />
          {/* Subtle gold-trimmed overlay card at bottom */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(180deg, rgba(11, 19, 41, 0) 0%, rgba(11, 19, 41, 0.92) 80%)',
            padding: '2rem 1.5rem 1.5rem',
            color: 'white'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#fde047',
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem'
            }}>
              <CheckCircle size={12} /> Authentic Indian Jurisprudence
            </div>
            <div style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: 1.3,
              marginBottom: '0.3rem'
            }}>
              From High Court Petitions to Statutory Law
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Engineered with full concordance for IPC, CrPC, IEA, BNS, BNSS, and BSA 2023.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .toolkit-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .toolkit-cards-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
