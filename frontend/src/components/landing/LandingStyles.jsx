import React from 'react';

export default function LandingStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
      
      .dhaara-landing * {
        box-sizing: border-box;
      }

      h1, h2, h3, h4, .outfit-font {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: -0.02em;
      }

      .gradient-text {
        background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #38bdf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      /* Animations */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45); }
        70% { box-shadow: 0 0 0 14px rgba(37, 99, 235, 0); }
        100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
      }

      @keyframes floatSlow {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }

      @keyframes marqueeScroll {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-33.333%); }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .delay-100 { animation-delay: 100ms; }
      .delay-200 { animation-delay: 200ms; }
      .delay-300 { animation-delay: 300ms; }

      /* Navbar */
      .navbar {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 50;
        transition: all 0.3s ease;
        padding: 0.85rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid transparent;
      }
      .navbar.scrolled {
        background: rgba(255, 255, 255, 0.88);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
      }

      /* Buttons */
      .btn-primary {
        background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
        color: white;
        padding: 0.65rem 1.35rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.92rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.25s ease;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
        background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
      }

      .btn-secondary {
        background: white;
        color: #0f172a;
        padding: 0.65rem 1.35rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.92rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.25s ease;
        border: 1px solid #cbd5e1;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      }
      .btn-secondary:hover {
        background: #f8fafc;
        border-color: #94a3b8;
        transform: translateY(-2px);
      }

      /* Sections & Cards */
      .section-container {
        padding: 4.5rem 1.5rem;
        max-width: 1140px;
        margin: 0 auto;
      }
      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }
      .section-title {
        font-size: 2.05rem;
        font-weight: 800;
        margin-bottom: 0.75rem;
        color: #0f172a;
      }
      .section-desc {
        color: #64748b;
        font-size: 0.98rem;
        max-width: 580px;
        margin: 0 auto;
        line-height: 1.55;
      }

      .feature-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: #eff6ff;
        color: #2563eb;
        padding: 0.4rem 0.85rem;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.82rem;
        margin-bottom: 1rem;
      }

      .toolkit-card {
        background: white;
        padding: 1.75rem;
        border-radius: 18px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .toolkit-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.06);
        border-color: #cbd5e1;
      }

      .marquee-container {
        overflow: hidden;
        width: 100%;
        display: flex;
        position: relative;
      }
      .marquee-track {
        display: flex;
        gap: 1.25rem;
        width: max-content;
        animation: marqueeScroll 36s linear infinite;
      }
      .marquee-track:hover {
        animation-play-state: paused;
      }

      @media (max-width: 900px) {
        .feature-row, .feature-row:nth-child(even) {
          flex-direction: column !important;
          gap: 2rem !important;
        }
        .stats-container {
          gap: 1.5rem !important;
        }
        .nav-links-desktop {
          display: none !important;
        }
      }
    `}</style>
  );
}
