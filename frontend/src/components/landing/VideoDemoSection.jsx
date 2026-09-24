import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function VideoDemoSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section id="video-demo" className="section-container" style={{ paddingTop: '4rem' }}>
      <div className="section-header">
        <div className="feature-badge"><Play size={14} /> Interactive Preview</div>
        <h2 className="section-title">See DhaaraAI in Action</h2>
        <p className="section-desc">Watch how our virtual legal associate cross-references BNS codes and audits contracts under 60 seconds.</p>
      </div>

      <div style={{
        maxWidth: '920px',
        margin: '0 auto',
        background: '#0f172a',
        borderRadius: '22px',
        border: '1px solid #334155',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.4)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Mock Browser Header */}
        <div style={{
          background: '#1e293b',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>
            https://app.dhaaraai.com/research-suite
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem' }}>
            <span>v2.4 (BNS Active)</span>
          </div>
        </div>

        {/* Player Screen Mock */}
        <div style={{
          minHeight: '400px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem',
          position: 'relative',
          cursor: 'pointer'
        }} onClick={() => setIsVideoPlaying(!isVideoPlaying)}>
          
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(56, 189, 248, 0.5)',
            transform: isVideoPlaying ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}>
            <Play size={28} fill="white" color="white" style={{ marginLeft: '4px' }} />
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', zIndex: 10 }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              {isVideoPlaying ? "Playing: Live AI Precedent Synthesis Demo" : "Click to Watch DhaaraAI in Action (1:45)"}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Real-time query processing • BNS ↔ IPC instant conversion • Smart citation verification
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '1.75rem',
            zIndex: 10
          }}>
            <span style={{ background: 'rgba(37, 99, 235, 0.25)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#93c5fd', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem' }}>
              ✓ Sub-Second Semantic Search
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#a7f3d0', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem' }}>
              ✓ 100% Citation Authenticity
            </span>
            <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fde68a', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem' }}>
              ✓ Zero Cloud Data Training
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
