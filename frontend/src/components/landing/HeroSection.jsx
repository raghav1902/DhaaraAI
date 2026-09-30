import React from 'react';
import { ArrowRight, Play, CheckCircle2, Scale, Sparkles, Search, FileText, ArrowRightLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export default function HeroSection({ onExplore }) {
  return (
    <section className="hero-section" style={{
      padding: '7.5rem 1.5rem 2rem',
      position: 'relative',
      maxWidth: '1360px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* 1. Pill Badge */}
      <div className="animate-fade-in-up" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: '#ffffff',
        border: '1px solid #dbeafe',
        boxShadow: '0 2px 12px rgba(37, 99, 235, 0.08)',
        padding: '0.4rem 1.1rem',
        borderRadius: '999px',
        marginBottom: '1.75rem',
        fontSize: '0.82rem',
        color: '#1e40af',
        fontWeight: '600'
      }}>
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#2563eb',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Scale size={11} />
        </div>
        <span>AI for Indian Law • BNS 2023 • Verified Sources</span>
      </div>

      {/* 2. Strong Headline with Editorial Serif + Royal Blue Emphasis */}
      <h1 className="hero-title-main animate-fade-in-up delay-100" style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 'clamp(2.5rem, 5.2vw, 4.2rem)',
        fontWeight: '600',
        lineHeight: '1.1',
        marginBottom: '1.4rem',
        color: '#0b1329',
        letterSpacing: '-0.025em',
        maxWidth: '980px',
        margin: '0 auto 1.4rem'
      }}>
        India’s Legal Intelligence,<br />
        <span style={{
          color: '#1d4ed8',
          fontStyle: 'normal',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Built for Indian Law.
        </span>
      </h1>

      {/* 3. Subtitle */}
      <p className="animate-fade-in-up delay-200" style={{
        fontSize: 'clamp(1rem, 1.35vw, 1.18rem)',
        lineHeight: '1.65',
        color: '#475569',
        maxWidth: '740px',
        margin: '0 auto 2.25rem',
        fontWeight: '400'
      }}>
        Get verified legal answers, review complex contracts, translate IPC to BNS, and generate court-ready legal drafts in seconds — with citations from authentic sources.
      </p>

      {/* 4. Action CTA Buttons */}
      <div className="hero-cta-group animate-fade-in-up delay-300" style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '1.75rem'
      }}>
        <button
          className="btn-primary-pill"
          onClick={onExplore}
          style={{
            padding: '0.85rem 2.2rem',
            fontSize: '1rem',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
            cursor: 'pointer'
          }}
        >
          Start for Free <ArrowRight size={18} />
        </button>
        <a
          href="#demo"
          className="btn-secondary-pill"
          style={{
            padding: '0.85rem 1.85rem',
            fontSize: '1rem',
            textDecoration: 'none'
          }}
        >
          <Play size={16} fill="#0b1329" color="#0b1329" /> Watch Demo
        </a>
      </div>

      {/* 5. Trust Micro-Checks */}
      <div className="animate-fade-in-up delay-300" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.85rem',
        flexWrap: 'wrap',
        marginBottom: '3.5rem',
        fontSize: '0.84rem',
        color: '#64748b',
        fontWeight: '500'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={16} color="#2563eb" /> No Credit Card Required
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={16} color="#2563eb" /> Instant Access
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={16} color="#2563eb" /> Built for Indian Law
        </span>
      </div>

      {/* 6. Realistic Indian Legal Composition + Laptop Mockup */}
      <div className="animate-fade-in-up delay-400" style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '2.5rem 1.5rem 1rem',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(245,242,235,0.85) 100%)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 25px 60px -15px rgba(11, 19, 41, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Background Chamber Photo Vignette */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/legal/hero/hero_chamber_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.28,
          filter: 'blur(1px)',
          zIndex: 1
        }} />

        {/* Floating Legal Document & Citation Badges */}
        <div className="floating-badge" style={{ top: '15%', left: '4%', display: 'none', md: 'flex' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>Section 420 IPC → BNS § 318(4)</span>
        </div>

        <div className="floating-badge" style={{ top: '28%', right: '4%', animationDelay: '-2.5s', display: 'none', md: 'flex' }}>
          <ShieldCheck size={16} color="#2563eb" />
          <span>Verified Supreme Court Precedents</span>
        </div>

        {/* Laptop Mockup */}
        <div className="laptop-mockup-wrapper" style={{ position: 'relative', zIndex: 10 }}>
          <div className="laptop-mockup-frame">
            <div className="laptop-mockup-camera" />

            {/* Laptop Screen Content - Realistic DhaaraAI Studio */}
            <div className="laptop-screen-content">
              {/* Studio Browser Header */}
              <div style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0.65rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: '700',
                    fontFamily: 'Outfit',
                    color: '#0b1329',
                    marginLeft: '0.5rem'
                  }}>
                    <Scale size={15} color="#2563eb" /> DhaaraAI
                  </div>
                </div>

                <div style={{
                  background: '#f1f5f9',
                  borderRadius: '999px',
                  padding: '0.25rem 1rem',
                  color: '#475569',
                  fontSize: '0.74rem',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <span>app.dhaaraai.com/legal-intelligence-studio</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    BNS 2023 Active
                  </span>
                </div>
              </div>

              {/* Studio Main Body */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '190px 1fr',
                minHeight: '380px',
                textAlign: 'left',
                background: '#f8fafc'
              }}>
                {/* Left Mini Sidebar */}
                <div style={{
                  background: '#ffffff',
                  borderRight: '1px solid #e2e8f0',
                  padding: '1rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', padding: '0 0.5rem 0.4rem', letterSpacing: '0.05em' }}>
                    Workspace
                  </div>
                  {[
                    { icon: Search, label: 'Ask AI', active: true },
                    { icon: FileText, label: 'Legal Drafting' },
                    { icon: ShieldCheck, label: 'Contract Audit' },
                    { icon: ArrowRightLeft, label: 'BNS ↔ IPC' },
                    { icon: Scale, label: 'Precedents' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        background: item.active ? '#eff6ff' : 'transparent',
                        color: item.active ? '#1d4ed8' : '#64748b',
                        fontWeight: item.active ? '600' : '500',
                        fontSize: '0.8rem'
                      }}
                    >
                      <item.icon size={14} color={item.active ? '#2563eb' : '#94a3b8'} />
                      <span>{item.label}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: 'auto', padding: '0.75rem 0.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0b1329' }}>Indian Law Corpus</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>2.4M+ Rulings Indexed</div>
                  </div>
                </div>

                {/* Right Chat & Search Workspace */}
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                  {/* Top query bar */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.65rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#0b1329', fontSize: '0.85rem', fontWeight: '500' }}>
                      <Search size={16} color="#2563eb" />
                      <span>What is section 420 IPC in the new BNS?</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                      RAG Verified
                    </span>
                  </div>

                  {/* Legal Output Card */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    boxShadow: '0 4px 12px rgba(11, 19, 41, 0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Scale size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0b1329' }}>
                            Statutory Concordance & Legal Analysis
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Bharatiya Nyaya Sanhita, 2023 • Chapter XVIII (Offences Against Property)
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>
                        ✓ 100% Citation Confidence
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.6', marginBottom: '0.85rem' }}>
                      Under the new penal framework, <strong>Section 420 of the Indian Penal Code (Cheating and dishonestly inducing delivery of property)</strong> has been mapped to <strong>Section 318(4) of the Bharatiya Nyaya Sanhita (BNS) 2023</strong>.
                    </div>

                    {/* Precedent Citation Pill */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: '600' }}>
                        <ExternalLink size={13} />
                        <span>Supreme Court of India • Vesa Holdings P. Ltd. v. State of Kerala (2015) 8 SCC 293</span>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Cheating intent elements upheld</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Base and Notch */}
          <div className="laptop-mockup-base">
            <div className="laptop-mockup-notch" />
          </div>
        </div>
      </div>
    </section>
  );
}
