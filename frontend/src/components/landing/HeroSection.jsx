import React, { useState } from 'react';
import {
  ArrowRight, Play, CheckCircle2, Scale, Sparkles, Search, FileText,
  ArrowRightLeft, ShieldCheck, ExternalLink, ShieldAlert, Calculator, Lock
} from 'lucide-react';

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
      <div className="animate-fade-in-up delay-400" style={{
        position: 'relative',
        borderRadius: '26px',
        padding: '2.5rem 1.5rem 1rem',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(245,242,235,0.92) 100%)',
        border: '1px solid rgba(219, 234, 254, 0.9)',
        boxShadow: '0 25px 65px -15px rgba(11, 19, 41, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Floating Legal Document & Citation Badges */}
        <div className="floating-badge" style={{ top: '10%', left: '3%', display: 'none', md: 'flex' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>IPC § 420 ➔ BNS § 318(4) Concordance</span>
        </div>

        <div className="floating-badge" style={{ top: '22%', right: '3%', animationDelay: '-2.5s', display: 'none', md: 'flex' }}>
          <ShieldCheck size={16} color="#2563eb" />
          <span>25 High Courts & Supreme Court Indexed</span>
        </div>

        {/* Laptop Mockup Wrapper */}
        <div className="laptop-mockup-wrapper" style={{ position: 'relative', zIndex: 10 }}>
          <div className="laptop-mockup-frame">
            <div className="laptop-mockup-camera" />

            {/* Laptop Screen Content - Realistic DhaaraAI Studio */}
            <div className="laptop-screen-content">
              {/* Studio Browser Header */}
              <div style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '0.7rem 1.25rem',
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
                    fontFamily: 'Outfit',
                    fontWeight: '700',
                    color: '#0b1329',
                    marginLeft: '0.5rem'
                  }}>
                    <Scale size={15} color="#2563eb" /> DhaaraAI LegalGPT
                  </div>
                </div>

                <div className="hero-studio-url-bar" style={{
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
                  <Lock size={11} color="#059669" />
                  <span>app.dhaaraai.com/studio</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {hasUser && isPlus ? (
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '2px 9px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '700'
                    }}>
                      ✓ DhaaraAI Plus Active
                    </span>
                  ) : hasUser ? (
                    <span style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      padding: '2px 9px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '700'
                    }}>
                      Free Plan Active
                    </span>
                  ) : (
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '2px 9px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: '700'
                    }}>
                      Live Studio Preview
                    </span>
                  )}
                </div>
              </div>

              {/* Studio Main Body */}
              <div className="hero-studio-body" style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                minHeight: '390px',
                textAlign: 'left',
                background: '#f8fafc'
              }}>
                {/* Left Mini Sidebar with Switchable Tabs */}
                <div className="hero-studio-sidebar" style={{
                  background: '#ffffff',
                  borderRight: '1px solid #e2e8f0',
                  padding: '1rem 0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    padding: '0 0.5rem 0.4rem',
                    letterSpacing: '0.05em'
                  }}>
                    Capabilities
                  </div>

                  {previewTabs.map((item) => {
                    const isActive = activeHeroTab === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveHeroTab(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '8px',
                          background: isActive ? '#eff6ff' : 'transparent',
                          color: isActive ? '#1d4ed8' : '#64748b',
                          fontWeight: isActive ? '600' : '500',
                          fontSize: '0.78rem',
                          border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <IconComp size={14} color={isActive ? '#2563eb' : '#94a3b8'} />
                          <span>{item.label}</span>
                        </div>
                        <span style={{
                          fontSize: '0.65rem',
                          background: isActive ? '#dbeafe' : '#f1f5f9',
                          color: isActive ? '#1e40af' : '#64748b',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}>
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}

                  <div style={{ marginTop: 'auto', padding: '0.75rem 0.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0b1329' }}>Indian Law Corpus</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>2,016+ BNS Provisions Mapped</div>
                  </div>
                </div>

                {/* Right Interactive Canvas Rendering Selected Tool */}
                <div className="hero-studio-content" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                  {activeHeroTab === 'ask_ai' && (
                    <>
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
                            <span>Supreme Court • Vesa Holdings P. Ltd. v. State of Kerala (2015) 8 SCC 293</span>
                          </div>
                          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Cheating intent elements upheld</span>
                        </div>
                      </div>
                    </>
                  )}

                  {activeHeroTab === 'concordance' && (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(11, 19, 41, 0.03)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ArrowRightLeft size={16} color="#2563eb" />
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0b1329' }}>
                            Live Concordance Explorer (1,495 Provisions Unlocked)
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>
                          All Unlocked (Plus Active)
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontSize: '0.68rem', color: '#991b1b', fontWeight: '700' }}>OLD STATUTE (IPC 1860)</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#7f1d1d' }}>Section 302 IPC — Murder</div>
                          <div style={{ fontSize: '0.72rem', color: '#991b1b' }}>Death or imprisonment for life + fine</div>
                        </div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                          <div style={{ fontSize: '0.68rem', color: '#1e40af', fontWeight: '700' }}>NEW STATUTE (BNS 2023)</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e3a8a' }}>Section 103(1) BNS — Murder</div>
                          <div style={{ fontSize: '0.72rem', color: '#1e40af' }}>Death or life imprisonment; Sec 103(2) mob lynching penalty added</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
                        <span>• Cognizable: <strong>Yes</strong></span>
                        <span>• Bailable: <strong>Non-Bailable</strong></span>
                        <span>• Court: <strong>Court of Session</strong></span>
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'cyber' && (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(11, 19, 41, 0.03)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ShieldAlert size={16} color="#ea580c" />
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0b1329' }}>
                            Cyber Exposure & Public Breach Report
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                          HIGH EXPOSURE
                        </span>
                      </div>

                      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.85rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: '600' }}>
                          Target: advocate.consultancy@gmail.com • 2 Breaches Detected
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#c2410c', marginTop: '0.2rem' }}>
                          Exposed Fields: Passwords, Full Name, Contact Numbers, IP History
                        </div>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: '1.6' }}>
                        <strong>Immediate Legal Remedy:</strong> File complaint on <em>cybercrime.gov.in</em> or call <strong>1930 National Cyber Helpline</strong>. Relevant offences under <strong>IT Act 2000 Section 66, 66C &amp; 72A</strong> (Breach of confidentiality).
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'fee_calc' && (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(11, 19, 41, 0.03)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calculator size={16} color="#d97706" />
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0b1329' }}>
                            Court Fee Computation • Delhi High Court Rules
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                          Ad-Valorem Computed
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '0.85rem' }}>
                        <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.65rem', color: '#64748b' }}>SUIT VALUATION</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0b1329' }}>₹15,00,000</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.65rem', color: '#64748b' }}>COURT FEE LEVIED</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#16a34a' }}>₹21,240</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '0.65rem', color: '#64748b' }}>PROCESS &amp; ADV STAMP</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0b1329' }}>₹500 + ₹25</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Verified under Court Fees Act 1870 (Delhi Amendment) Schedule I, Article 1.
                      </div>
                    </div>
                  )}

                  {activeHeroTab === 'drafter' && (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      boxShadow: '0 4px 12px rgba(11, 19, 41, 0.03)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={16} color="#7c3aed" />
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0b1329' }}>
                            Statutory Legal Notice under Section 138 NI Act
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', background: '#faf5ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                          Court Formatted
                        </span>
                      </div>

                      <div style={{ background: '#faf8f5', border: '1px solid #e7e3da', borderRadius: '8px', padding: '0.75rem', fontSize: '0.76rem', color: '#334155', lineHeight: '1.55', fontFamily: 'serif' }}>
                        <em>"TAKE NOTICE that Cheque No. 448102 dated 14/08/2026 for ₹4,50,000/- drawn on HDFC Bank was returned unpaid with endorsement 'FUNDS INSUFFICIENT'. You are hereby called upon to remit payment within 15 days of receipt hereof..."</em>
                      </div>

                      <div style={{ marginTop: '0.65rem', fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Bilingual (English / हिन्दी) ready</span>
                        <span>Formatted for Advocate Notice Paper</span>
                      </div>
                    </div>
                  )}
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
