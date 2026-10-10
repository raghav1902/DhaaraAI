import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Scale,
  ArrowRight,
  Mic,
  Upload,
  Lock
} from 'lucide-react';
import { SAMPLE_SCENARIOS, getScenarioFallback } from './demoScenarios';
import DemoResultCard from './DemoResultCard';

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts' | 'upload' | 'voice'
  const [currentQuery, setCurrentQuery] = useState("What is section 420 IPC in the new BNS?");
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectScenario = (query) => {
    setIsProcessing(true);
    setCurrentQuery(query);
    setTimeout(() => {
      setIsProcessing(false);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const query = inputVal.trim();
    setIsProcessing(true);
    setCurrentQuery(query);
    setInputVal('');
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };

  const activeData = SAMPLE_SCENARIOS[currentQuery] || getScenarioFallback(currentQuery);

  return (
    <section id="demo" className="landing-section" style={{ position: 'relative' }}>
      {/* Section Header */}
      <div className="landing-section-header">
        <div className="eyebrow-badge">
          <Sparkles size={14} /> INTERACTIVE PREVIEW
        </div>
        <h2 className="landing-section-title">Experience DhaaraAI in Action</h2>
        <p className="landing-section-desc">
          Test real-world statutory cross-referencing, contractual clause audits, and legal notice drafting with verified citations.
        </p>
      </div>

      {/* Main 2-Column Interactive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left: Studio Simulation Screen */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e7e3da',
          boxShadow: '0 12px 40px rgba(11, 19, 41, 0.06)',
          overflow: 'hidden'
        }}>
          {/* Studio Window Chrome */}
          <div style={{
            background: '#faf8f5',
            borderBottom: '1px solid #e7e3da',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', marginLeft: '0.5rem' }}>
                DhaaraAI LegalGPT Sandbox
              </span>
            </div>
            <div style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '2px 9px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Scale size={12} /> BNS 2023 LIVE
            </div>
          </div>

          {/* Interactive Modes Navigation Bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e7e3da',
            background: '#ffffff'
          }}>
            <button
              onClick={() => setActiveTab('prompts')}
              style={{
                flex: 1,
                padding: '0.85rem',
                border: 'none',
                background: activeTab === 'prompts' ? '#ffffff' : '#faf8f5',
                borderBottom: activeTab === 'prompts' ? '2.5px solid #2563eb' : '1px solid transparent',
                color: activeTab === 'prompts' ? '#1d4ed8' : '#64748b',
                fontWeight: activeTab === 'prompts' ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={15} /> Guided Legal Scenarios
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              style={{
                flex: 1,
                padding: '0.85rem',
                border: 'none',
                background: activeTab === 'upload' ? '#ffffff' : '#faf8f5',
                borderBottom: activeTab === 'upload' ? '2.5px solid #2563eb' : '1px solid transparent',
                color: activeTab === 'upload' ? '#1d4ed8' : '#64748b',
                fontWeight: activeTab === 'upload' ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Upload size={15} /> Contract Upload Audit
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              style={{
                flex: 1,
                padding: '0.85rem',
                border: 'none',
                background: activeTab === 'voice' ? '#ffffff' : '#faf8f5',
                borderBottom: activeTab === 'voice' ? '2.5px solid #2563eb' : '1px solid transparent',
                color: activeTab === 'voice' ? '#1d4ed8' : '#64748b',
                fontWeight: activeTab === 'voice' ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Mic size={15} /> Voice Consultation
            </button>
          </div>

          {/* Canvas Content */}
          <div style={{ padding: '1.75rem', background: '#faf8f5' }}>
            {/* Tab: Guided Scenarios */}
            {activeTab === 'prompts' && (
              <div>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem'
                }}>
                  Select a Benchmark Legal Scenario to Inspect:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {Object.keys(SAMPLE_SCENARIOS).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSelectScenario(q)}
                      style={{
                        padding: '0.5rem 0.95rem',
                        borderRadius: '999px',
                        background: currentQuery === q ? '#1d4ed8' : '#ffffff',
                        color: currentQuery === q ? '#ffffff' : '#334155',
                        border: currentQuery === q ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Upload Contract */}
            {activeTab === 'upload' && (
              <div style={{
                background: '#ffffff',
                border: '2px dashed #bfdbfe',
                borderRadius: '16px',
                padding: '1.75rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}>
                <Upload size={28} color="#2563eb" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0b1329' }}>
                  Upload Sample Contract (PDF / DOCX)
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Simulated preview: Clause risk tagging active for Section 27 Contract Act
                </div>
                <button
                  onClick={() => handleSelectScenario("Analyze a Non-Disclosure Agreement")}
                  style={{
                    marginTop: '0.85rem',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Load Sample NDA Clause →
                </button>
              </div>
            )}

            {/* Tab: Voice Consultation */}
            {activeTab === 'voice' && (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e7e3da',
                borderRadius: '16px',
                padding: '1.75rem',
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.65rem'
                }}>
                  <Mic size={24} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0b1329' }}>
                  Bilingual Voice Ingestion (Hindi &amp; English)
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.2rem' }}>
                  "गाड़ी की टक्कर में FIR कैसे दर्ज कराएं?" or "How to serve notice under Sec 138 NI Act?"
                </div>
                <button
                  onClick={() => handleSelectScenario("Draft a Legal Notice for unpaid invoices")}
                  style={{
                    marginTop: '0.85rem',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Test Voice Query Synthesis →
                </button>
              </div>
            )}

            {/* Live Query Active Bar */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  QUERY
                </span>
                <span style={{ fontSize: '0.86rem', fontWeight: '600', color: '#0b1329' }}>
                  "{currentQuery}"
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>
                ● Corpus Linked
              </span>
            </div>

            {/* Response Panel */}
            <DemoResultCard
              isProcessing={isProcessing}
              activeData={activeData}
            />
          </div>
        </div>

        {/* Right: "Try It Yourself" Console */}
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1px solid #e7e3da',
          padding: '1.85rem',
          boxShadow: '0 8px 30px rgba(11, 19, 41, 0.04)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: '#1d4ed8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.35rem'
              }}>
                <Sparkles size={13} /> Try It Yourself
              </div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.45rem',
                fontWeight: '700',
                color: '#0b1329',
                margin: 0
              }}>
                Test the Indian Law Engine
              </h3>
            </div>
            <span style={{
              fontSize: '0.72rem',
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              padding: '3px 9px',
              borderRadius: '999px',
              fontWeight: '600'
            }}>
              Live AI RAG
            </span>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Ask any question regarding the new Bharatiya Nyaya Sanhita (BNS 2023), BNSS procedural timelines, or case laws.
          </p>

          {/* Interactive Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. Can police arrest without warrant under Section 35 BNSS? Or check court fee in UP..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                  color: '#0b1329'
                }}
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '12px',
                  background: inputVal.trim() ? '#2563eb' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: inputVal.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background 0.15s ease'
                }}
              >
                Send <Send size={12} />
              </button>
            </div>
          </form>

          {/* Quick Click Prompts */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', marginBottom: '0.65rem' }}>
              OR TRY ONE-CLICK PROMPTS:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                "Calculate Court Fee for ₹15 Lakh Suit in Delhi",
                "Scan email for cyber data breach and fraud remedies",
                "What is section 420 IPC in the new BNS?"
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectScenario(p)}
                  style={{
                    textAlign: 'left',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.8rem',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{p}</span>
                  <ArrowRight size={14} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>

          {/* Security & Authenticity Banner */}
          <div style={{
            background: '#faf8f5',
            border: '1px solid #e7e3da',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Lock size={18} color="#059669" />
            <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: '1.4' }}>
              <strong>Zero Data Storage Policy:</strong> Queries in demo sandbox are ephemeral and never used for foundation model training.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
