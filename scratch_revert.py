import os
import subprocess

cwd = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI'

# 1. Restore the files to their original state (from commit a491278)
subprocess.run(['git', 'checkout', 'HEAD', '--', 'frontend/src/components/LandingPage.jsx', 'frontend/src/components/AuthPage.jsx', 'frontend/src/App.jsx'], cwd=cwd)

# 2. Add back the routing and "Back to Home" button in AuthPage.jsx
auth_file = os.path.join(cwd, r'frontend\src\components\AuthPage.jsx')
with open(auth_file, 'r', encoding='utf-8') as f:
    auth_text = f.read()

# Add ArrowLeft import
if 'ArrowLeft' not in auth_text:
    auth_text = auth_text.replace("import { Scale } from 'lucide-react';", "import { Scale, ArrowLeft } from 'lucide-react';")

# Add onBack prop
auth_text = auth_text.replace("export default function AuthPage({ onLogin }) {", "export default function AuthPage({ onLogin, onBack }) {")

# Add Back button HTML
back_btn_html = """      <button onClick={onBack} style={{
        position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', 
        background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', padding: '0.5rem 1rem', 
        borderRadius: '999px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', zIndex: 10
      }}>
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="auth-container">"""
auth_text = auth_text.replace('<div className="auth-container">', back_btn_html)

with open(auth_file, 'w', encoding='utf-8') as f:
    f.write(auth_text)

# 3. Add onBack routing to App.jsx
app_file = os.path.join(cwd, r'frontend\src\App.jsx')
with open(app_file, 'r', encoding='utf-8') as f:
    app_text = f.read()

app_text = app_text.replace(
    "return <AuthPage onLogin={(userData) => { setUser(userData); setAppView('app'); setActiveTab('chat'); }} />;",
    "return <AuthPage onLogin={(userData) => { setUser(userData); setAppView('app'); setActiveTab('chat'); }} onBack={() => setAppView('landing')} />;"
)
with open(app_file, 'w', encoding='utf-8') as f:
    f.write(app_text)


# 4. Inject InteractiveDemo back into LandingPage.jsx
landing_file = os.path.join(cwd, r'frontend\src\components\LandingPage.jsx')
with open(landing_file, 'r', encoding='utf-8') as f:
    landing_text = f.read()

old_demo = """function InteractiveDemo() {
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
  };"""

# We just find the InteractiveDemo function and replace it entirely!
import re
demo_start = landing_text.find("function InteractiveDemo() {")
if demo_start != -1:
    demo_end = landing_text.find("function Sparkles(props) {", demo_start)
    if demo_end != -1:
        # replace from demo_start to demo_end with new demo
        new_demo = """function InteractiveDemo() {
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
    <div style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--card-bg, white)', borderRadius: '24px', border: '1px solid var(--border-color, #e2e8f0)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div style={{ background: 'var(--bg-muted, #f8fafc)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color, #e2e8f0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ color: 'var(--text-light, #64748b)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> AES-256 Secure Chat (Live Demo)</div>
      </div>
      
      <div style={{ padding: '2rem', height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-main, #fafafa)' }}>
        {/* Intro */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
          <div style={{ background: 'var(--card-bg, white)', border: '1px solid var(--border-color, #e2e8f0)', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: 'var(--text-main, #0f172a)', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            Hello! I am DhaaraAI. Try asking me a real legal question right now. I am connected to the live backend!
          </div>
        </div>

        {/* Suggestion Chips */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginLeft: '52px' }}>
            <button onClick={() => handleQuery("What is section 420 of IPC in the new BNS?")} style={{ background: 'var(--card-bg, white)', border: '1px solid var(--border-color, #e2e8f0)', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted, #475569)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               What is section 420 of IPC in the new BNS?
            </button>
            <button onClick={() => handleQuery("What are the grounds for divorce under Hindu Marriage Act?")} style={{ background: 'var(--card-bg, white)', border: '1px solid var(--border-color, #e2e8f0)', padding: '0.75rem 1rem', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--text-muted, #475569)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               What are the grounds for divorce?
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: msg.role === 'user' ? '#0f172a' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {msg.role === 'user' ? <User size={18} color="white" /> : <Scale size={18} color="white" />}
            </div>
            <div style={{ background: msg.role === 'user' ? '#0f172a' : 'var(--card-bg, white)', color: msg.role === 'user' ? 'white' : 'var(--text-main, #0f172a)', border: msg.role === 'assistant' ? '1px solid var(--border-color, #e2e8f0)' : 'none', padding: '1rem 1.5rem', borderRadius: msg.role === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.6', maxWidth: '80%' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scale size={18} color="white" /></div>
            <div style={{ background: 'var(--card-bg, white)', border: '1px solid var(--border-color, #e2e8f0)', padding: '1rem 1.5rem', borderRadius: '0 16px 16px 16px', color: 'var(--text-main, #0f172a)', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ padding: '1rem 2rem', background: 'var(--card-bg, white)', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-muted, #f8fafc)', padding: '0.5rem 1.5rem', borderRadius: '999px', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <input 
            type="text" 
            placeholder="Type a legal query to test the engine..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', color: 'var(--text-main, #0f172a)', padding: '0.5rem 0' }} 
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
        landing_text = landing_text[:demo_start] + new_demo + landing_text[demo_end:]
        with open(landing_file, 'w', encoding='utf-8') as f:
            f.write(landing_text)

print("Files restored successfully and re-injected integrations.")
