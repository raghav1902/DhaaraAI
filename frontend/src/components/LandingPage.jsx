import React, { useState, useEffect } from 'react';
import { ArrowRight, Scale, Search, FileText, CheckCircle2, MessageSquare, Star, Menu } from 'lucide-react';

export default function LandingPage({ onExplore }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dhaara-landing" style={{
      backgroundColor: '#eef2f6',
      backgroundImage: `linear-gradient(rgba(200, 210, 220, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 210, 220, 0.4) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
        
        .dhaara-landing {
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          overflow-x: hidden;
        }

        h1, h2, h3, h4, .outfit-font {
          font-family: 'Outfit', sans-serif;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        /* Animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
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
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        /* Buttons */
        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(37,99,235, 0.4);
        }
        
        .btn-secondary {
          background: white;
          color: #0f172a;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        /* Hero */
        .hero-section {
          padding: 160px 20px 100px;
          text-align: center;
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          color: #475569;
          max-width: 700px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
        }

        /* Stats */
        .stats-container {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        /* Features */
        .section-container {
          padding: 100px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .feature-grid {
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }
        .feature-row {
          display: flex;
          align-items: center;
          gap: 4rem;
        }
        .feature-row:nth-child(even) {
          flex-direction: row-reverse;
        }
        .feature-content {
          flex: 1;
        }
        .feature-visual {
          flex: 1;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          border-radius: 24px;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          animation: float 6s ease-in-out infinite;
        }
        
        .feature-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #eff6ff;
          color: #2563eb;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        /* Audience Cards */
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .audience-card {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .audience-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }

        /* Pricing */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          align-items: center;
        }
        .pricing-card {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          padding: 3rem 2rem;
          border-radius: 24px;
          position: relative;
          transition: all 0.3s ease;
        }
        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }
        .pricing-card.popular {
          border: 2px solid #3b82f6;
          transform: scale(1.05);
        }
        .pricing-card.popular:hover {
          transform: scale(1.05) translateY(-5px);
        }
        
        /* Footer */
        .footer {
          border-top: 1px solid rgba(0,0,0,0.05);
          padding: 4rem 2rem 2rem;
          margin-top: 4rem;
          background: white;
        }

        @media (max-width: 768px) {
          .feature-row, .feature-row:nth-child(even) {
            flex-direction: column;
            gap: 2rem;
          }
          .pricing-card.popular, .pricing-card.popular:hover {
            transform: scale(1);
          }
          .nav-links {
            display: none;
          }
          .stats-container {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
          <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '8px' }}>
            <Scale size={24} color="white" />
          </div>
          DhaaraAI
        </div>
        
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#0f172a'} onMouseOut={e=>e.target.style.color='#475569'}>Features</a>
          <a href="#solutions" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#0f172a'} onMouseOut={e=>e.target.style.color='#475569'}>Solutions</a>
          <a href="#pricing" style={{ color: '#475569', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#0f172a'} onMouseOut={e=>e.target.style.color='#475569'}>Pricing</a>
        </div>

        <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button style={{ background: 'transparent', border: 'none', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>Login</button>
          <button className="btn-primary" onClick={onExplore} style={{ padding: '0.5rem 1.25rem' }}>
            Start for Free
          </button>
        </div>
        
        <button className="mobile-menu-btn" style={{ display: 'none', background: 'transparent', border: 'none', color: '#0f172a' }}>
          <Menu size={24} />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '999px', marginBottom: '2rem', fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>
          <Sparkles size={16} color="#2563eb" /> Introducing DhaaraAI - Smarter Legal Workflows
        </div>
        <h1 className="hero-title animate-fade-in-up delay-100">
          Revolutionize your legal work with <span className="gradient-text">DhaaraAI</span>
        </h1>
        <p className="hero-subtitle animate-fade-in-up delay-200">
          Get verified legal answers, review any contract, search millions of cases, and generate custom agreements instantly with our virtual legal assistant.
        </p>
        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onExplore} style={{ padding: '1rem 2rem', fontSize: '1.1rem', animation: 'pulseGlow 2s infinite' }}>
            Try For Free Now <ArrowRight size={20} />
          </button>
          <button className="btn-secondary" onClick={onExplore} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            View Demo
          </button>
        </div>
        
        <div className="stats-container animate-fade-in-up delay-300">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', color: '#0f172a' }}>10k+</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Legal Professionals</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', color: '#0f172a' }}>2M+</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Legal Queries Processed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#0f172a' }}>
              4.9 <Star size={24} fill="#f59e0b" color="#f59e0b" />
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>User Rating</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-container">
        <div className="section-header">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything you need for efficient legal work</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>A powerful platform combining AI research, document analysis, and drafting in one seamless experience.</p>
        </div>

        <div className="feature-grid">
          {/* Feature 1 */}
          <div className="feature-row">
            <div className="feature-content">
              <div className="feature-badge"><MessageSquare size={16} /> AI Legal Chatbot</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Instant answers with verified citations</h3>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Chat with our AI legal assistant and get instant answers drawn from comprehensive databases of case law, statutes, and precedents.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem' }}>
                {['Instant answers to complex legal questions', 'Verified citations from real sources', '24/7 availability for legal guidance'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#334155', fontWeight: '500' }}>
                    <CheckCircle2 size={20} color="#2563eb" /> {item}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary" onClick={onExplore}>Try AI Chatbot <ArrowRight size={16} /></button>
            </div>
            <div className="feature-visual">
              <div style={{ width: '80%', height: '70%', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scale size={16} color="white" />
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0 12px 12px 12px', fontSize: '0.9rem', color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>Based on the Indian Contract Act, 1872, section 73... [Citation: Hadley v Baxendale]</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
                  <div style={{ background: '#2563eb', padding: '1rem', borderRadius: '12px 0 12px 12px', fontSize: '0.9rem', color: 'white' }}>Can you summarize the precedent for damages?</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-row">
            <div className="feature-content">
              <div className="feature-badge"><Search size={16} /> Case Law AI</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Advanced AI reasoning for complex scenarios</h3>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Search millions of cases with semantic understanding. Find relevant precedents faster than traditional boolean searches.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem' }}>
                {['Access millions of court judgments', 'Advanced semantic AI-powered search', 'Find relevant precedents instantly'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#334155', fontWeight: '500' }}>
                    <CheckCircle2 size={20} color="#2563eb" /> {item}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary" onClick={onExplore}>Start Researching <ArrowRight size={16} /></button>
            </div>
            <div className="feature-visual" style={{ animationDelay: '1s' }}>
               <div style={{ width: '80%', height: '70%', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ background: 'white', border: '1px solid #e2e8f0', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 1rem', color: '#64748b', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><Search size={16} /> Search cases involving intellectual property...</div>
                 <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                   <div style={{ width: '60%', height: '12px', background: '#cbd5e1', borderRadius: '4px', marginBottom: '0.5rem' }} />
                   <div style={{ width: '90%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
                   <div style={{ width: '80%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }} />
                 </div>
               </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-row">
            <div className="feature-content">
              <div className="feature-badge"><FileText size={16} /> AI Document Review</div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Upload, analyze, and review contracts</h3>
              <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Upload legal documents, contracts, and agreements. Chat with your documents, identify risks, and get instant summaries.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem' }}>
                {['Instant contract review & summaries', 'Risk identification & clause highlights', 'Interactive chat with your documents'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#334155', fontWeight: '500' }}>
                    <CheckCircle2 size={20} color="#2563eb" /> {item}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary" onClick={onExplore}>Analyze Documents <ArrowRight size={16} /></button>
            </div>
            <div className="feature-visual" style={{ animationDelay: '2s' }}>
               <div style={{ width: '80%', height: '80%', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', overflow: 'hidden' }}>
                 <div style={{ flex: 1, borderRight: '1px solid #e2e8f0', padding: '1.5rem', background: 'white' }}>
                   <div style={{ width: '40%', height: '12px', background: '#cbd5e1', borderRadius: '4px', marginBottom: '1rem' }} />
                   <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
                   <div style={{ width: '90%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
                   <div style={{ width: '95%', height: '8px', background: 'rgba(239,68,68,0.2)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                 </div>
                 <div style={{ width: '40%', padding: '1.5rem', background: '#fff1f2' }}>
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>High Risk Detected</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Liability clause is overly broad and favors the counterparty.</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Audience */}
      <section id="solutions" className="section-container">
        <div className="section-header">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Designed for everyone who needs legal help</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Tailored AI solutions for different professional needs.</p>
        </div>
        
        <div className="audience-grid">
          {[
            { title: 'Legal Professionals', desc: 'Accelerate legal research with AI precision and automate routine drafting.' },
            { title: 'Business Owners', desc: 'Review contracts, understand legal obligations, and mitigate risks early.' },
            { title: 'Law Firms', desc: 'Scale your practice with enterprise-grade AI legal research and document tools.' },
            { title: 'Individuals', desc: 'Get clear, jargon-free answers to everyday legal questions and disputes.' }
          ].map((item, i) => (
            <div key={i} className="audience-card" style={{ animationDelay: `${i * 100}ms` }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>AI for {item.title}</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>{item.desc}</p>
              <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Learn more <ArrowRight size={14} /></a>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-container">
        <div className="section-header">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Choose the plan that fits you</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>All plans include a 3-day free trial.</p>
        </div>

        <div className="pricing-grid">
          {/* Basic */}
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Basic</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>$13.99<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/mo</span></div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Billed annually</p>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}>Get Started</button>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Advanced AI Model Access', 'Unlimited Queries', 'Up-to-Date Legal Data', 'Standard Support'].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}><CheckCircle2 size={18} color="#2563eb" /> {feat}</li>
              ))}
            </ul>
          </div>
          
          {/* Plus */}
          <div className="pricing-card popular">
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Most Popular</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Plus</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>$34.99<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/mo</span></div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Billed annually</p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}>Get Started</button>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Advanced AI Model Access', 'Unlimited Queries', 'Document Upload (PDF/Image)', 'Document Review (50/mo)', 'Document Generation', 'Priority Support'].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}><CheckCircle2 size={18} color="#2563eb" /> {feat}</li>
              ))}
            </ul>
          </div>
          
          {/* Premium */}
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Premium</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>$69.99<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>/mo</span></div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Billed annually</p>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}>Get Started</button>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Everything in Plus', 'Document Review (Unlimited)', 'Web Search Access', 'Deep Research Mode', 'Dedicated Account Manager'].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}><CheckCircle2 size={18} color="#2563eb" /> {feat}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif', marginBottom: '1rem' }}>
              <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '8px' }}>
                <Scale size={24} color="white" />
              </div>
              DhaaraAI
            </div>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your all-in-one Legal Companion. Revolutionizing legal research, document review, and drafting with advanced artificial intelligence.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'AI Legal Assistant', href: '#features' },
                  { label: 'Case Law AI', href: '#features' },
                  { label: 'Document Review', href: '#features' },
                  { label: 'Contract Generator', href: '#features' },
                  { label: 'Pricing', href: '#pricing' }
                ].map((link, i) => (
                  <li key={i}><a href={link.href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem' }} onMouseOver={e=>e.target.style.color='#0f172a'} onMouseOut={e=>e.target.style.color='#475569'}>{link.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'About Us', modal: 'About Us' },
                  { label: 'Contact', href: 'mailto:support@dhaaraai.com' },
                  { label: 'Blog', modal: 'Blog' },
                  { label: 'Privacy Policy', modal: 'Privacy Policy' },
                  { label: 'Terms of Service', modal: 'Terms of Service' }
                ].map((link, i) => (
                  <li key={i}>
                    {link.href ? (
                      <a href={link.href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem' }} onMouseOver={e=>e.target.style.color='#0f172a'} onMouseOut={e=>e.target.style.color='#475569'}>{link.label}</a>
                    ) : (
                      <button onClick={() => setActiveModal(link.modal)} style={{ background: 'none', border: 'none', padding: 0, color: '#475569', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }} onMouseOver={e=>e.target.style.color='#0f172a'} onMouseOut={e=>e.target.style.color='#475569'}>{link.label}</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          © 2026 DhaaraAI, All rights reserved.
        </div>
      </footer>

      {/* Modal */}
      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease-out' }} onClick={() => setActiveModal(null)}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', maxWidth: '700px', width: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transform: 'translateY(0)', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>{activeModal}</h2>
            
            <div style={{ marginBottom: '2.5rem' }}>
              {activeModal === 'About Us' && (
                <>
                  <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>
                    DhaaraAI was founded with a single, clear mission: to democratize access to legal intelligence. 
                    We believe that everyone—from solo practitioners and large law firms to ordinary citizens—deserves fast, accurate, and affordable legal assistance.
                  </p>
                  <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>
                    By harnessing the power of advanced artificial intelligence, we've built a platform that simplifies complex legal research, automates tedious document reviews, and empowers you to make informed decisions with confidence.
                  </p>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginTop: '2rem', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Our Vision</h4>
                    <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>To be the world's most trusted AI legal companion, ensuring justice and legal clarity are never out of reach.</p>
                  </div>
                </>
              )}

              {activeModal === 'Blog' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>LEGAL TECH • RECENT</div>
                    <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#0f172a' }}>How AI is Reshaping Contract Review</h4>
                    <p style={{ color: '#475569', fontSize: '1rem', margin: 0, lineHeight: '1.6' }}>Discover how modern AI models can identify risky clauses and save hours of manual review time for legal teams...</p>
                    <a href="#" style={{ color: '#2563eb', fontSize: '0.95rem', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: '500' }}>Read more &rarr;</a>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>PRODUCT UPDATE • PREVIOUS</div>
                    <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#0f172a' }}>Introducing Case Law Semantic Search</h4>
                    <p style={{ color: '#475569', fontSize: '1rem', margin: 0, lineHeight: '1.6' }}>We are thrilled to announce our new semantic search engine that understands the context behind your legal queries...</p>
                    <a href="#" style={{ color: '#2563eb', fontSize: '0.95rem', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', fontWeight: '500' }}>Read more &rarr;</a>
                  </div>
                </div>
              )}

              {activeModal === 'Privacy Policy' && (
                <div style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7' }}>
                  <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Last updated: Current Date</p>
                  <h4 style={{ color: '#0f172a', margin: '2rem 0 0.75rem', fontSize: '1.2rem' }}>1. Information We Collect</h4>
                  <p>We collect information you provide directly to us when you create an account, use our AI chat, or upload documents for review. This may include personal details and the contents of uploaded files.</p>
                  <h4 style={{ color: '#0f172a', margin: '2rem 0 0.75rem', fontSize: '1.2rem' }}>2. How We Use Your Information</h4>
                  <p>Your data is strictly used to provide, maintain, and improve our services. <strong>We strictly do not use your private legal documents to train our public AI models.</strong> Your data belongs to you.</p>
                  <h4 style={{ color: '#0f172a', margin: '2rem 0 0.75rem', fontSize: '1.2rem' }}>3. Data Security</h4>
                  <p>We implement enterprise-grade encryption (AES-256) to protect your sensitive legal information against unauthorized access, alteration, or destruction. We regularly audit our security practices.</p>
                </div>
              )}

              {activeModal === 'Terms of Service' && (
                <div style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.7' }}>
                  <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Effective Date: Current Date</p>
                  <h4 style={{ color: '#0f172a', margin: '2rem 0 0.75rem', fontSize: '1.2rem' }}>1. Acceptance of Terms</h4>
                  <p>By accessing or using DhaaraAI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                  <h4 style={{ color: '#0f172a', margin: '2rem 0 0.75rem', fontSize: '1.2rem' }}>2. Not Legal Advice</h4>
                  <p>DhaaraAI provides an AI-powered legal research and drafting tool. <strong style={{ color: '#ef4444' }}>The output generated by our AI does not constitute formal legal advice.</strong> You should always consult a qualified attorney for specific legal issues and before taking legal action.</p>
                  <h4 style={{ color: '#0f172a', margin: '2rem 0 0.75rem', fontSize: '1.2rem' }}>3. User Obligations</h4>
                  <p>You agree not to use the service for any unlawful purpose, to upload documents containing malicious code, or to attempt to reverse engineer the platform's AI models.</p>
                </div>
              )}
            </div>

            <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>Close Window</button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// Sparkles Icon component
function Sparkles(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
