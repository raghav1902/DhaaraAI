import re

file_path = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI\frontend\src\components\LandingPage.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix 1: The grid background
text = text.replace(
    "backgroundImage: `linear-gradient(rgba(200, 210, 220, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 210, 220, 0.4) 1px, transparent 1px)`",
    "backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`"
)

# Fix 2: Global text color in .dhaara-landing CSS
text = text.replace(
    ".dhaara-landing {\n          font-family: 'Inter', sans-serif;\n          color: #0f172a;",
    ".dhaara-landing {\n          font-family: 'Inter', sans-serif;\n          color: var(--text-main);"
)

# Fix 3: Add --grid-line to variables
text = text.replace("--nav-bg: rgba(255, 255, 255, 0.85);", "--nav-bg: rgba(255, 255, 255, 0.85);\n          --grid-line: rgba(200, 210, 220, 0.4);")
text = text.replace("--nav-bg: rgba(2, 6, 23, 0.85);", "--nav-bg: rgba(2, 6, 23, 0.85);\n          --grid-line: rgba(255, 255, 255, 0.05);")

# Fix 4: Force some dark mode overrides in CSS (much safer than inline replaces for edge cases)
css_overrides = """
        .dhaara-landing.dark * {
          border-color: var(--border-color);
        }
        .dhaara-landing.dark h1, .dhaara-landing.dark h2, .dhaara-landing.dark h3, .dhaara-landing.dark h4 {
          color: var(--text-main) !important;
        }
        .dhaara-landing.dark p, .dhaara-landing.dark .text-muted {
          color: var(--text-muted) !important;
        }
        .dhaara-landing.dark .card, .dhaara-landing.dark [style*="background: white"], .dhaara-landing.dark [style*="background: 'white'"], .dhaara-landing.dark [style*="background: var(--card-bg)"] {
          background-color: var(--card-bg) !important;
        }
        .dhaara-landing.dark [style*="background: '#eff6ff'"] {
          background-color: #1e3a8a !important;
          color: #bfdbfe !important;
        }
        .dhaara-landing.dark [style*="color: '#0f172a'"] {
          color: var(--text-main) !important;
        }
        .dhaara-landing.dark .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        /* Keep blue buttons intact */
        .dhaara-landing.dark .btn-primary {
          background-color: #2563eb !important;
          color: white !important;
          border: none !important;
        }
"""
text = text.replace("/* Animations */", css_overrides + "\n        /* Animations */")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Dark theme enhanced.")
