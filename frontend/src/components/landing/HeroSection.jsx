import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Scale,
  Search,
  FileText,
  ArrowRightLeft,
  ShieldAlert,
  Calculator
} from 'lucide-react';
import HeroStudioMockup from './HeroStudioMockup';

export default function HeroSection({ onExplore, user }) {
  const [activeHeroTab, setActiveHeroTab] = useState('ask_ai');

  const activeUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem('dhaara_active_user') || 'null');
    } catch {
      return null;
    }
  })();

  const isPlus = activeUser?.plan === 'plus' || activeUser?.plan === 'pro' || activeUser?.plan === 'enterprise';
  const hasUser = Boolean(activeUser && (activeUser.email || activeUser.user_id));

  const previewTabs = [
    { id: 'ask_ai', label: 'Ask AI', icon: Search, badge: 'RAG AI' },
    { id: 'concordance', label: 'BNS ↔ IPC', icon: ArrowRightLeft, badge: '2,016+ Acts' },
    { id: 'cyber', label: 'Cyber Scanner', icon: ShieldAlert, badge: 'Live Leak' },
    { id: 'fee_calc', label: 'Fee Calculator', icon: Calculator, badge: '28 States' },
    { id: 'drafter', label: 'Legal Drafter', icon: FileText, badge: 'Bilingual' }
  ];

  return (
    <section className="hero-section" style={{
      padding: '7.5rem 1.5rem 2.5rem',
      position: 'relative',
      maxWidth: '1380px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* 1. Pill Badge */}
      <div className="animate-fade-in-up" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: '#ffffff',
        border: '1px solid #bfdbfe',
        boxShadow: '0 4px 18px rgba(37, 99, 235, 0.1)',
        padding: '0.45rem 1.25rem',
        borderRadius: '999px',
        marginBottom: '1.75rem',
        fontSize: '0.82rem',
        color: '#1e40af',
        fontWeight: '600'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e40af, #2563eb)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(37,99,235,0.4)'
        }}>
          <Scale size={11} />
        </div>
        <span style={{ letterSpacing: '0.02em' }}>
          BNS 2023 Live • 2,016+ Concordance Provisions • Supreme Court Precedents
        </span>
        {hasUser ? (
          isPlus ? (
            <span style={{
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              fontSize: '0.72rem',
              padding: '2px 9px',
              borderRadius: '999px',
              fontWeight: '700'
            }}>
              ✓ Plus Active
            </span>
          ) : (
            <span style={{
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontSize: '0.72rem',
              padding: '2px 9px',
              borderRadius: '999px',
              fontWeight: '700'
            }}>
              Free Tier
            </span>
          )
        ) : (
          <span style={{
            background: '#dbeafe',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            fontSize: '0.72rem',
            padding: '2px 9px',
            borderRadius: '999px',
            fontWeight: '700'
          }}>
            Free Trial Available
          </span>
        )}
      </div>

      {/* 2. Headline with Editorial Serif + Royal Blue Emphasis */}
      <h1 className="hero-title-main animate-fade-in-up delay-100" style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 'clamp(2rem, 3.8vw, 3.1rem)',
        fontWeight: '600',
        lineHeight: '1.18',
        marginBottom: '1.1rem',
        color: '#0b1329',
        letterSpacing: '-0.02em',
        maxWidth: '880px',
        margin: '0 auto 1.1rem'
      }}>
        Intelligent Legal Research &amp; Drafting,<br />
        <span style={{
          color: '#1d4ed8',
          fontStyle: 'normal',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #0284c7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Build for Indian Law &amp; BNS 2023.
        </span>
      </h1>

      {/* 3. Subtitle */}
      <p className="animate-fade-in-up delay-200" style={{
        fontSize: '1.02rem',
        lineHeight: '1.65',
        color: '#475569',
        maxWidth: '680px',
        margin: '0 auto 2rem',
        fontWeight: '400'
      }}>
        Cross-reference <strong>BNS ↔ IPC</strong> concordance instantly, cite authentic Supreme Court &amp; High Court rulings, draft court-ready legal notices, and audit contractual risks in seconds.
      </p>

      {/* 4. Action CTA Buttons */}
      <div className="hero-cta-group animate-fade-in-up delay-300" style={{
        display: 'flex',
        gap: '0.85rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1.75rem'
      }}>
        <button
          className="btn-primary-pill"
          onClick={onExplore}
          style={{
            padding: '0.78rem 1.85rem',
            fontSize: '0.95rem',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Explore DhaaraAI Free <ArrowRight size={16} />
        </button>
        <a
          href="#demo"
          className="btn-secondary-pill"
          style={{
            padding: '0.78rem 1.65rem',
            fontSize: '0.95rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Play size={15} fill="#0b1329" color="#0b1329" /> Try Live Studio Demo
        </a>
      </div>

      {/* 5. Trust Micro-Checks */}
      <div className="animate-fade-in-up delay-300" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.75rem',
        flexWrap: 'wrap',
        marginBottom: '3rem',
        fontSize: '0.82rem',
        color: '#64748b',
        fontWeight: '500'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={15} color="#2563eb" /> 2,016+ Mapped BNS Provisions
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={15} color="#2563eb" /> Supreme Court &amp; 25 High Courts
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={15} color="#2563eb" /> Zero Client Model Retention
        </span>
      </div>

      {/* 6. Realistic Indian Legal Studio Mockup with Live Interactive Switcher */}
      <HeroStudioMockup
        hasUser={hasUser}
        isPlus={isPlus}
        activeHeroTab={activeHeroTab}
        setActiveHeroTab={setActiveHeroTab}
        previewTabs={previewTabs}
      />

      <style>{`
        @media (max-width: 868px) {
          .hero-section {
            padding: 5.5rem 1rem 2rem !important;
          }
          .hero-studio-body {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .hero-studio-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            padding: 0.65rem 0.5rem !important;
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
            gap: 0.5rem !important;
          }
          .hero-studio-sidebar button {
            flex-shrink: 0 !important;
          }
          .hero-studio-sidebar > div {
            display: none !important;
          }
          .hero-studio-content {
            padding: 1rem !important;
          }
          .floating-badge {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hero-studio-url-bar {
            display: none !important;
          }
          .hero-title-main {
            font-size: 1.75rem !important;
            line-height: 1.25 !important;
          }
          .hero-cta-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-cta-group button, .hero-cta-group a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
