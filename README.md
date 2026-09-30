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
- Subtle Supreme Court dome architectural horizon silhouette seamlessly integrated into the hero header.

### 2. 📝 Automated FIR & Statutory Legal Drafter
- 5-step interactive legal drafting wizard for:
  - **Police FIR Applications** (under Section 173 BNSS).
  - **Statutory Legal Demand Notices** (Cheque Bounce Sec 138 NI Act, Tenant deposit refund, Vendor breach).
- Split-screen studio with live, real-time updated A4 legal document preview.
- Autofill sample presets (Cyber fraud, cheque bounce, tenant dispute).
- Export to formatted **PDF (A4 Court standard)** and **Word (.doc)** with zero margin clipping.
- One-click direct save to the encrypted local Legal Vault.

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
- **Locked Stage**:
  - Imposing judicial archive environment featuring high-detail teakwood law libraries, red-ribbon court petition dossiers, and circular steel bank vault door marked *"JUDICIAL ARCHIVE"*.
  - Atmospheric radial vignette with high-contrast, frosted glass PIN unlock card (`backdrop-filter: blur(24px)`).
  - Client-side encryption: 4-6 digit PIN protection with zero cloud telemetry.
- **Unlocked Workspace**:
  - Compact header with real-time active session badge, emerald pulse dot, and client AES-256 telemetry.
  - Balanced dual-column layout eliminating empty space.
  - Integrated High Court library archive background (`law_library.webp`) with frosted specimen schema cards.
  - Actionable 1-click guidance cards connecting to Drafting Studio and Contract Risk Audit.
  - In-vault document preview modal, clipboard copy, and `.txt` file export.

### 7. ⚖️ Statutory Legal Fee & Assessment Calculator
- **Statutory Assessment Receipt (Schedule I-A / Form VIII)**:
  - High-precision digital receipt with official court seal watermark, itemized statutory fee breakdown, and live recalculation.
- **Property Stamp Duty & Registration**: State-wise rates (Delhi, Maharashtra, UP, Karnataka, etc.) with gender concessions for female/joint buyers.
- **Civil Court Fees**: Ad-valorem suit valuation calculator based on state court fee schedules.
- **Consumer Dispute Forum Filing Fees**: Updated 2024 zero-fee thresholds up to ₹5 Lakhs.
- **Traffic Challan Fine Estimator**: Motor Vehicles Amendment Act 2024 penalty breakdowns.

### 8. 🌐 Cyber Crime & Dark-Web Breach Scanner
- Live, zero-logging query against verified global dark-web breaches powered by open-source **XposedOrNot** intelligence.
- Deep technical cyber network aesthetic with illuminated node telemetry.
- Immediate breach summary and actionable 2FA / 1930 helpline guidance.

### 9. 📚 Indian Legal Library & Statutory Archive
- Category-based statutory explorer for CrPC/BNSS trial procedures, landmark safeguards, and IPC/BNS concordance.
- One-click handoff from statutory section to AI Legal Assistant for contextual explanation.

### 10. ⚙️ Preferences & Multilingual Settings
- Switch between **English** and **Hindi (हिंदी)** dynamically across all 10 modules.
- Light and Dark UI theme toggles.
- Profile manager and secure Vault PIN change/reset controls.

---

## 🎨 Architectural Design & Visual System

- **Full-Viewport Edge Docking**: Workstation stage docks flush with the top and sides of the browser window (`margin: 0; height: 100vh`), eliminating awkward floating gaps and internal nested scrollbars.
- **Editorial Legal Tech Imagery**: Custom-crafted, authentic Indian judicial imagery stored in `frontend/public/assets/legal/` (Supreme Court architecture, law libraries, drafting desks, property registries, and judicial archive vaults).
- **Subtle Horizontal Fading**: Cards blend seamlessly into their surrounding containers via pure horizontal linear gradients (`linear-gradient(90deg, var(--card-bg) 0%, ...)`), avoiding foggy or muddy vertical bands.
- **Accessible Glassmorphism**: Tailored backdrop blurs with high contrast, legible slate typography, and semantic color markers (Blue for primary/statute, Emerald for verified/bailable, Amber for financial, Crimson for emergencies, Purple for AI cognition).

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
.\venv\Scripts\python test_backend_suite.py
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

# Create and activate virtual environment
py -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
# Edit .env and paste: GROQ_API_KEY="your_groq_api_key_here"

# Start the FastAPI server
.\venv\Scripts\python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
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
│   │   ├── assets/legal/         # Curated Indian legal imagery & backdrops
│   │   │   ├── civic/            # Constitutional & civil rights visuals
│   │   │   ├── contracts/        # Contract audit textures
│   │   │   ├── cyber/            # Cyber network visuals
│   │   │   ├── drafting/         # Drafting studio desk visuals
│   │   │   ├── fees/             # Property registry textures
│   │   │   ├── hero/             # Supreme Court horizon silhouettes
│   │   │   ├── library/          # High Court library archive visuals
│   │   │   ├── statutes/         # Bare act code backgrounds
│   │   │   └── vault/            # Judicial archive vault backdrops
│   │   ├── manifest.json         # PWA Manifest
│   │   ├── service-worker.js     # PWA Service Worker & caching
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/           # 10 modular app components & subcomponents
│   │   ├── data/                 # Local concordance and citizen rights data
│   │   ├── tests/                # Vitest automated test suites
│   │   ├── App.jsx               # Main state router & responsive drawer
│   │   └── index.css             # Design system tokens, utilities & themes
│   ├── package.json
│   └── vite.config.js            # Vite build & chunk configuration
├── UI_DESIGN_EXPLANATION.md      # Detailed UI/UX design specifications
└── README.md                     # Platform overview & setup documentation
```

---

## ⚠️ Legal Disclaimer
*DhaaraAI provides legal technology tools, statutory concordance, and artificial intelligence-assisted drafting for educational, civic awareness, and drafting assistance purposes. It does NOT constitute formal legal advice or substitute the counsel of an enrolled advocate under the Advocates Act, 1961. Always consult a qualified legal professional for litigation and court representation.*

---

**Built with pride for Indian Legal Excellence 🇮🇳**
