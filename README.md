# ⚖️ DhaaraAI (LegalGPT) — Indian Legal Intelligence & Automated Drafting Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg)](https://web.dev/progressive-web-apps/)
[![Privacy Tests](https://img.shields.io/badge/Privacy%20Tests-11%20Passed-brightgreen.svg)]()
[![System Tests](https://img.shields.io/badge/System%20Tests-31%20Passed-brightgreen.svg)]()

**DhaaraAI** is India's flagship AI legal intelligence workstation and automated statutory drafting platform. Purpose-built for advocates, judicial aspirants, law students, and citizens, it operationalizes India's historic transition from the colonial **Indian Penal Code (IPC 1860)**, **Code of Criminal Procedure (CrPC 1973)**, and **Indian Evidence Act (IEA 1872)** to the new criminal jurisprudence:
- **Bharatiya Nyaya Sanhita, 2023 (BNS)**
- **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA)**

Available in **English** and **Hindi (हिंदी)** with native speech-to-text (STT) and voice audio recitation (TTS).

---

## 🌟 Key Features & Workspace Modules

### 1. 🤖 Ask AI (LegalGPT) with Permanent Chat History & Strict User Isolation
- **Dual Semantic RAG Engine**: ChromaDB dense retrieval across **21+ statutory act collections** and **66,106+ Supreme Court case law chunks** combined with Groq's high-throughput Llama 3.3 70B and OSS-120B models.
- **ChatGPT-Style Permanent Right Chat History**:
  - Auto-generated 3-6 word legal titles (*"Cheque Bounce Issue"*, *"Tenant Dispute & Rights"*, *"FIR Refusal Procedure"*).
  - Categorized chronological buckets: **Today**, **Yesterday**, **Previous 7 Days**, **Older**.
  - Relative timestamps, live search across user chats, inline renaming, and safe deletion confirmation.
- **Zero-Trust User Data Isolation (IDOR-Proof)**:
  - Cryptographically signed HMAC-SHA256 bearer tokens with server-verified identity (`Depends(get_current_user)`).
  - Every database query strictly filters by `WHERE owner_id = :authenticated_user_id AND is_deleted = 0`.
  - IDOR queries return indistinguishable `404 Not Found` responses.
- **Multi-Turn Context Management**: Retains conversational context for up to 6 turns with length truncation safeguards to protect LLM token budgets.

### 2. 📝 Automated Legal Drafter & Studio
- 12 High-frequency Indian statutory templates:
  1. *FIR Application (Sec 173 BNSS / 154 CrPC)*
  2. *Legal Demand Notice (Sec 138 NI Act)*
  3. *Cheque Bounce Notice*
  4. *Regular Bail Application (Sec 480 BNSS / 437 CrPC)*
  5. *Anticipatory Bail Application (Sec 482 BNSS / 438 CrPC)*
  6. *Consumer Forum Complaint (Consumer Protection Act 2019)*
  7. *Maintenance Petition (Sec 144 BNSS / 125 CrPC)*
  8. *General Affidavit & Verification*
  9. *Reply to Legal Notice*
  10. *RTI Application (Right to Information Act 2005)*
  11. *Rent Lease Breach & Eviction Notice*
  12. *General Civil / Writ Petition*
- Split-screen studio with live A4 Court preview, bilingual toggling, and export to **Word (.doc)** and **PDF (A4 standard)**.

### 3. 🔍 Smart Contract & Agreement Risk Analyzer
- Direct PDF/TXT file upload with `pypdf` extraction.
- Audits clauses against the **Indian Contract Act, 1872**, Model Tenancy Act, and Consumer Protection laws.
- Flags predatory clauses (unlawful lock-ins, unilateral termination, excessive penalty covenants) and generates fair alternative clauses.

### 4. 🔄 BNS 2023 ↔ IPC 1860 Master Concordance
- Instant statutory cross-reference lookup covering 77,000+ provisions.
- Side-by-side comparative analysis of changes in minimum sentence, bailable classification, compoundability, and trial procedure.

### 5. 📖 Interactive Indian Legal Glossary
- 150+ legal terms across 14+ legal categories (*Criminal Law, Civil Procedure, Constitutional Law, Evidence, Commercial, Family, etc.*).
- Hindi transliterations, simple citizen definitions, and related statutory sections.

### 6. 🛡️ Citizen Legal Rights & Emergency Playbook
- Actionable protocols for:
  - Police Detention & Arrest (*Section 35(3) BNSS mandatory notice requirements & Arnesh Kumar guidelines*).
  - Cyber Financial Fraud (*Golden hour 1930 helpline & bank lien procedure*).
  - Traffic Stop (*Digilocker validity & spot fine regulations*).
  - Unlawful Tenant Eviction.
- Direct tap-to-call emergency helplines: **1930** (Cyber), **112** (National), **1091** (Women), **15100** (NALSA Free Legal Aid).

### 7. 🔐 Encrypted Legal Vault
- Judicial archive vault visual design with PIN-secured client-side encryption.
- In-vault legal document storage, clipboard copying, and `.txt` file export with zero cloud leakage.

### 8. ⚖️ Statutory Legal Fee & Court Assessment Calculator
- Ad-valorem civil suit court fees based on state schedules.
- Property stamp duty and registration calculator with female/joint buyer concessions.
- Motor Vehicle 2024 penalty estimators and Consumer Forum threshold calculator.

### 9. 🌐 Cyber Crime & Data Breach Scanner
- Live, zero-logging query against verified dark-web data breaches powered by open-source **XposedOrNot** intelligence.
- Immediate breach summary and actionable 2FA / 1930 helpline remediation guidance.

### 10. 📚 Indian Legal Library & Statutory Archive
- Categorized Central Acts repository (BNSS, BNS, BSA, Constitution, CrPC, IPC).
- Direct handoff into Ask AI for situational explanation of any provision.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    DhaaraAI Web Client                     │
│  (React 19 + Vite 8 + Lucide Icons + Native Speech STT/TTS)│
└─────────────────────────────┬──────────────────────────────┘
                              │ Bearer Token (HMAC-SHA256)
                              ▼
┌────────────────────────────────────────────────────────────┐
│               FastAPI High-Performance Engine             │
│   (/api/query, /api/conversations, /api/draft, /api/auth)  │
└───────┬─────────────────────┬──────────────────────┬───────┘
        │                     │                      │
        ▼                     ▼                      ▼
┌───────────────┐     ┌───────────────┐      ┌───────────────┐
│ SQLite DB WAL │     │   ChromaDB    │      │  Groq Cloud   │
│ (Chat History │     │ Dense Vectors │      │  Llama 3.3    │
│  User Storage)│     │  (MiniLM-L6)  │      │   70B Model   │
└───────────────┘     └───────────────┘      └───────────────┘
```

---

## 🧪 Comprehensive Automated Test Suites

### 1. Privacy & Cross-User Isolation Suite (11 Tests)
Verifies that no user can see, search, rename, delete, append messages to, or access another user's conversation (IDOR prevention):
```bash
cd backend
.\venv\Scripts\python test_chat_privacy_suite.py
```
*Result: 11 passed (100%) in ~2.3 seconds.*

### 2. Phase 2 Functional Suite (20 Tests)
Verifies 12 draft templates, 150+ glossary terms, multi-layer routing, and dual statutory/case-law retrieval:
```bash
cd backend
.\venv\Scripts\python test_phase2_suite.py
```
*Result: 20 passed (100%).*

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Free Groq API Key** (from [console.groq.com](https://console.groq.com/keys))

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment & activate
python -m venv venv
.\venv\Scripts\activate   # On Windows
# source venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Groq API Key
echo GROQ_API_KEY="your_groq_api_key_here" > .env

# Run FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.


---

## 🚀 100% Free Production Deployment Architecture

DhaaraAI is engineered with a **Zero-Cost Production Blueprint (₹0 Total Spend)** allowing 24/7 cloud availability without depending on a local machine or paid servers:

```
[Global Litigants & Advocates (Web/Mobile)]
                     │
                     ▼ HTTPS
       ┌──────────────────────────────┐
       │   Vercel Global Edge CDN     │  (100% Free, SSL, Continuous CI/CD)
       │    Frontend (React 19+Vite)   │  URL: https://dhaara-ai.vercel.app
       └──────────────┬───────────────┘
                      │
                      ▼ REST API via VITE_API_BASE
       ┌──────────────────────────────┐
       │      Render.com Cloud VM     │  (100% Free Web Service, 750 hrs/mo)
       │    FastAPI Python Backend    │  URL: https://dhaara-ai-backend.onrender.com
       ├──────────────────────────────┤
       │ • In-Memory BNS Concordance  │  (2,016+ section cross-mappings)
       │ • 150+ Legal Glossary DB     │  (Native multi-domain dictionary)
       │ • 1,495+ Statutory Acts CSV  │  (Loaded from git disk on boot)
       │ • ChromaDB Self-Seeding      │  (Auto-vectorizes from JSON without 1.9GB manual upload)
       │ • User Accounts & Chats      │  (Isolated SQLite WAL / Cloud Persistent)
       └──────────────────────────────┘
```

### 🧠 Why You Don't Need to Upload 1.9 GB ChromaDB Manually
A common bottleneck in legal RAG systems is the massive size of precomputed vector embeddings (`chroma_db` directory exceeds ~1.9 GB locally). 

DhaaraAI solves this elegantly via **Zero-Upload Cloud Seeding**:
1. **Raw Statutory Dataset In Git**: Statutory files (`sections.csv`, `mapping.csv`, `comprehensive_statutes.json`) are only **~13 MB** in total and are tracked safely within Git under the 100 MB file limit.
2. **Self-Healing Vector Seeder (`embed_store.seed_defaults_if_empty()`)**: When the backend boots on Render with a clean state, it automatically detects an empty Chroma collection and constructs dense embeddings on the fly within seconds using local CPU transformers.
3. **Zero Git Bloat**: Heavy `.sqlite3` and `.bin` vector caches are kept in `.gitignore`, preventing GitHub push rejection errors while keeping cloud startup instantaneous.

### 🌐 Cloud Environment Variables

#### Backend (Render.com)
| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `gsk_...` | High-speed LLM inference (Llama 3.3 70B) |
| `DHAARA_CORS_ORIGINS` | `*` (or Vercel URL) | Allows cross-origin requests from the live frontend |
| `PYTHON_VERSION` | `3.11.0` | Pin Python runtime environment |

#### Frontend (Vercel)
| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE` | `https://dhaara-ai-backend.onrender.com` | Connects the live React UI to the Render cloud backend |

---

## 📁 Repository Structure

```
DhaaraAI/
├── backend/
│   ├── data/
│   │   ├── dhaara_chat.db        # SQLite chat history & users DB (WAL mode)
│   │   ├── acts.csv              # Central Acts repository
│   │   ├── sections.csv          # 77,074 statutory provisions
│   │   └── mapping.csv           # IPC/BNS/CrPC/BNSS mappings
│   ├── src/
│   │   ├── chat_history_db.py    # Persistent SQLite storage & HMAC auth layer
│   │   ├── rag_engine.py         # Dense vector retrieval & Groq Llama orchestrator
│   │   ├── draft_templates.py    # 12 Indian legal templates & dynamic draft generators
│   │   ├── legal_glossary.py     # 150+ legal terms across 14 legal domains
│   │   ├── bns_concordance.py    # Concordance search algorithms
│   │   └── contract_analyzer.py  # Contract clause risk auditing engine
│   ├── main.py                   # FastAPI REST API & endpoints
│   ├── test_chat_privacy_suite.py# 11 Privacy & user isolation tests
│   └── test_phase2_suite.py      # 20 Functional tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LegalChat.jsx     # Ask AI workspace with permanent right history
│   │   │   ├── LegalChat/        # ChatHistorySidebar, ChatMessageItem, ChatInputArea
│   │   │   ├── LegalDrafter.jsx  # 5-step legal drafting studio
│   │   │   ├── LegalLibrary.jsx  # Statutory explorer & glossary explorer
│   │   │   ├── DocumentAnalyzer.jsx # Contract clause risk auditor
│   │   │   ├── BnsConverter.jsx  # BNS ↔ IPC section concordance
│   │   │   ├── CitizenRights.jsx # Emergency rights & helpline playbook
│   │   │   ├── LegalVault.jsx    # PIN-encrypted judicial document archive
│   │   │   └── FeeCalculator.jsx # Stamp duty, court fee & fine estimator
│   │   ├── App.jsx               # App routing, layout dock, token synchronization
│   │   └── index.css             # High-contrast design system & dark mode tokens
│   └── package.json
└── README.md
```

---

## ⚠️ Legal Disclaimer
*DhaaraAI provides artificial intelligence-assisted legal research, statutory concordance, and drafting assistance for educational, research, and civic awareness purposes. It does NOT constitute formal legal advice or substitute the counsel of an enrolled advocate under the Advocates Act, 1961. Always consult an enrolled advocate for litigation, legal notices, and court representation.*
