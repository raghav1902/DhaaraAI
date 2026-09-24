import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function PricingSection({ onExplore }) {
  return (
    <section id="pricing" className="section-container">
      <div className="section-header">
        <div className="feature-badge"><Sparkles size={14} /> Transparent Plans</div>
        <h2 className="section-title">Choose the plan that fits you</h2>
        <p className="section-desc">Every plan includes an instant 3-day free trial. Cancel anytime with a single click.</p>
      </div>

      <div className="pricing-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.75rem',
        alignItems: 'center'
      }}>
        {/* Basic */}
        <div className="pricing-card" style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          padding: '2.25rem 1.75rem',
          borderRadius: '20px'
        }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Basic Plan</h3>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>
            $13.99<span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/mo</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.75rem' }}>Billed annually • Ideal for solo advocates</p>
          <button className="btn-secondary" onClick={onExplore} style={{ width: '100%', justifyContent: 'center', marginBottom: '1.75rem' }}>
            Get Started
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Advanced AI Model Access', 'Unlimited Legal Queries', 'Up-to-Date BNS 2023 Data', 'Standard Email Support'].map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                <CheckCircle2 size={16} color="#2563eb" /> {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Plus */}
        <div className="pricing-card popular" style={{
          background: 'white',
          border: '2px solid #2563eb',
          boxShadow: '0 12px 30px rgba(37, 99, 235, 0.12)',
          padding: '2.25rem 1.75rem',
          borderRadius: '20px',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: 'white', padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Most Popular
          </div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Plus Plan</h3>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>
            $34.99<span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/mo</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.75rem' }}>Billed annually • For active law firms</p>
          <button className="btn-primary" onClick={onExplore} style={{ width: '100%', justifyContent: 'center', marginBottom: '1.75rem' }}>
            Start 3-Day Free Trial
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Everything in Basic', 'Document Upload (PDF & Word)', 'Contract Risk Audits (50/mo)', 'Court-Ready Notice Drafting', 'Priority AI Inference Queue'].map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                <CheckCircle2 size={16} color="#2563eb" /> {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise */}
        <div className="pricing-card" style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          padding: '2.25rem 1.75rem',
          borderRadius: '20px'
        }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Enterprise</h3>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '0.4rem', fontFamily: 'Outfit' }}>
            $69.99<span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/mo</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.75rem' }}>Billed annually • Corporate legal teams</p>
          <button className="btn-secondary" onClick={onExplore} style={{ width: '100%', justifyContent: 'center', marginBottom: '1.75rem' }}>
            Get Started
          </button>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Unlimited Document Audits', 'Deep Precedent Research Mode', 'Multi-user Team Vault', 'Custom Law Firm Templates', 'Dedicated Account Manager'].map((feat, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                <CheckCircle2 size={16} color="#2563eb" /> {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
