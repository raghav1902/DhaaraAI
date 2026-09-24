import React from 'react';
import { Globe, FileText, FileCheck, Send, Layers, Search } from 'lucide-react';

export default function IntegrationsSection() {
  const tools = [
    { name: 'Microsoft Word', desc: 'Add-in for drafting', icon: FileText, color: '#2563eb' },
    { name: 'Google Drive', desc: 'Direct contract sync', icon: Globe, color: '#ea4335' },
    { name: 'Adobe Acrobat / PDF', desc: 'One-click clause audit', icon: FileCheck, color: '#dc2626' },
    { name: 'Microsoft Outlook', desc: 'Analyze email agreements', icon: Send, color: '#0284c7' },
    { name: 'Clio & Practice Suite', desc: 'Case file connector', icon: Layers, color: '#16a34a' },
    { name: 'Chrome Browser Ext.', desc: 'Audit clauses on the web', icon: Search, color: '#f59e0b' }
  ];

  return (
    <section className="section-container" style={{ textAlign: 'center' }}>
      <div className="section-header">
        <div className="feature-badge"><Globe size={14} /> Ecosystem</div>
        <h2 className="section-title">Integrates With Your Legal Workflow</h2>
        <p className="section-desc">Connect DhaaraAI seamlessly to the software you and your team already use every single day.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1.25rem',
        maxWidth: '860px',
        margin: '0 auto'
      }}>
        {tools.map((tool, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.25rem 1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${tool.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <tool.icon size={20} color={tool.color} />
            </div>
            <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>{tool.name}</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{tool.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
