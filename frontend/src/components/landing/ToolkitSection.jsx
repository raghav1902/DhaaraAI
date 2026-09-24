import React from 'react';
import { Cpu, ArrowRightLeft, ShieldAlert, Globe, FileText, Calculator, Lock } from 'lucide-react';

export default function ToolkitSection() {
  return (
    <section id="toolkit" className="section-container" style={{ background: 'white', borderRadius: '28px', border: '1px solid #e2e8f0' }}>
      <div className="section-header">
        <div className="feature-badge"><Cpu size={14} /> Integrated Tools</div>
        <h2 className="section-title">Specialized Legal Toolkit</h2>
        <p className="section-desc">Purpose-built instruments for legal practitioners, corporate in-house counsels, and citizens.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Tool 1 */}
        <div className="toolkit-card">
          <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <ArrowRightLeft size={22} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>BNS ↔ IPC Converter</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Seamlessly transition to the 2023 legal framework. Map IPC, CrPC, and IEA sections to BNS, BNSS, and BSA instantly with comparative tables.
          </p>
        </div>

        {/* Tool 2 */}
        <div className="toolkit-card">
          <div style={{ width: '44px', height: '44px', background: '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <ShieldAlert size={22} color="#ef4444" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>Citizen Rights & Legal SOS</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Know fundamental rights during traffic stops, police inquiries, and emergency interactions. Includes one-tap SOS guidance and helpline access.
          </p>
        </div>

        {/* Tool 3 */}
        <div className="toolkit-card">
          <div style={{ width: '44px', height: '44px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Globe size={22} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>Cyber Threat Scanner</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Audit suspicious links, SMS fraud claims, and investment schemes against Indian cyber law databases and IT Act provisions.
          </p>
        </div>

        {/* Tool 4 */}
        <div className="toolkit-card">
          <div style={{ width: '44px', height: '44px', background: '#fdf4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <FileText size={22} color="#c026d3" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>Smart Legal Drafting</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Generate professionally formatted FIRs, legal notices for cheque bounce (Section 138), NDAs, and rental agreements in minutes.
          </p>
        </div>

        {/* Tool 5 */}
        <div className="toolkit-card">
          <div style={{ width: '44px', height: '44px', background: '#fffbeb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Calculator size={22} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>Court Fee & Stamp Calculator</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Accurately compute state-wise court filing fees, ad-valorem calculations, and stamp duty rates across major Indian jurisdictions.
          </p>
        </div>

        {/* Tool 6 */}
        <div className="toolkit-card">
          <div style={{ width: '44px', height: '44px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Lock size={22} color="#475569" />
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>Encrypted Legal Vault</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Zero-knowledge encrypted client repository for case briefs, evidence scans, and client files with biometric & PIN security.
          </p>
        </div>
      </div>
    </section>
  );
}
