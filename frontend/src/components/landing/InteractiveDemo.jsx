import React, { useState } from 'react';
import { Sparkles, Send, Scale, ArrowRight, Mic, Upload, CheckCircle2, Lock, ExternalLink } from 'lucide-react';

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts' | 'upload' | 'voice'
  const [currentQuery, setCurrentQuery] = useState("What is section 420 IPC in the new BNS?");
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleScenarios = {
    "What is section 420 IPC in the new BNS?": {
      category: "BNS 2023 Statutory Concordance",
      statute: "Section 318(4) Bharatiya Nyaya Sanhita (BNS) 2023",
      oldRef: "Formerly Section 420 of Indian Penal Code 1860",
      answer: "Under the new Bharatiya Nyaya Sanhita (BNS) 2023, Cheating and dishonestly inducing delivery of property (formerly Section 420 IPC) is codified under Section 318(4). The core ingredients of dishonest inducement remain consistent, with updated judicial sentencing parameters up to 7 years imprisonment and fine.",
      citation: "Supreme Court of India • State of Kerala v. A. Pareed Pillai (1972) AIR 1973 SC 326",
      tags: ["Offence Against Property", "Cognizable & Non-Bailable", "Court of Magistrate 1st Class"]
    },
    "Analyze a Non-Disclosure Agreement": {
      category: "Contract Clause Risk Audit",
      statute: "Section 27, Indian Contract Act 1872",
      oldRef: "Agreement in Restraint of Trade",
      answer: "Clause 8.2 specifies a 'Perpetual non-compete restraint covering all Indian jurisdictions'. Under Indian contract jurisprudence and Section 27 of the Indian Contract Act, post-employment restrictive covenants are generally void ab initio. Recommend limiting restriction to active trade secret confidentiality without blanket restraint on profession.",
      citation: "Percept D'Mark (India) (P) Ltd. v. Zaheer Khan (2006) 4 SCC 227",
      tags: ["High Risk Clause Flagged", "Section 27 Enforceability", "Drafting Redline Available"]
    },
    "Draft a Legal Notice for unpaid invoices": {
      category: "Commercial Dispute Notice Framework",
      statute: "Section 138 NI Act & Section 318 BNS",
      oldRef: "Civil Recovery Notice Framework",
      answer: "Court-ready statutory demand notice drafted for ₹4,85,000/- outstanding across tax invoices. Formatted with 15-day peremptory cure timeline, interest calculation at 18% p.a., and reserve notice for civil suit under Order 37 CPC alongside criminal complaint for fraudulent misappropriation.",
      citation: "Supreme Court Bench Guidelines • C.C. Alavi Haji v. Palapetty Muhammed (2007) 6 SCC 555",
      tags: ["Ready to Print Notice", "Order 37 CPC Compliant", "Interest Clause Factored"]
    },
    "Calculate Court Fee for ₹15 Lakh Suit in Delhi": {
      category: "Court Fee & Stamp Valuation",
      statute: "Court Fees Act 1870 (Delhi Amendment) Schedule I, Article 1",
      oldRef: "Ad-Valorem Valuation on Plaint",
      answer: "For a commercial recovery suit valued at ₹15,00,000/- before the District Courts of Delhi: Fixed ad-valorem fee payable is ₹21,240/-. Process fee: ₹500/-, Advocate Welfare Stamp: ₹25/-. No exemption applies as plaintiff is a corporate entity.",
      citation: "Delhi High Court (Original Side) Rules 2018 & Court Fees Act 1870",
      tags: ["₹21,240 Court Fee Computed", "Delhi State Rules", "District Court & High Court Ready"]
    },
    "Scan email for cyber data breach and fraud remedies": {
      category: "Cyber Exposure & Statutory Remedy",
      statute: "Information Technology Act 2000 (Sections 66, 66C, 72A)",
      oldRef: "Identity Theft & Data Confidentiality Breach",
      answer: "Target identified in 2 historical database exposures. Leaked data classes include plain text credentials, phone records, and login identifiers. Immediate action required: invoke National Cyber Helpline 1930, lodge complaint on cybercrime.gov.in, and file statutory breach claim under Section 43A & 72A IT Act 2000.",
      citation: "IT Act 2000 Sec 66C (Identity Theft) & Sec 72A (Disclosure in breach of lawful contract)",
      tags: ["High Risk Alert", "1930 Helpline Recourse", "IT Act 2000 Ready"]
    }
  };

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

  const activeData = sampleScenarios[currentQuery] || {
    category: "Indian Legal Precedent Retrieval",
    statute: "Bharatiya Nyaya Sanhita & Relevant Statutory Acts",
    oldRef: "Statutory Reference Search",
    answer: `Analysis for "${currentQuery}": Verified against Supreme Court precedent database and current statutory rules. Relevant procedural compliance applies under BNSS 2023 and Civil Procedure Code.`,
    citation: "Supreme Court of India Constitutional Bench Digest (2024)",
    tags: ["Verified Precedent", "Indian Law Corpus", "Active Citation"]
  };

  return (
    <section id="demo" className="landing-section" style={{ position: 'relative' }}>
      {/* Section Header */}
      <div className="landing-section-header">
        <div className="eyebrow-badge">
          <Sparkles size={14} /> INTERACTIVE PREVIEW
        </div>
        <h2 className="landing-section-title">See DhaaraAI in Action</h2>
        <p className="landing-section-desc">
          Watch how our AI legal associate cross-references BNS codes, audits contracts, and generates drafts under 60 seconds.
        </p>
      </div>

      {/* Main 2-Column Interactive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="demo-interactive-grid">

        {/* Left: Product UI Browser Mockup + Handwritten Annotation */}
        <div style={{ position: 'relative' }}>
          {/* Handwritten Annotation on Left */}
          <div style={{
            position: 'absolute',
            top: '-24px',
            left: '-20px',
            display: 'none',
            lg: 'block',
            zIndex: 30,
            transform: 'rotate(-5deg)',
            pointerEvents: 'none'
          }} className="handwritten-note">
            <span style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.45rem',
              color: '#1d4ed8',
              fontWeight: '700',
              lineHeight: 1.1,
              display: 'block'
            }}>
              Real queries.<br />Real answers.<br />Real Indian law. ⤵
            </span>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1px solid #e7e3da',
            boxShadow: '0 20px 50px -10px rgba(11, 19, 41, 0.09)',
            overflow: 'hidden'
          }}>
            {/* Browser Header Bar */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'Outfit',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  color: '#0b1329',
                  marginLeft: '0.5rem'
                }}>
                  <Scale size={15} color="#2563eb" /> DhaaraAI Studio
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '0.2rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.74rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Lock size={11} color="#059669" />
                <span>app.dhaaraai.com/research</span>
              </div>
            </div>

            {/* Studio Workspace Canvas */}
            <div style={{ padding: '1.75rem', background: '#faf8f5', minHeight: '430px' }}>
              {/* Studio Title */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e7e3da',
                paddingBottom: '0.85rem'
              }}>
                <div>
                  <h4 style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontSize: '1.25rem',
                    color: '#0b1329',
                    margin: '0 0 0.2rem 0',
                    fontWeight: '600'
                  }}>
                    Indian Statutory & Case Law Intelligence Studio
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Connected to Supreme Court, 25 High Courts, and BNS 2023 Concordance
                  </div>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: '700'
                }}>
                  Live Session
                </span>
              </div>

              {/* Active Query Display */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: '#1d4ed8',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Scale size={15} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                    Active Legal Inquiry
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#0b1329', fontWeight: '600' }}>
                    {currentQuery}
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              {isProcessing ? (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e7e3da',
                  borderRadius: '16px',
                  padding: '2.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    border: '3px solid #dbeafe',
                    borderTopColor: '#2563eb',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <div style={{ fontSize: '0.86rem', color: '#475569', fontWeight: '600' }}>
                    Retrieving statutory concordance & verifying precedents...
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e7e3da',
                  borderRadius: '16px',
                  padding: '1.4rem',
                  boxShadow: '0 4px 16px rgba(11, 19, 41, 0.04)'
                }}>
                  {/* Category & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '6px', fontWeight: '700' }}>
                      {activeData.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>

                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#0b1329',
                    marginBottom: '0.35rem'
                  }}>
                    {activeData.statute}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.85rem', fontWeight: '500' }}>
                    {activeData.oldRef}
                  </div>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#334155',
                    lineHeight: '1.65',
                    marginBottom: '1.25rem'
                  }}>
                    {activeData.answer}
                  </p>

                  {/* Precedent Citation */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.65rem 0.95rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem'
                  }}>
                    <span style={{ color: '#1d4ed8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ExternalLink size={13} /> {activeData.citation}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Law Report Verified</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {activeData.tags.map((tag, i) => (
                      <span key={i} style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '500'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            background: '#f8fafc',
            padding: '0.35rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid #e2e8f0'
          }}>
            {[
              { id: 'prompts', label: 'Sample Prompts', icon: Sparkles },
              { id: 'upload', label: 'Upload Doc', icon: Upload },
              { id: 'voice', label: 'Voice Input', icon: Mic }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem',
                  borderRadius: '9px',
                  background: activeTab === tab.id ? '#ffffff' : 'transparent',
                  color: activeTab === tab.id ? '#1d4ed8' : '#64748b',
                  fontWeight: activeTab === tab.id ? '700' : '500',
                  fontSize: '0.78rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={13} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content based on Tab */}
          {activeTab === 'prompts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {Object.keys(sampleScenarios).map((prompt, i) => {
                const isSelected = currentQuery === prompt;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectScenario(prompt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      background: isSelected ? '#eff6ff' : '#fcfbf9',
                      border: isSelected ? '1px solid #93c5fd' : '1px solid #e7e3da',
                      color: isSelected ? '#1d4ed8' : '#334155',
                      fontWeight: isSelected ? '600' : '500',
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <span>{prompt}</span>
                    <ArrowRight size={15} color={isSelected ? '#1d4ed8' : '#94a3b8'} />
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'upload' && (
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '14px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: '#f8fafc',
              marginBottom: '1.5rem'
            }}>
              <Upload size={32} color="#2563eb" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0b1329', marginBottom: '0.25rem' }}>
                Upload Contract, Petition or Notice
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                Supports PDF, DOCX, and high-res scans up to 25MB
              </div>
              <button
                onClick={() => handleSelectScenario("Analyze a Non-Disclosure Agreement")}
                className="btn-secondary-pill"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1.15rem' }}
              >
                Load Sample Agreement
              </button>
            </div>
          )}

          {activeTab === 'voice' && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
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
                margin: '0 auto 1rem',
                border: '1px solid #bfdbfe'
              }}>
                <Mic size={24} />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0b1329', marginBottom: '0.25rem' }}>
                Bilingual Speech-to-Law Assistant
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                Speak in Hindi or English to search statutes and high court rulings
              </div>
              <button
                onClick={() => handleSelectScenario("What is section 420 IPC in the new BNS?")}
                className="btn-secondary-pill"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1.15rem' }}
              >
                Simulate Hindi Voice Query
              </button>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#faf8f5',
            border: '1px solid #cbd5e1',
            borderRadius: '999px',
            padding: '0.4rem 0.5rem 0.4rem 1.15rem'
          }}>
            <input
              type="text"
              placeholder="Type a legal query to test the engine..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '0.84rem',
                color: '#0b1329'
              }}
            />
            <button
              type="submit"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#1d4ed8',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
                flexShrink: 0
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .demo-interactive-grid {
            grid-template-columns: 1fr !important;
          }
          .handwritten-note {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
