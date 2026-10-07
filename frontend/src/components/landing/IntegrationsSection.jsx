import React from 'react';
import { Workflow, FileText, HardDrive, FileCheck, Mail, Layers, Compass } from 'lucide-react';

export default function IntegrationsSection() {
  const tools = [
    {
      name: 'Microsoft Word',
      desc: 'Add-in for drafting',
      icon: FileText,
      color: '#1d4ed8',
      bg: '#eff6ff'
    },
    {
      name: 'Google Drive',
      desc: 'Direct contract sync',
      icon: HardDrive,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      name: 'Adobe Acrobat',
      desc: 'One-click audit',
      icon: FileCheck,
      color: '#dc2626',
      bg: '#fef2f2'
    },
    {
      name: 'Microsoft Outlook',
      desc: 'Analyze emails',
      icon: Mail,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      name: 'Clio & Practice Suite',
      desc: 'Case file connector',
      icon: Layers,
      color: '#16a34a',
      bg: '#f0fdf4'
    },
    {
      name: 'Chrome Extension',
      desc: 'Audit web content',
      icon: Compass,
      color: '#ea580c',
      bg: '#fff7ed'
    }
  ];

  return (
    <section className="landing-section" style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="landing-section-header" style={{ marginBottom: '2.5rem' }}>
        <div className="eyebrow-badge">
          <Workflow size={14} /> INTEGRATES WITH YOUR LEGAL WORKFLOW
        </div>
        <h2 className="landing-section-title">
          Seamless Integration with Your Existing Workflow
        </h2>
        <p className="landing-section-desc">
          Embed statutory research, contract redlining, and verified citations directly into your drafting tools.
        </p>
      </div>

      {/* 6 Integration Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '1.25rem',
        maxWidth: '1180px',
        margin: '0 auto'
      }} className="integrations-grid">
        {tools.map((tool, i) => (
          <div
            key={i}
            className="premium-card"
            style={{
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.65rem',
              background: '#ffffff',
              border: '1px solid #e7e3da',
              borderRadius: '16px'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: tool.bg,
              color: tool.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.35rem'
            }}>
              <tool.icon size={22} />
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '700',
              fontSize: '0.92rem',
              color: '#0b1329',
              lineHeight: 1.2
            }}>
              {tool.name}
            </div>
            <div style={{
              fontSize: '0.76rem',
              color: '#64748b',
              lineHeight: 1.4
            }}>
              {tool.desc}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .integrations-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .integrations-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
