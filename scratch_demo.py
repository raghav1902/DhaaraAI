import re

file_path = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI\frontend\src\components\LandingPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Wire up the Login button
text = text.replace(
    "<button style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>Login</button>",
    "<button onClick={onExplore} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>Login</button>"
)

# 2. Rewrite InteractiveDemo to actually hit the backend
old_demo = """// Interactive Demo component
function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  const handlePromptClick = () => {
    if (step !== 0) return;
    setStep(1); // User clicked
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(2); // AI replied
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div style={{ background: 'var(--bg-muted)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> AES-256 Secure Chat</div>
      </div>
      
      <div style={{ padding: '2rem', height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fafafa' }}>
        {/* Intro */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: 'var(--text-main)', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            Hello! I am DhaaraAI. How can I assist you with your legal research or drafting today?
          </div>
        </div>

        {/* Suggestion Chips */}
        {step === 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginLeft: '52px' }}>
            <button onClick={handlePromptClick} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.borderColor='#2563eb'} onMouseOut={e=>e.currentTarget.style.borderColor='#cbd5e1'}>
               Draft a standard Non-Disclosure Agreement (NDA)
            </button>
            <button onClick={handlePromptClick} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.borderColor='#2563eb'} onMouseOut={e=>e.currentTarget.style.borderColor='#cbd5e1'}>
               What are the new provisions for cyber fraud under BNS?
            </button>
          </div>
        )}

        {/* User Message */}
        {step >= 1 && (
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row-reverse' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={18} color="white" /></div>
            <div style={{ background: '#0f172a', color: 'white', padding: '1rem 1.5rem', borderRadius: '16px 0 16px 16px', fontSize: '0.85rem' }}>
              Draft a standard Non-Disclosure Agreement (NDA)
            </div>
          </div>
        )}

        {/* Typing / Response */}
        {step >= 1 && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: 'var(--text-main)', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', minWidth: '200px' }}>
              {typing ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '24px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.2s' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.4s' }} />
                </div>
              ) : (
                <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                  <h4 style={{ margin: '0 0 1rem', color: 'var(--text-main)' }}>Mutual Non-Disclosure Agreement</h4>
                  <p style={{ margin: '0 0 0.5rem' }}>This Agreement is made on <strong>[Date]</strong>, between <strong>[Party A]</strong> and <strong>[Party B]</strong>.</p>
                  <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1rem' }}>
                    <li><strong>1. Confidential Information:</strong> Refers to all non-public data...</li>
                    <li><strong>2. Obligations:</strong> The Receiving Party shall hold the information in strict confidence...</li>
                  </ul>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}><FileText size={16} /> Download Full Draft (PDF/Docx)</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1rem 2rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-muted)', padding: '0.75rem 1.5rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <input type="text" placeholder="Type a legal query..." disabled style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', color: 'var(--text-muted)' }} />
          <Send size={18} color="#94a3b8" />
        </div>
      </div>
    </div>
  );
}"""

new_demo = """// Interactive Demo component
function InteractiveDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (queryText) => {
    if (!queryText.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: queryText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while connecting to the engine. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuery(input);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div style={{ background: 'var(--bg-muted)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> AES-256 Secure Chat (Live Demo)</div>
      </div>
      
      <div style={{ padding: '2rem', height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-main)' }}>
        {/* Intro */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: 'var(--text-main)', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            Hello! I am DhaaraAI. Try asking me a real legal question right now. I am connected to the live backend!
          </div>
        </div>

        {/* Suggestion Chips */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginLeft: '52px' }}>
            <button onClick={() => handleQuery("What is section 420 of IPC in the new BNS?")} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.borderColor='#2563eb'} onMouseOut={e=>e.currentTarget.style.borderColor='#cbd5e1'}>
               What is section 420 of IPC in the new BNS?
            </button>
            <button onClick={() => handleQuery("What are the grounds for divorce under Hindu Marriage Act?")} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.borderColor='#2563eb'} onMouseOut={e=>e.currentTarget.style.borderColor='#cbd5e1'}>
               What are the grounds for divorce?
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: msg.role === 'user' ? '#0f172a' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {msg.role === 'user' ? <User size={18} color="white" /> : <Scale size={18} color="white" />}
            </div>
            <div style={{ background: msg.role === 'user' ? '#0f172a' : 'var(--card-bg)', color: msg.role === 'user' ? 'white' : 'var(--text-main)', border: msg.role === 'assistant' ? '1px solid var(--border-color)' : 'none', padding: '1rem 1.5rem', borderRadius: msg.role === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', maxWidth: '80%' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: 'var(--text-main)', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1rem 2rem', background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-muted)', padding: '0.5rem 1.5rem', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
          <input 
            type="text" 
            placeholder="Type a legal query to test the engine..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', color: 'var(--text-main)', padding: '0.5rem 0' }} 
          />
          <button onClick={() => handleQuery(input)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Send size={18} color={input.trim() ? "#2563eb" : "#94a3b8"} />
          </button>
        </div>
      </div>
    </div>
  );
}"""

if old_demo in text:
    text = text.replace(old_demo, new_demo)
else:
    print("WARNING: Could not find old_demo exactly.")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("InteractiveDemo hooked up to actual backend and Login button wired.")
