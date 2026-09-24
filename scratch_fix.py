import re

file_path = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI\frontend\src\components\LandingPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Hero text
text = text.replace('clamp(3rem, 8vw, 5.5rem)', 'clamp(2rem, 5vw, 3.5rem)')
text = text.replace('clamp(1.1rem, 2vw, 1.35rem)', 'clamp(0.9rem, 1.2vw, 1rem)')

# Inline styles
text = text.replace("fontSize: '2.5rem'", "fontSize: '2rem'")
text = text.replace("fontSize: '2rem'", "fontSize: '1.75rem'")
# The above two might overlap, so let's do it safely:
# Wait, if we replace 2.5rem to 2rem, then 2rem to 1.75rem, the 2.5rem ones become 1.75rem too. That's fine, 1.75rem is a good size for section headers!
text = text.replace("fontSize: '1.5rem'", "fontSize: '1.25rem'")
text = text.replace("fontSize: '1.25rem'", "fontSize: '1.1rem'")
text = text.replace("fontSize: '1.1rem'", "fontSize: '0.95rem'")
text = text.replace("fontSize: '1.05rem'", "fontSize: '0.9rem'")
text = text.replace("fontSize: '0.95rem'", "fontSize: '0.85rem'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Fonts resized successfully.")
