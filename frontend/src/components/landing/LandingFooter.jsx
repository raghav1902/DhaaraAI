import React from 'react';
import { Scale } from 'lucide-react';

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19 26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77c.28-1.57.42-3.18.42-4.81s-.14-3.24-.42-4.81zM9.75 15.02V8.98L15 12l-5.25 3.02z"/>
    </svg>
  );
}

export default function LandingFooter({ onOpenModal }) {
  return (
    <footer style={{
      background: '#faf8f5',
      borderTop: '1px solid #e7e3da',
      padding: '4.5rem 1.75rem 2.5rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: '3rem',
        marginBottom: '3.5rem'
      }} className="footer-columns-grid">

        {/* Brand Information */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '800',
            fontSize: '1.4rem',
            color: '#0b1329',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <Scale size={18} />
            </div>
            <span>Dhaara<span style={{ color: '#2563eb' }}>AI</span></span>
          </div>

          <p style={{
            color: '#64748b',
            fontSize: '0.86rem',
            lineHeight: '1.65',
            maxWidth: '320px',
            margin: '0 0 1.5rem 0'
          }}>
            India's premier AI legal intelligence platform. Revolutionizing statutory research, document review, and smart drafting for modern advocates.
          </p>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              aria-label="X Twitter"
            >
              <TwitterIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
              aria-label="YouTube"
            >
              <YouTubeIcon />
            </a>
          </div>
        </div>

        {/* Column 1: Product */}
        <div>
          <h4 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.92rem',
            fontWeight: '700',
            color: '#0b1329',
            marginBottom: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Product
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Ask AI', href: '#features' },
              { label: 'BNS ↔ IPC Converter', href: '#toolkit' },
              { label: 'Case Law Explorer', href: '#features' },
              { label: 'Contract Audit', href: '#features' },
              { label: 'Pricing Plans', href: '#pricing' }
            ].map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    fontSize: '0.86rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Company */}
        <div>
          <h4 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.92rem',
            fontWeight: '700',
            color: '#0b1329',
            marginBottom: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Company
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'About Us', modal: 'About Us' },
              { label: 'Knowledge Base', modal: 'Blog' },
              { label: 'Security & Privacy', modal: 'Privacy Policy' },
              { label: 'Terms of Service', modal: 'Terms of Service' }
            ].map((link, i) => (
              <li key={i}>
                <button
                  onClick={() => onOpenModal(link.modal)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#64748b',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.92rem',
            fontWeight: '700',
            color: '#0b1329',
            marginBottom: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Resources
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Terms of Service', modal: 'Terms of Service' },
              { label: 'Privacy Policy', modal: 'Privacy Policy' },
              { label: 'Security & Compliance', modal: 'Privacy Policy' },
              { label: 'BNS Concordance Guide', modal: 'Blog' }
            ].map((link, i) => (
              <li key={i}>
                <button
                  onClick={() => onOpenModal(link.modal)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#64748b',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        paddingTop: '2rem',
        borderTop: '1px solid #e7e3da',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#94a3b8',
        fontSize: '0.82rem'
      }}>
        <div>
          © 2026 DhaaraAI Technologies. All rights reserved.
        </div>
        <div>
          Built for Indian Legal Excellence • Supreme Court, High Courts & BNS 2023 Compliant.
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 550px) {
          .footer-columns-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
