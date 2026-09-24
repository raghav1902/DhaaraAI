import React from 'react';
import { Lock, ShieldCheck, Award } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section id="security" className="section-container">
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '3.5rem 2.5rem',
        color: 'white',
        border: '1px solid #334155',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '1rem',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Lock size={14} /> Bank-Level Legal Data Protection
          </div>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem', color: 'white' }}>
            Your Client Documents Are Strictly Confidential
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
            In legal practice, confidentiality is sacred. DhaaraAI is engineered from the ground up with military-grade encryption and zero public training retention.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={22} color="#60a5fa" />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'white' }}>AES-256 Military Encryption</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>
              All document uploads, query inputs, and generated drafts are encrypted at rest with AES-256 and in transit via TLS 1.3.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Lock size={22} color="#34d399" />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'white' }}>Zero Data Retention for Training</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>
              We strictly guarantee that your uploaded contracts, petitions, and legal files are never used to train public AI models.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={22} color="#fbbf24" />
            </div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'white' }}>Privileged Work-Product Standard</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>
              Designed in strict alignment with Attorney-Client Privilege expectations and India’s Digital Personal Data Protection (DPDP) Act.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
