import re

file_path = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI\frontend\src\components\LandingPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Comprehensive color replacements in inline styles
# 1. White backgrounds
text = re.sub(r"background:\s*'white'", "background: 'var(--card-bg)'", text)
text = re.sub(r"backgroundColor:\s*'white'", "backgroundColor: 'var(--card-bg)'", text)
text = re.sub(r"background:\s*'#ffffff'", "background: 'var(--card-bg)'", text)
text = re.sub(r"backgroundColor:\s*'#ffffff'", "backgroundColor: 'var(--card-bg)'", text)

# 2. Light grey / muted backgrounds
text = re.sub(r"background:\s*'#f8fafc'", "background: 'var(--bg-muted)'", text)
text = re.sub(r"backgroundColor:\s*'#f8fafc'", "backgroundColor: 'var(--bg-muted)'", text)
text = re.sub(r"background:\s*'#f1f5f9'", "background: 'var(--bg-muted)'", text)
text = re.sub(r"backgroundColor:\s*'#f1f5f9'", "backgroundColor: 'var(--bg-muted)'", text)
text = re.sub(r"background:\s*'#eef2f6'", "background: 'var(--bg-main)'", text)
text = re.sub(r"backgroundColor:\s*'#eef2f6'", "backgroundColor: 'var(--bg-main)'", text)

# 3. Text colors
text = re.sub(r"color:\s*'#0f172a'", "color: 'var(--text-main)'", text)
text = re.sub(r"color:\s*'#1e293b'", "color: 'var(--text-main)'", text)
text = re.sub(r"color:\s*'#334155'", "color: 'var(--text-main)'", text)
text = re.sub(r"color:\s*'#475569'", "color: 'var(--text-muted)'", text)
text = re.sub(r"color:\s*'#64748b'", "color: 'var(--text-light)'", text)
text = re.sub(r"color:\s*'#94a3b8'", "color: 'var(--text-light)'", text)

# 4. Borders
text = re.sub(r"border:\s*'1px solid #e2e8f0'", "border: '1px solid var(--border-color)'", text)
text = re.sub(r"borderBottom:\s*'1px solid #e2e8f0'", "borderBottom: '1px solid var(--border-color)'", text)
text = re.sub(r"borderTop:\s*'1px solid #e2e8f0'", "borderTop: '1px solid var(--border-color)'", text)
text = re.sub(r"borderRight:\s*'1px solid #e2e8f0'", "borderRight: '1px solid var(--border-color)'", text)
text = re.sub(r"border:\s*'1px solid #cbd5e1'", "border: '1px solid var(--border-color)'", text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Hardcoded inline styles comprehensively replaced.")
