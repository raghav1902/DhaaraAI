import React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';

export default function DemoResultCard({ isProcessing, activeData }) {
  if (isProcessing) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #e7e3da',
        borderRadius: '16px',
        padding: '2.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3px solid #dbeafe',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ fontSize: '0.86rem', color: '#475569', fontWeight: '600' }}>
          Retrieving statutory concordance & verifying precedents...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e7e3da',
      borderRadius: '16px',
      padding: '1.4rem',
      boxShadow: '0 4px 16px rgba(11, 19, 41, 0.04)'
    }}>
      {/* Category & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '6px', fontWeight: '700' }}>
          {activeData.category}
        </span>
        <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={12} /> Verified
        </span>
      </div>

      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#0b1329',
        marginBottom: '0.35rem'
      }}>
        {activeData.statute}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.85rem', fontWeight: '500' }}>
        {activeData.oldRef}
      </div>

      <p style={{
        fontSize: '0.88rem',
        color: '#334155',
        lineHeight: '1.65',
        marginBottom: '1.25rem'
      }}>
        {activeData.answer}
      </p>

      {/* Precedent Citation */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '0.65rem 0.95rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.76rem'
      }}>
        <span style={{ color: '#1d4ed8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ExternalLink size={13} /> {activeData.citation}
        </span>
        <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Law Report Verified</span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {activeData.tags.map((tag, i) => (
          <span key={i} style={{
            background: '#f1f5f9',
            color: '#475569',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: '500'
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
