import os

cwd = r'c:\Users\ragha\OneDrive\Desktop\DhaaraAI'
landing_file = os.path.join(cwd, r'frontend\src\components\LandingPage.jsx')

with open(landing_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix imports
import_line = "import { ArrowRight, Scale, Search, FileText, CheckCircle2, MessageSquare, Star, Menu, ShieldAlert, Globe, Calculator, Lock, ArrowRightLeft, ChevronDown } from 'lucide-react';"
if import_line in text:
    new_import_line = "import { ArrowRight, Scale, Search, FileText, CheckCircle2, MessageSquare, Star, Menu, ShieldAlert, Globe, Calculator, Lock, ArrowRightLeft, ChevronDown, Send, User, BookOpen } from 'lucide-react';"
    text = text.replace(import_line, new_import_line)

with open(landing_file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Imports fixed.")
