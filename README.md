# ⚖️ DhaaraAI (LegalGPT) - Indian Legal Intelligence & Automated Drafting Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg)](https://web.dev/progressive-web-apps/)
[![Tests](https://img.shields.io/badge/Tests-17%20Passed-brightgreen.svg)]()

**DhaaraAI** is India's premier AI legal companion and automated drafting engine. Engineered specifically for Indian advocates, law students, and citizens, it bridges the monumental legal transition from the colonial **Indian Penal Code (IPC 1860)**, **CrPC 1973**, and **IEA 1872** to the new criminal statutory framework:
- **Bharatiya Nyaya Sanhita, 2023 (BNS)**
- **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA)**

Available in both **English and Hindi (हिंदी)** with native speech-to-text (STT) and voice audio recitation (TTS).

---

## 🌟 10 Comprehensive Platform Modules

### 1. 🤖 AI Legal Assistant (Ask AI with Voice & RAG)
- Query in plain English or Hindi (*"Someone defrauded me of ₹50,000 on UPI, what are the steps?"*).
- Real-time grounding with **ChromaDB vector search** and **Groq Llama 3.3 70B** / OSS-120B.
- Voice input (Speech-to-Text) and Audio reader (Text-to-Speech) with Markdown speech sanitizer.
- Procedural step-by-step guidance including cognizable/bailable classification and police station remedies.

### 2. 📝 Automated FIR & Statutory Legal Drafter
- 4-step interactive legal drafting wizard for:
  - **Police FIR Applications** (under Section 173 BNSS).
  - **Statutory Legal Demand Notices** (Cheque Bounce Sec 138 NI Act, Tenant deposit refund, Vendor breach).
- Autofill sample presets (Cyber fraud, cheque bounce, tenant dispute).
- Export to formatted **PDF (A4 Court standard)** and **Word (.doc)** with zero margin clipping.
- One-click save to the encrypted local Legal Vault.

### 3. 🔍 Smart Contract & Legal Document Risk Analyzer
- **Direct PDF/TXT File Upload**: Drag and drop real rental deeds, employment bonds, or service agreements (`.pdf`, `.txt`, `.md`).
- Multi-page document text extraction via `pypdf`.
- Audits clauses against the **Indian Contract Act, 1872**, Model Tenancy Act, and Consumer Protection laws.
- Flags unfair penalties, unlawful lock-ins, and non-compete covenants.
- Generates **balanced alternative clauses** ready for signature negotiation.

### 4. 🔄 BNS 2023 ↔ IPC 1860 Live Concordance & Section Converter
- Rapid cross-reference lookup covering Theft (Sec 303 BNS ↔ 379 IPC), Fraud (Sec 318(4) BNS ↔ 420 IPC), Murder (Sec 103 BNS ↔ 302 IPC), Hit-and-Run (Sec 106 BNS), and hundreds of criminal statutes.
- Instant comparison of changes in minimum punishment, fine, cognizable nature, and trial procedure under BNSS.

### 5. 🛡️ Citizen Legal Rights & Emergency Playbook
- Step-by-step situational guide for emergency encounters:
  - **Police Detention / Arrest**: Section 35(3) BNSS mandatory notice requirements, *Arnesh Kumar* directives, and Sec 47-53 arrestee rights.
  - **Cyber Financial Fraud**: Immediate golden-hour protocol (1930 Helpline, bank dispute timeline).
  - **Traffic Police Stop**: Digilocker compliance, spot fine rules under MV Act 2024.
  - **Unlawful Eviction**: Tenant protection and criminal trespass remedies.
- Direct tap-to-call emergency helplines: **1930** (Cyber Crime), **112** (National Emergency), **1091** (Women Safety), **15100** (NALSA Free Legal Aid).

### 6. 🔐 Encrypted Legal Vault
- 4-digit PIN-protected client-side vault for saving drafts, FIR copies, and contract risk audits.
- Full offline confidentiality: data remains stored locally on your device.
- In-vault draft previewer, copy, and export capabilities.

### 7. ⚖️ Legal Fee & Traffic Fine Calculator
- **Property Stamp Duty & Registration**: State-wise rates (Delhi, Maharashtra, UP, Karnataka, etc.) with gender concessions for female/joint buyers.
- **Civil Court Fees**: Ad-valorem suit valuation calculator.
- **Consumer Dispute Forum Filing Fees**: Updated 2024 zero-fee thresholds up to ₹5 Lakhs.
- **Traffic Challan Fine Estimator**: Motor Vehicles Amendment Act 2024 penalty breakdowns.

### 8. 🌐 Cyber Crime & Dark-Web Breach Scanner
- Live, zero-logging query against verified global dark-web breaches powered by open-source **XposedOrNot** intelligence.
- Immediate breach summary and actionable 2FA / 1930 helpline guidance.

### 9. 📚 Indian Legal Library & Statutory Archive
- Category-based statutory explorer for CrPC/BNSS trial procedures, landmark safeguards, and IPC/BNS concordance.
- One-click handoff from statutory section to AI Legal Assistant for contextual explanation.

### 10. ⚙️ Preferences & Multilingual Settings
- Switch between **English** and **Hindi (हिंदी)** dynamically across all 10 modules.
- Light and Dark UI theme toggles.
- Profile manager and secure Vault PIN change/reset controls.

---

## 📱 Progressive Web App (PWA) & Mobile Responsiveness
- **Install on Mobile / Desktop**: Full manifest and service worker configuration with offline fallback.
- **Adaptive Drawer Navigation**: Slide-over drawer with backdrop overlay for phone viewports ($\le 868\text{px}$).
- **Zero Horizontal Overflow**: Fluid typography clamps and auto-wrapping tables and forms.

---

## 🧪 Automated Test Suite (Code Reliability)

DhaaraAI includes an end-to-end automated test suite covering backend statutory endpoints and frontend datasets:

### Running Backend Tests (13 Tests):
```bash
cd backend
py test_backend_suite.py
```
*Validates Concordance accuracy, RAG offline fallback, FIR draft structure, Contract Risk heuristics, and live FastAPI endpoints (`/api/health`, `/api/converter`, `/api/library`, `/api/upload-document`, `/api/analyze-contract`).*

### Running Frontend Tests (Vitest):
```bash
cd frontend
npm test
```
*Validates real statutory concordance data, official helplines (1930, 112), and fine schedules.*

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Free Groq API Key** (from [console.groq.com](https://console.groq.com/keys))

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/DhaaraAI.git
cd DhaaraAI/backend

# Create virtual environment (optional but recommended)
py -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
# Edit .env and paste: GROQ_API_KEY="your_groq_api_key_here"

# Start the FastAPI server
py -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend API docs available at: http://localhost:8000/docs*

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev -- --host
```
- Open **http://localhost:5173** on your desktop.
- For local network testing on mobile devices, open the displayed LAN IP (e.g., `http://192.168.x.x:5173`).

---

## 📁 Repository Structure

```
DhaaraAI/
├── backend/
│   ├── data/                     # 77,000+ real statutory sections & concordance CSVs
│   │   ├── acts.csv              # 2,248 Central Acts
│   │   ├── sections.csv          # 77,074 statutory provisions
│   │   ├── mapping.csv           # IPC/BNS/CrPC/BNSS mappings
│   │   └── comprehensive_statutes.json
│   ├── src/                      # Core AI & Legal logic
│   │   ├── rag_engine.py         # Dense retrieval & Groq LLM orchestration
│   │   ├── bns_concordance.py    # Concordance search algorithms
│   │   ├── contract_analyzer.py  # Predatory clause auditing engine
│   │   ├── draft_templates.py    # Formal statutory legal templates
│   │   └── real_legal_fetcher.py # Landmark SC directives & guidelines
│   ├── main.py                   # FastAPI application & endpoints
│   ├── test_backend_suite.py     # Automated backend integration tests
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── public/
│   │   ├── manifest.json         # PWA Manifest
│   │   ├── service-worker.js     # PWA Service Worker & caching
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/           # 10 modular app components & landing subcomponents
│   │   ├── data/                 # Local concordance and citizen rights data
│   │   ├── tests/                # Vitest automated test suites
│   │   ├── App.jsx               # Main state router & responsive drawer
│   │   └── index.css             # Glassmorphism design tokens & media queries
│   ├── package.json
│   └── vite.config.js            # Rollup chunk splitting & PWA proxy
└── README.md
```

---

## ⚠️ Legal Disclaimer
*DhaaraAI provides legal technology tools, statutory concordance, and artificial intelligence-assisted drafting for educational, civic awareness, and drafting assistance purposes. It does NOT constitute formal legal advice or substitute the counsel of an enrolled advocate under the Advocates Act, 1961. Always consult a qualified legal professional for litigation and court representation.*

---

**Built with pride for Indian Legal Excellence 🇮🇳**
