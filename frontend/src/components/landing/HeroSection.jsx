import React from 'react';
import { ArrowRight, Sparkles, Star, Play } from 'lucide-react';

export default function HeroSection({ onExplore }) {
  return (
    <section className="hero-section" style={{
      padding: '7.5rem 1.5rem 3rem',
      textAlign: 'center',
      maxWidth: '1050px',
      margin: '0 auto'
    }}>
      <div className="animate-fade-in-up" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: 'white',
        border: '1px solid #cbd5e1',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        padding: '0.4rem 0.9rem',
        borderRadius: '999px',
        marginBottom: '1.5rem',
        fontSize: '0.82rem',
        color: '#334155',
        fontWeight: '600'
      }}>
        <Sparkles size={15} color="#2563eb" /> Introducing DhaaraAI — Built for Indian Law & BNS 2023
      </div>

      <h1 className="hero-title animate-fade-in-up delay-100" style={{
        fontSize: 'clamp(2.1rem, 4.2vw, 2.95rem)',
        fontWeight: '800',
        lineHeight: '1.15',
        marginBottom: '1.25rem',
        color: '#0f172a'
      }}>
        Supercharge your legal practice with <span className="gradient-text">DhaaraAI</span>
      </h1>

      <p className="hero-subtitle animate-fade-in-up delay-200" style={{
        fontSize: '1.02rem',
        lineHeight: '1.6',
        color: '#475569',
        maxWidth: '680px',
        margin: '0 auto 2rem',
        fontWeight: '400'
      }}>
        Get verified legal answers, review complex contracts, translate IPC to the new BNS framework, and generate court-ready legal drafts in seconds.
      </p>

      <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={onExplore} style={{ padding: '0.85rem 1.85rem', fontSize: '1rem', animation: 'pulseGlow 2s infinite' }}>
          Try For Free Now <ArrowRight size={18} />
        </button>
        <a href="#video-demo" className="btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem', textDecoration: 'none' }}>
          <Play size={16} fill="#0f172a" /> Watch Demo
        </a>
      </div>

      {/* Social Proof Stats */}
      <div className="stats-container animate-fade-in-up delay-300" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3.5rem',
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(203, 213, 225, 0.6)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', fontFamily: 'Outfit', color: '#0f172a', lineHeight: 1 }}>10,000+</div>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '500', marginTop: '0.35rem' }}>Legal Professionals</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', fontFamily: 'Outfit', color: '#0f172a', lineHeight: 1 }}>2.4M+</div>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '500', marginTop: '0.35rem' }}>Statutes & Precedents</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.1rem', fontWeight: '800', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#0f172a', lineHeight: 1 }}>
            4.9 <Star size={20} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '500', marginTop: '0.35rem' }}>Advocate Rating</div>
        </div>
      </div>
    </section>
  );
}
