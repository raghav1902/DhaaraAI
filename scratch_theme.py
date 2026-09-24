import re

file_path = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI\frontend\src\components\LandingPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add theme state
text = text.replace('const [activeModal, setActiveModal] = useState(null);', 
                    "const [activeModal, setActiveModal] = useState(null);\n  const [theme, setTheme] = useState('light');")

# 2. Add class to dhaara-landing
text = text.replace('className="dhaara-landing"', 'className={`dhaara-landing ${theme}`}')

# 3. Add CSS variables
css_vars = """
        .dhaara-landing.light {
          --bg-main: #eef2f6;
          --bg-muted: #f8fafc;
          --card-bg: white;
          --text-main: #0f172a;
          --text-muted: #475569;
          --text-light: #64748b;
          --border-color: #e2e8f0;
          --nav-bg: rgba(255, 255, 255, 0.85);
        }
        .dhaara-landing.dark {
          --bg-main: #020617;
          --bg-muted: #0f172a;
          --card-bg: #1e293b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --text-light: #cbd5e1;
          --border-color: #334155;
          --nav-bg: rgba(2, 6, 23, 0.85);
        }
"""
text = text.replace('.dhaara-landing {', css_vars + '\n        .dhaara-landing {')

# 4. Safely replace exact inline color strings
text = text.replace("color: '#0f172a'", "color: 'var(--text-main)'")
text = text.replace("color: '#475569'", "color: 'var(--text-muted)'")
text = text.replace("color: '#64748b'", "color: 'var(--text-light)'")
text = text.replace("background: 'white'", "background: 'var(--card-bg)'")
text = text.replace("background: '#f8fafc'", "background: 'var(--bg-muted)'")
text = text.replace("backgroundColor: '#eef2f6'", "backgroundColor: 'var(--bg-main)'")
text = text.replace("border: '1px solid #e2e8f0'", "border: '1px solid var(--border-color)'")
text = text.replace("borderRight: '1px solid #e2e8f0'", "borderRight: '1px solid var(--border-color)'")
text = text.replace("borderBottom: '1px solid #e2e8f0'", "borderBottom: '1px solid var(--border-color)'")
text = text.replace("borderTop: '1px solid #e2e8f0'", "borderTop: '1px solid var(--border-color)'")
text = text.replace("background: '#eef2f6'", "background: 'var(--bg-main)'")

# 5. Fix the button toggle
toggle_pattern = r'<button style=\{\{\s*background:\s*\'transparent\',\s*border:\s*\'none\',\s*color:\s*\'(?:#475569|var\(--text-muted\))\'.*?<Sun size=\{20\} />\s*</button>'
new_btn = '''<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(150,150,150,0.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>'''

text = re.sub(toggle_pattern, new_btn, text, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Theme variables injected.")
