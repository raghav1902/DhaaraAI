import React, { useState, useEffect } from 'react';
import { Scale, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingNavbar({ isScrolled, onExplore, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Playground', href: '#demo' },
    { label: 'Features', href: '#features' },
    { label: 'Toolkit', href: '#toolkit' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  // Scrollspy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const el = document.querySelector(navLinks[i].href);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].href.substring(1));
          return;
        }
      }
      if (window.scrollY < 400) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'inherit',
            flexShrink: 0
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #1e40af, #2563eb)',
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)'
          }}>
            <Scale size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '800',
              fontSize: '1.4rem',
              letterSpacing: '-0.03em',
              color: '#0b1329',
              lineHeight: 1
            }}>
              Dhaara<span style={{ color: '#2563eb' }}>AI</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav-links-desktop" style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.65)',
          padding: '0.3rem 0.6rem',
          borderRadius: '999px',
          border: '1px solid rgba(226, 232, 240, 0.7)'
        }}>
          {navLinks.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{
                  fontSize: '0.84rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  background: isActive ? 'white' : 'transparent',
                  color: isActive ? '#1d4ed8' : '#475569',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  fontWeight: isActive ? '600' : '500'
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right CTA / Auth actions */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="nav-auth-desktop" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={onExplore}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0b1329',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
            >
              {user ? 'Dashboard' : 'Login'}
            </button>
            <button className="btn-primary-pill" onClick={onExplore}>
              {user ? 'Open Studio' : 'Start for Free'} <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '0.45rem',
              cursor: 'pointer',
              color: '#0b1329'
            }}
            className="mobile-toggle-btn"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              style={{
                color: '#334155',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '0.5rem 0'
              }}
            >
              {item.label}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            {!user && (
              <button
                onClick={() => { setMobileMenuOpen(false); onExplore(); }}
                className="btn-secondary-pill"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Login
              </button>
            )}
            <button
              className="btn-primary-pill"
              onClick={() => { setMobileMenuOpen(false); onExplore(); }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {user ? 'Open Studio' : 'Start for Free'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .mobile-toggle-btn {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .nav-auth-desktop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
