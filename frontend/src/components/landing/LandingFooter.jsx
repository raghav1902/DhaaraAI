import React from 'react';
import { Scale } from 'lucide-react';

export default function LandingFooter({ onOpenModal }) {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '3.5rem', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: '800', fontSize: '1.35rem', fontFamily: 'Outfit, sans-serif', marginBottom: '0.85rem' }}>
            <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '8px', color: 'white', display: 'flex' }}>
              <Scale size={20} />
            </div>
            Dhaara<span style={{ color: '#2563eb' }}>AI</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
            India's premier AI legal companion. Revolutionizing statutory research, document review, and smart drafting for modern advocates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', marginBottom: '1.25rem', color: '#0f172a' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'AI Assistant', href: '#features' },
                { label: 'BNS ↔ IPC Converter', href: '#toolkit' },
                { label: 'Case Law Explorer', href: '#features' },
                { label: 'Document Review', href: '#features' },
                { label: 'Pricing Plans', href: '#pricing' }
              ].map((link, i) => (
                <li key={i}>
                  <a href={link.href} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', marginBottom: '1.25rem', color: '#0f172a' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'About Us', modal: 'About Us' },
                { label: 'Knowledge Base', modal: 'Blog' },
                { label: 'Security & Privacy', modal: 'Privacy Policy' },
                { label: 'Terms of Service', modal: 'Terms of Service' }
              ].map((link, i) => (
                <li key={i}>
                  <button onClick={() => onOpenModal(link.modal)} style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1140px', margin: '3.5rem auto 0', paddingTop: '1.75rem', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
        © 2026 DhaaraAI Technologies Inc. All rights reserved. • Built for Indian Legal Excellence.
      </div>
    </footer>
  );
}
