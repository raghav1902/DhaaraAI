import React from 'react';
import { Scale, ArrowRight } from 'lucide-react';

export default function LandingNavbar({ isScrolled, onExplore }) {
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: '800', fontSize: '1.35rem', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', padding: '0.45rem', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scale size={20} />
        </div>
        <span style={{ color: '#0f172a' }}>Dhaara<span style={{ color: '#2563eb' }}>AI</span></span>
      </div>

      <div className="nav-links-desktop" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', fontSize: '0.9rem' }}>
        <a href="#how-it-works" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>How It Works</a>
        <a href="#demo" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Playground</a>
        <a href="#features" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
        <a href="#toolkit" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Toolkit</a>
        <a href="#comparison" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Comparison</a>
        <a href="#security" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Security</a>
        <a href="#pricing" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
        <a href="#faq" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>FAQ</a>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button onClick={onExplore} style={{ background: 'transparent', border: 'none', color: '#0f172a', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', padding: '0.5rem 0.8rem' }}>
          Login
        </button>
        <button className="btn-primary" onClick={onExplore}>
          Start for Free <ArrowRight size={16} />
        </button>
      </div>
    </nav>
  );
}
