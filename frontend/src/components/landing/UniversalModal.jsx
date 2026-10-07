import React from 'react';
import { X } from 'lucide-react';

export default function UniversalModal({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      <div className="universal-modal-dialog" style={{
        background: 'white',
        padding: '2.25rem',
        borderRadius: '22px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
      }} onClick={e => e.stopPropagation()}>
        <style>{`
          @media (max-width: 640px) {
            .universal-modal-dialog {
              padding: 1.5rem 1.15rem !important;
              border-radius: 18px !important;
            }
          }
        `}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#0f172a', margin: 0, fontWeight: '700' }}>{activeModal}</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={18} color="#475569" />
          </button>
        </div>

        <div style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '2rem' }}>
          {activeModal === 'About Us' && (
            <>
              <p>
                <strong>DhaaraAI</strong> was established with a singular mission: to democratize legal intelligence and eliminate hours of manual statutory research for advocates, firms, and citizens across India.
              </p>
              <p>
                With the transition to the Bharatiya Nyaya Sanhita (BNS 2023), our engineering team developed proprietary cross-referencing algorithms to ensure practitioners never cite outdated provisions or misapply new procedural mandates.
              </p>
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '1.5rem' }}>
                <h4 style={{ color: '#0f172a', margin: '0 0 0.35rem 0', fontSize: '0.98rem' }}>Our Vision</h4>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>To serve as India's most trusted AI legal assistant, upholding judicial precision and confidentiality at every turn.</p>
              </div>
            </>
          )}

          {activeModal === 'Blog' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 'bold' }}>BNS 2023 REFORM</span>
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>Navigating the New BNS Criminal Framework</h4>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>The Bharatiya Nyaya Sanhita replaces the 163-year-old IPC. Key changes include codified community service penalties, updated definitions of organized crime, and altered remand timelines under BNSS.</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 'bold' }}>LEGAL TECH INSIGHT</span>
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>AI in Indian Courts & Precedent Retrieval</h4>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>With over 40 million pending cases across Indian courts, modern semantic search and natural language processing give legal teams unprecedented speed in extracting relevant headnotes.</p>
              </div>
            </div>
          )}

          {activeModal === 'Privacy Policy' && (
            <div>
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>1. Zero AI Training Guarantee</h4>
              <p>Your uploaded contracts, briefs, and client notes are processed exclusively for your session. We do not sell or utilize client data to train foundational public LLMs.</p>
              <h4 style={{ color: '#0f172a', margin: '1.25rem 0 0.5rem 0' }}>2. Data Encryption</h4>
              <p>All transmitted data is protected using TLS 1.3 encryption and stored using AES-256 standards in compliant tier-4 data centers.</p>
            </div>
          )}

          {activeModal === 'Terms of Service' && (
            <div>
              <h4 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>1. Informational & Research Companion</h4>
              <p>DhaaraAI provides legal research assistance and document synthesis. Outputs do not constitute formal attorney legal advice. Users must exercise independent professional legal judgment before filing in court.</p>
            </div>
          )}
        </div>

        <button onClick={onClose} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          Close Window
        </button>
      </div>
    </div>
  );
}
