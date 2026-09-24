import React from 'react';
import { Sparkles, X, Check } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section id="comparison" className="section-container">
      <div className="section-header">
        <div className="feature-badge"><Sparkles size={14} /> The Competitive Advantage</div>
        <h2 className="section-title">Traditional Lawyering vs. DhaaraAI</h2>
        <p className="section-desc">See how modern AI infrastructure transforms time-sink administrative tasks into high-leverage legal counsel.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '960px',
        margin: '0 auto'
      }}>
        {/* Traditional Card */}
        <div style={{
          background: 'white',
          border: '1px solid #fecaca',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: '700', fontSize: '1.15rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#fef2f2', padding: '0.4rem', borderRadius: '8px' }}>
              <X size={20} color="#dc2626" />
            </div>
            Traditional Legal Work
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#475569' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span><strong>Manual Law Library Searches:</strong> Hours spent flipping through physical law digests and sluggish portals.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span><strong>High Retainer & Hourly Costs:</strong> ₹5,000 to ₹25,000 per hour for basic contract audits and initial drafts.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span><strong>Slow Turnaround:</strong> Waiting 3 to 7 days for a draft or clause risk analysis.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</span>
              <span><strong>BNS Confusion:</strong> Manual cross-checking old IPC sections against the new 2023 Sanhita codes.</span>
            </div>
          </div>
        </div>

        {/* DhaaraAI Card */}
        <div style={{
          background: '#0f172a',
          border: '2px solid #2563eb',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          boxShadow: '0 15px 40px rgba(37, 99, 235, 0.2)',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            background: '#2563eb',
            color: 'white',
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '3px 12px',
            borderRadius: '999px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>Modern Standard</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontWeight: '700', fontSize: '1.15rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.3)', padding: '0.4rem', borderRadius: '8px' }}>
              <Check size={20} color="#60a5fa" />
            </div>
            With DhaaraAI
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span><strong>Sub-Second Semantic Retrieval:</strong> Instant AI synthesis of Supreme Court & High Court rulings.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span><strong>90% Cost Reduction:</strong> Flat monthly fee with unlimited queries and document analysis.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span><strong>24/7 Real-Time Delivery:</strong> Generate petitions, legal notices, and risk audits in under 60 seconds.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span><strong>Native BNS 2023 Intelligence:</strong> Automated real-time translation between old and new legal statutes.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
