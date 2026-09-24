import React from 'react';
import { Layers } from 'lucide-react';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-container" style={{ background: 'white', borderRadius: '28px', margin: '3rem auto', border: '1px solid #e2e8f0' }}>
      <div className="section-header">
        <div className="feature-badge"><Layers size={14} /> Seamless Workflow</div>
        <h2 className="section-title">How DhaaraAI Works</h2>
        <p className="section-desc">From raw legal query to court-admissible research and customized drafts in three intuitive steps.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        position: 'relative'
      }}>
        {/* Step 1 */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2rem 1.75rem',
          position: 'relative'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontFamily: 'Outfit',
            fontSize: '1.15rem',
            marginBottom: '1.25rem'
          }}>01</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Ask or Upload</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
            Type any legal question in plain English or Hindi, or simply drag-and-drop contracts, petitions, or FIR drafts in PDF or Word formats.
          </p>
        </div>

        {/* Step 2 */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2rem 1.75rem',
          position: 'relative'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontFamily: 'Outfit',
            fontSize: '1.15rem',
            marginBottom: '1.25rem'
          }}>02</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>AI Analyzes Precedents</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
            Our RAG engine cross-checks millions of Supreme Court judgments, High Court rulings, statutory acts, and the new BNS criminal sections.
          </p>
        </div>

        {/* Step 3 */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2rem 1.75rem',
          position: 'relative'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#faf5ff',
            color: '#9333ea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontFamily: 'Outfit',
            fontSize: '1.15rem',
            marginBottom: '1.25rem'
          }}>03</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Get Actionable Intelligence</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: '1.6' }}>
            Receive structured legal memos, clause risk assessments, verified statutory citations, and customizable legal notices ready for printing.
          </p>
        </div>
      </div>
    </section>
  );
}
