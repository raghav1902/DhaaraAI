import re

file_path = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI\frontend\src\components\LandingPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace hardcoded CSS inside the <style> block
text = text.replace('background: white;', 'background: var(--card-bg);')
text = text.replace('background-color: white;', 'background-color: var(--card-bg);')
text = text.replace('border: 1px solid #e2e8f0;', 'border: 1px solid var(--border-color);')
text = text.replace('color: #0f172a;', 'color: var(--text-main);')
text = text.replace('color: #475569;', 'color: var(--text-muted);')
text = text.replace('background: #f8fafc;', 'background: var(--bg-muted);')
text = text.replace('background: #eff6ff;', 'background: var(--bg-muted);')
text = text.replace('border-color: #cbd5e1;', 'border-color: var(--border-color);')
text = text.replace('border-top: 1px solid rgba(0,0,0,0.05);', 'border-top: 1px solid var(--border-color);')
text = text.replace('background: rgba(255, 255, 255, 0.85);', 'background: var(--nav-bg);')

# Also fix that #fff1f2 in the third feature visual block (it's inline)
text = text.replace("background: '#fff1f2'", "background: 'rgba(239, 68, 68, 0.05)'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("CSS style block properly themed.")
