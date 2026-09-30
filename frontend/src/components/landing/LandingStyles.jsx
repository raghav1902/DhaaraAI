import React from 'react';

export default function LandingStyles() {
  return (
    <style>{`
      :root {
        --legal-ivory: #faf8f5;
        --legal-ivory-warm: #f5f2eb;
        --legal-white: #ffffff;
        --legal-cream: #f6f3ec;
        --legal-border: #e7e3da;
        --legal-border-subtle: #f0ede6;
        --legal-navy-dark: #070e20;
        --legal-navy-section: #0a1329;
        --legal-navy-card: #0f1c3f;
        --legal-navy-border: rgba(56, 189, 248, 0.16);
        --legal-blue: #1d4ed8;
        --legal-blue-hover: #1e40af;
        --legal-blue-vibrant: #2563eb;
        --legal-blue-soft: #eff6ff;
        --legal-blue-glow: rgba(37, 99, 235, 0.28);
        --legal-gold: #c28b24;
        --legal-gold-soft: #fefce8;
        --legal-gold-border: #fef08a;
        --legal-amber: #d97706;
        --legal-emerald: #059669;
        --legal-emerald-soft: #ecfdf5;
        --text-dark: #0b1329;
        --text-body: #334155;
        --text-muted: #64748b;
        --font-serif: 'Newsreader', Georgia, 'Times New Roman', serif;
        --font-display: 'Outfit', sans-serif;
        --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        --font-hand: 'Caveat', cursive;
      }

      .dhaara-landing {
        background-color: var(--legal-ivory);
        color: var(--text-dark);
        font-family: var(--font-body);
        overflow-x: hidden;
        position: relative;
        -webkit-font-smoothing: antialiased;
      }

      .dhaara-landing * {
        box-sizing: border-box;
      }

      .editorial-title {
        font-family: var(--font-serif);
        font-weight: 600;
        letter-spacing: -0.02em;
        color: var(--text-dark);
      }

      .font-display {
        font-family: var(--font-display);
        letter-spacing: -0.02em;
      }

      .font-handwritten {
        font-family: var(--font-hand);
      }

      .gradient-blue-text {
        color: var(--legal-blue-vibrant);
        background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-7px); }
      }

      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
        70% { box-shadow: 0 0 0 14px rgba(37, 99, 235, 0); }
        100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
      }

      @keyframes marqueeScroll {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-33.333%); }
      }

      @keyframes subtleShimmer {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .delay-100 { animation-delay: 100ms; }
      .delay-200 { animation-delay: 200ms; }
      .delay-300 { animation-delay: 300ms; }
      .delay-400 { animation-delay: 400ms; }

      /* Sticky Navbar */
      .landing-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 90;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        padding: 0.95rem 2.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(250, 248, 245, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(231, 227, 218, 0.7);
      }

      .landing-nav.scrolled {
        background: rgba(255, 255, 255, 0.94);
        padding: 0.8rem 2.5rem;
        box-shadow: 0 4px 24px rgba(11, 19, 41, 0.05);
        border-bottom-color: rgba(231, 227, 218, 0.95);
      }

      .nav-link {
        color: #475569;
        font-size: 0.88rem;
        font-weight: 500;
        text-decoration: none;
        padding: 0.4rem 0.65rem;
        border-radius: 8px;
        transition: all 0.2s ease;
        position: relative;
      }

      .nav-link:hover {
        color: var(--legal-blue-vibrant);
        background: rgba(37, 99, 235, 0.04);
      }

      .nav-link.active {
        color: var(--legal-blue-vibrant);
        font-weight: 600;
      }

      /* Buttons */
      .btn-primary-pill {
        background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
        color: white;
        padding: 0.68rem 1.45rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.92rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
        text-decoration: none;
      }

      .btn-primary-pill:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.36);
        background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
      }

      .btn-secondary-pill {
        background: #ffffff;
        color: var(--text-dark);
        padding: 0.68rem 1.45rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.92rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid var(--legal-border);
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(11, 19, 41, 0.04);
        text-decoration: none;
      }

      .btn-secondary-pill:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(11, 19, 41, 0.08);
      }

      /* Eyebrow badge */
      .eyebrow-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        background: #ffffff;
        color: var(--legal-blue-vibrant);
        padding: 0.38rem 0.95rem;
        border-radius: 9999px;
        border: 1px solid rgba(203, 213, 225, 0.8);
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        box-shadow: 0 2px 6px rgba(11, 19, 41, 0.03);
        margin-bottom: 1rem;
      }

      .eyebrow-badge.dark-mode {
        background: rgba(30, 41, 59, 0.85);
        color: #60a5fa;
        border-color: rgba(56, 189, 248, 0.25);
      }

      /* Sections & Cards */
      .landing-section {
        padding: 5rem 1.75rem;
        max-width: 1240px;
        margin: 0 auto;
        position: relative;
      }

      .landing-section-header {
        text-align: center;
        margin-bottom: 3.25rem;
      }

      .landing-section-title {
        font-family: var(--font-serif);
        font-size: clamp(2.1rem, 3.8vw, 2.75rem);
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 0.85rem;
        color: var(--text-dark);
        letter-spacing: -0.02em;
      }

      .landing-section-desc {
        color: var(--text-muted);
        font-size: 1.02rem;
        max-width: 640px;
        margin: 0 auto;
        line-height: 1.6;
      }

      .premium-card {
        background: #ffffff;
        border: 1px solid var(--legal-border);
        border-radius: 18px;
        padding: 1.85rem;
        box-shadow: 0 4px 18px rgba(11, 19, 41, 0.03);
        transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .premium-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 34px rgba(11, 19, 41, 0.08);
        border-color: #cbd5e1;
      }

      /* Laptop Mockup Structure */
      .laptop-mockup-wrapper {
        position: relative;
        max-width: 980px;
        margin: 0 auto;
        perspective: 1200px;
      }

      .laptop-mockup-frame {
        background: #0f172a;
        border-radius: 20px 20px 6px 6px;
        padding: 14px 14px 18px 14px;
        box-shadow: 0 35px 80px -15px rgba(11, 19, 41, 0.35), 0 0 0 1px #334155;
        position: relative;
      }

      .laptop-mockup-camera {
        width: 6px;
        height: 6px;
        background: #334155;
        border-radius: 50%;
        margin: 0 auto 10px;
        box-shadow: inset 0 0 2px rgba(0,0,0,0.8);
      }

      .laptop-screen-content {
        background: #f8fafc;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #1e293b;
      }

      .laptop-mockup-base {
        height: 14px;
        background: linear-gradient(180deg, #94a3b8 0%, #64748b 100%);
        border-radius: 0 0 24px 24px;
        position: relative;
        margin: 0 30px;
        box-shadow: 0 12px 25px rgba(11, 19, 41, 0.25);
      }

      .laptop-mockup-notch {
        width: 120px;
        height: 6px;
        background: #475569;
        margin: 0 auto;
        border-radius: 0 0 6px 6px;
      }

      /* Floating citation chips */
      .floating-badge {
        position: absolute;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 12px 30px rgba(11, 19, 41, 0.12);
        border-radius: 12px;
        padding: 0.65rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.55rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-dark);
        z-index: 20;
        animation: floatSlow 5s ease-in-out infinite;
      }

      /* Mobile drawer */
      .mobile-menu-drawer {
        position: fixed;
        top: 65px;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid #e2e8f0;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 85;
      }

      @media (max-width: 1024px) {
        .landing-nav {
          padding: 0.85rem 1.5rem;
        }
        .landing-section {
          padding: 4rem 1.25rem;
        }
        .hero-layout-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 868px) {
        .nav-links-desktop {
          display: none !important;
        }
        .hero-title-main {
          font-size: 2.35rem !important;
        }
        .laptop-mockup-base {
          margin: 0 10px;
        }
      }

      @media (max-width: 480px) {
        .landing-nav {
          padding: 0.75rem 1rem;
        }
        .btn-primary-pill, .btn-secondary-pill {
          padding: 0.58rem 1.15rem;
          font-size: 0.84rem;
        }
        .hero-title-main {
          font-size: 1.95rem !important;
        }
        .hero-cta-group {
          flex-direction: column;
          width: 100%;
        }
        .hero-cta-group button, .hero-cta-group a {
          width: 100%;
          justify-content: center;
        }
      }
    `}</style>
  );
}
