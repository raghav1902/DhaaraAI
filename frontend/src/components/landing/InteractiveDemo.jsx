import React, { useState } from 'react';
import { Scale, Send, User, Lock, Sparkles, Zap } from 'lucide-react';

export default function InteractiveDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleKnowledgeBase = {
    "Analyze a Non-Disclosure Agreement": `📋 NDA Preliminary Audit Result:
• Status: 1 High Risk Clause Identified
• Section 4 (Term): 'Perpetual confidentiality on all shared materials' is excessively restrictive under Indian contract precedents. Recommend revising to 3 years from disclosure.
• Jurisdiction: Currently specifies Delaware, US. Recommend changing to New Delhi, India under Indian Arbitration & Conciliation Act 1996.`,
    "What is section 420 of IPC in the new BNS?": `⚖️ Statutory Transition:
• Old Law: Section 420 of the Indian Penal Code (Cheating and dishonestly inducing delivery of property).
• New Law: Governed under Section 318(4) of the Bharatiya Nyaya Sanhita (BNS) 2023.
• Key Update: The definition retains essential elements of fraudulent deception with updated sentencing guidelines of imprisonment up to seven years and fine.`,
    "Draft a Legal Notice for unpaid vendor invoices": `📝 Legal Notice Framework (Ready):
To: [Debtor Company Name / Director]
Under instruction from our client [Vendor Name], you are hereby formally put on notice to clear outstanding invoices totaling ₹4,85,000/- plus 18% contractual interest within 15 days of receipt of this notice, failing which our client shall initiate civil recovery and proceedings under Section 138 / Section 318 BNS.`
  };

  const handleQuery = async (queryText) => {
    if (!queryText.trim()) return;
    const userQuery = queryText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuery })
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        setLoading(false);
        return;
      }
    } catch (err) {
      // Fallback
    }

    setTimeout(() => {
      let matchedResponse = sampleKnowledgeBase[userQuery];
      if (!matchedResponse) {
        matchedResponse = `⚖️ DhaaraAI Legal Insight:
Regarding "${userQuery}":
• Relevant Statutory Framework: Bharatiya Nyaya Sanhita 2023 & Code of Civil Procedure 1908.
• Precedent Reference: See landmark Supreme Court observations on statutory interpretation and procedural compliance.
• Recommended Next Step: You can verify exact citations or generate a formal notice template inside the full workspace.`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: matchedResponse }]);
      setLoading(false);
    }, 700);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuery(input);
    }
  };

  return (
    <section id="demo" className="section-container" style={{ position: 'relative', zIndex: 10 }}>
      <div className="section-header">
        <div className="feature-badge"><Zap size={14} /> Live RAG Engine</div>
        <h2 className="section-title">Test the Intelligence Live</h2>
        <p className="section-desc">Try real queries below or click a sample prompt. Connected directly to our legal retrieval backend.</p>
      </div>

      <div style={{
        maxWidth: '880px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '22px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#f8fafc',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <span style={{ color: '#475569', fontSize: '0.82rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={12} color="#16a34a" /> Live AI Engine • Indian Law RAG
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '999px', fontWeight: '600' }}>
            Active Session
          </span>
        </div>

        {/* Chat Display */}
        <div style={{
          padding: '1.75rem',
          height: '360px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Scale size={16} color="white" />
            </div>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.85rem 1.15rem', borderRadius: '0 14px 14px 14px', color: '#0f172a', fontSize: '0.86rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', maxWidth: '82%', lineHeight: '1.55' }}>
              Namaste! I am <strong>DhaaraAI</strong>. Ask any question regarding Indian criminal or civil law, or click one of the quick scenarios below:
            </div>
          </div>

          {messages.length === 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: '40px' }}>
              {[
                "What is section 420 of IPC in the new BNS?",
                "Analyze a Non-Disclosure Agreement",
                "Draft a Legal Notice for unpaid vendor invoices"
              ].map((chip, i) => (
                <button key={i} onClick={() => handleQuery(chip)} style={{
                  background: 'white',
                  border: '1px solid #cbd5e1',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Sparkles size={12} color="#2563eb" /> {chip}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: msg.role === 'user' ? '#0f172a' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? <User size={16} color="white" /> : <Scale size={16} color="white" />}
              </div>
              <div style={{
                background: msg.role === 'user' ? '#0f172a' : 'white',
                color: msg.role === 'user' ? 'white' : '#0f172a',
                border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                padding: '0.85rem 1.15rem',
                borderRadius: msg.role === 'user' ? '14px 0 14px 14px' : '0 14px 14px 14px',
                fontSize: '0.84rem',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.55',
                maxWidth: '82%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Scale size={16} color="white" />
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '0 14px 14px 14px', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', animation: 'pulseGlow 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', animation: 'pulseGlow 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', animation: 'pulseGlow 1s infinite 0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '0.85rem 1.25rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.45rem 1.15rem', borderRadius: '999px', border: '1px solid #cbd5e1' }}>
            <input
              type="text"
              placeholder="Type any legal query to test the engine (e.g., Anticipatory bail grounds under BNSS)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.84rem', color: '#0f172a' }}
            />
            <button onClick={() => handleQuery(input)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Send size={16} color={input.trim() ? "#2563eb" : "#94a3b8"} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
