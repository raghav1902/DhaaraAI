import re
import os

cwd = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI'
landing_file = os.path.join(cwd, r'frontend\src\components\LandingPage.jsx')
with open(landing_file, 'r', encoding='utf-8') as f:
    landing_text = f.read()

new_demo = """
// Interactive Demo component
function InteractiveDemo() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
    <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> AES-256 Secure Chat (Live Demo)</div>
      </div>
      
      <div style={{ padding: '2rem', height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fafafa' }}>
        {/* Intro */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: '#0f172a', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            Hello! I am DhaaraAI. Try asking me a real legal question right now. I am connected to the live backend!
          </div>
        </div>

        {/* Suggestion Chips */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginLeft: '52px' }}>
            <button onClick={() => handleQuery("What is section 420 of IPC in the new BNS?")} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: '#475569', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               What is section 420 of IPC in the new BNS?
            </button>
            <button onClick={() => handleQuery("What are the grounds for divorce under Hindu Marriage Act?")} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: '#475569', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               What are the grounds for divorce?
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: msg.role === 'user' ? '#0f172a' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {msg.role === 'user' ? <User size={18} color="white" /> : <Scale size={18} color="white" />}
            </div>
            <div style={{ background: msg.role === 'user' ? '#0f172a' : 'white', color: msg.role === 'user' ? 'white' : '#0f172a', border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none', padding: '1rem 1.5rem', borderRadius: msg.role === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', maxWidth: '80%' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: '#0f172a', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1rem 2rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.5rem 1.5rem', borderRadius: '999px', border: '1px solid #e2e8f0' }}>
          <input 
            type="text" 
            placeholder="Type a legal query to test the engine..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', color: '#0f172a', padding: '0.5rem 0' }} 
          />
          <button onClick={() => handleQuery(input)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Send size={18} color={input.trim() ? "#2563eb" : "#94a3b8"} />
          </button>
        </div>
      </div>
    </div>
  );
}
"""

if "function InteractiveDemo()" not in landing_text:
    landing_text = landing_text + "\n" + new_demo

# We also need to add it to the UI!
interactive_demo_ui = """
      {/* Interactive Demo Section */}
      <section className="section-container" style={{ position: 'relative', zIndex: 10, marginTop: '-5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Experience the Magic Instantly</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No sign-up required. Try our live RAG engine right now.</p>
        </div>
        <InteractiveDemo />
      </section>
"""
if "Interactive Demo Section" not in landing_text:
    landing_text = landing_text.replace("{/* Features Section */}", interactive_demo_ui + "\n      {/* Features Section */}")

with open(landing_file, 'w', encoding='utf-8') as f:
    f.write(landing_text)
