# ⚖️ DhaaraAI (LegalGPT) — Indian Legal Intelligence & Automated Drafting Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-dhaara--ai--ebon.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://dhaara-ai-ebon.vercel.app/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Groq Llama 3.3](https://img.shields.io/badge/AI_Engine-Groq_Llama_3.3_70B-orange?style=flat-square&logo=groq)](https://groq.com)
[![ChromaDB](https://img.shields.io/badge/Vector_DB-ChromaDB_Dense_RAG-red?style=flat-square)](https://www.trychroma.com/)
[![Zero Trust Privacy](https://img.shields.io/badge/Security-IDOR--Proof_HMAC--SHA256-blueviolet?style=flat-square)]()
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_Web_App-blue.svg?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Automated Tests](https://img.shields.io/badge/Automated_Tests-31_Passed_(100%25)-brightgreen.svg?style=flat-square)]()
[![Zero Cost Cloud](https://img.shields.io/badge/Cloud_Cost-₹0_Total_Spend-success?style=flat-square)]()

**An enterprise-grade, bilingual (English & हिंदी) AI legal workstation and statutory drafting platform operationalizing India's historic transition to the new criminal laws: BNS, BNSS, and BSA.**

[🌐 Explore Live Application](https://dhaara-ai-ebon.vercel.app/) • [⚡ REST API Documentation](https://dhaara-ai-backend.onrender.com/docs) • [📖 Academic Synopsis (15 Pages)](./PROJECT_SYNOPSIS_15_PAGES.md) • [🎨 UI/UX Architecture](./UI_DESIGN_EXPLANATION.md)

</div>

---

## 📌 Executive Overview

On **July 1, 2024**, the Republic of India instituted its most comprehensive criminal justice overhaul since 1860, sunsetting colonial statutes and enacting three new foundational codes:
- **Bharatiya Nyaya Sanhita, 2023 (BNS)** *(replacing the Indian Penal Code, 1860)*
- **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)** *(replacing the Code of Criminal Procedure, 1973)*
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA)** *(replacing the Indian Evidence Act, 1872)*

This tectonic shift impacted **1.4+ billion citizens, 1.7+ million advocates, law enforcement agencies, and the judicial system**. Navigating newly renumbered sections, modified procedural mandates, altered bail parameters, and complex transitional provisions (*Article 20(1) ex-post facto protections*) created immense informational friction.

**DhaaraAI** bridges this justice accessibility gap. Built as a high-performance, full-stack domain intelligence platform, DhaaraAI unifies **Dense Retrieval-Augmented Generation (RAG)**, Supreme Court case precedent retrieval, automated court-standard drafting, bilingual voice interfaces, and an IDOR-proof multi-tenant security architecture into a unified, free-to-access workstation.

---

## 📊 Key Highlights & Metrics

| Metric | Specification | Impact & Significance |
|:---|:---|:---|
| 🏛️ **Statutory Repository** | **77,074+** Statutory Provisions | Complete coverage across Central Acts, BNS, BNSS, BSA, IPC, CrPC & IEA |
| ⚖️ **Judicial Precedents** | **66,106+** Supreme Court Case Chunks | Grounded retrieval for landmark rulings (*Arnesh Kumar*, *Lalita Kumari*, *Antil*) |
| 📝 **Drafting Studio** | **12** Court-Ready Legal Templates | Instant generation of FIRs, Bail petitions, Section 138 notices, and Affidavits |
| 🔄 **Concordance Mapping** | **2,016+** Bidirectional Cross-Sections | Instant delta analysis: penalties, bailability, compoundability, and trial changes |
| 📖 **Bilingual Glossary** | **150+** Domain Terms across 14 Categories | Hindi (हिंदी) transliteration, simplified citizen definitions, and statutory links |
| 🛡️ **User Privacy & Security**| **100% IDOR-Proof** Cryptographic HMAC | Multi-tenant user isolation with zero cross-user conversation or vault leakage |
| ⚡ **Inference Latency** | **< 1.8s** High-Throughput Token Streaming | Powered by Groq LPU inference (Llama 3.3 70B Versatile & OSS-120B) |
| 💰 **Cloud Infrastructure** | **₹0 (100% Free Tier Blueprint)** | Production availability on Vercel Edge + Render VM with zero cold-upload overhead |

---

## 🌟 Core Workstation Modules

```
                             ┌─────────────────────────────────┐
                             │       DHAARAAI WORKSTATION      │
                             └──────────────┬──────────────────┘
        ┌───────────────────┬───────────────┼───────────────────┬───────────────────┐
        ▼                   ▼               ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  LegalGPT    │    │  Statutory   │ │ BNS ↔ IPC    │    │   Contract   │    │  Citizen SOS │
│ Conversational│    │   Drafter    │ │ Concordance  │    │ Risk Auditor │    │ & Helplines  │
│  Dual-RAG    │    │ 12 Templates │ │ 77k Sections │    │ PDF / TXT    │    │ 1930 / 112   │
└──────────────┘    └──────────────┘ └──────────────┘    └──────────────┘    └──────────────┘
        │                   │               │                   │                   │
        ▼                   ▼               ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐ ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Court Fee   │    │  Dark-Web    │ │  Encrypted   │    │ Legal Archive│    │ Native Voice │
│  Calculator  │    │Breach Scanner│ │  Vault (AES) │    │ & Glossary   │    │  (STT & TTS) │
│ State Rules  │    │ XposedOrNot  │ │ PIN-Secured  │    │ 150+ Terms   │    │ English/Hindi│
└──────────────┘    └──────────────┘ └──────────────┘    └──────────────┘    └──────────────┘
```

### 1. 🤖 LegalGPT (Ask AI) — Dual-Corpus Dense RAG
- **Dual Vector Space**: ChromaDB dense semantic retrieval over **21+ Central Statutory Acts** alongside **66,106+ Supreme Court case law chunks** (embeddings generated via `all-MiniLM-L6-v2`).
- **Grounded Precedent Synthesis**: Automatically retrieves and cites landmark precedents (*Arnesh Kumar v. State of Bihar*, *Satender Kumar Antil v. CBI*, *Lalita Kumari v. Govt. of UP*).
- **Persistent ChatGPT-Style Chat History**:
  - Auto-generates concise 3-6 word legal headlines (*"Cheque Bounce Sec 138 Notice"*, *"Anticipatory Bail Procedure"*).
  - Chronological categorizations: **Today**, **Yesterday**, **Previous 7 Days**, **Older**.
  - In-sidebar search, inline conversation renaming, and safe deletion confirmation.
- **Strict Server-Side Isolation (Zero-Trust IDOR-Proof)**:
  - Cryptographically signed HMAC-SHA256 bearer tokens.
  - Every SQL query verifies `WHERE owner_id = :authenticated_user_id AND is_deleted = 0`.
  - Foreign access attempts return strict, indistinguishable `404 Not Found` errors.
- **Voice-Enabled Workflow**: Web Speech API integration for native speech-to-text input and natural voice readouts in English and Hindi.

### 2. 📝 Automated Statutory Legal Drafter & Studio
- **12 High-Frequency Court-Ready Templates**:
  1. *FIR Application (Section 173 BNSS / 154 CrPC)*
  2. *Legal Demand Notice (Section 138 Negotiable Instruments Act)*
  3. *Cheque Dishonour Notice*
  4. *Regular Bail Application (Section 480 BNSS / 437 CrPC)*
  5. *Anticipatory Bail Application (Section 482 BNSS / 438 CrPC)*
  6. *Consumer Forum Complaint (Consumer Protection Act, 2019)*
  7. *Maintenance Petition (Section 144 BNSS / 125 CrPC)*
  8. *General Affidavit & Verification*
  9. *Formal Reply to Legal Notice*
  10. *RTI Application (Right to Information Act, 2005)*
  11. *Tenancy Lease Breach & Eviction Notice*
  12. *Civil & Writ Petition Template*
- **Split-Screen Studio**: Live A4 Court preview pane with real-time variable injection.
- **Courtroom Export**: One-click export to formatted **Microsoft Word (.doc)** and **Standard Court A4 PDF**.

### 3. 🔍 Smart Contract & Agreement Risk Analyzer
- **Multi-Format Parsing**: Instant parsing of uploaded PDF and plain text agreements via `pypdf`.
- **Statutory Heuristics**: Audited against the **Indian Contract Act, 1872**, Model Tenancy Act, and statutory labor codes.
- **Predatory Clause Flagging**: Detects unilateral termination clauses, unreasonable lock-in periods, non-compete overreach, and uncapped indemnities.
- **Balanced Redlining**: Generates equitable, bilateral alternative clauses for immediate contract negotiation.

### 4. 🔄 BNS 2023 ↔ IPC 1860 Master Concordance
- **Bidirectional Mapping**: Comprehensive lookup across 77,000+ provisions of IPC ↔ BNS, CrPC ↔ BNSS, and IEA ↔ BSA.
- **Procedural Delta Engine**: Instant side-by-side comparison of changes in minimum punishment, cognizable status, bailable classification, compoundability, and trial court jurisdiction.
- **Transitional Guidance**: Clear advisory on whether to charge under IPC or BNS depending on the date of offense commission (pre/post July 1, 2024).

### 5. ⚖️ Statutory Legal Fee & Court Assessment Calculator
- **Civil Court Fees**: State-specific ad-valorem schedules for money suits, partition, and declarations.
- **Stamp Duty & Registration**: Real estate transaction calculation with gender-based female/joint buyer concessions.
- **Motor Vehicle Penalties**: Updated 2024 MV Act traffic violation schedules with repeat offense tiers.
- **Consumer Dispute Jurisdiction**: Threshold limits for District, State, and National Consumer Commissions under the CPA 2019.

### 6. 🔐 Encrypted Legal Vault & Secure Sharing
- **Zero-Knowledge Architecture**: Client-side PIN encryption ensuring privileged legal drafts and notices never touch cloud storage unencrypted.
- **Judicial Archive Aesthetics**: Bank-grade vault interface with local session caching.
- **Controlled Sharing**: Expiring, password-protected shareable links for client-advocate collaboration.

### 7. 🛡️ Citizen Legal Rights & Emergency SOS Playbook
- **Immediate Procedural Protocols**:
  - *Police Arrest & Detention:* Section 35(3) BNSS mandatory notice requirements & *Arnesh Kumar* guidelines.
  - *Cyber Financial Fraud:* Golden hour protocol and bank lien freezing mechanism.
  - *Traffic Stops:* DigiLocker / mParivahan digital document validity & spot fine regulations.
  - *Unlawful Eviction:* Due process requirements and injunction remedies.
- **One-Tap Emergency Helplines**:
  - `1930` — National Cyber Crime Reporting Portal
  - `112` — National Emergency Response Support System (ERSS)
  - `1091` — Women Helpline
  - `15100` — NALSA Free Legal Aid Authority

### 8. 🌐 Cyber Crime & Dark-Web Data Breach Scanner
- **Zero-Logging Privacy**: Live email compromise audit utilizing open-source **XposedOrNot** intelligence.
- **Threat Vector Analysis**: Discloses compromised passwords, plain-text leaks, and exposure sources.
- **Remediation Roadmap**: Step-by-step containment instructions and 1930 portal reporting guidance.

### 9. 📚 Statutory Legal Library & Interactive Glossary
- **Central Acts Repository**: Searchable full-text catalog of primary statutes (BNS, BNSS, BSA, Constitution of India, CrPC, IPC).
- **Interactive Glossary**: 150+ legal terms across 14 legal domains (*Criminal, Civil, Constitutional, Evidence, Commercial, Family, etc.*) with native Hindi transliterations and statutory linkages.

---

## 🏛️ System Architecture

DhaaraAI operates on a decoupled client-server architecture designed for high throughput, sub-2-second inference, and complete multi-tenant isolation:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PRESENTATION LAYER                                    │
│  React 19 • Vite 8 • CSS Design Tokens • PWA Service Worker • Lucide React • Speech API  │
│                     🌐 Live Edge URL: https://dhaara-ai-ebon.vercel.app/               │
└────────────────────────────────────────────┬────────────────────────────────────────────┘
                                             │ HTTPS / REST (JSON)
                                             │ Authorization: Bearer <HMAC-SHA256 Token>
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                FASTAPI BACKEND SERVICES                                 │
│  FastAPI 0.115 • SlowAPI Rate Limiter • Pydantic v2 • CORS Middleware • Uvicorn Server  │
│               🚀 Cloud API Base: https://dhaara-ai-backend.onrender.com                │
└───────┬────────────────────────────┬────────────────────────────┬───────────────────────┘
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────────────┐    ┌───────────────────────┐    ┌──────────────────────────────┐
│     STORAGE LAYER     │    │   SEMANTIC RAG CORE   │    │       AI INFERENCE           │
│                       │    │                       │    │                              │
│ • SQLite (WAL Mode)   │    │ • ChromaDB Vector DB  │    │ • Groq Cloud LPU             │
│   - chat_history      │    │ • all-MiniLM-L6-v2    │    │ • Llama 3.3 70B Versatile    │
│   - users & sessions  │    │ • 66,106 SC Judgments │    │ • Llama 3.1 8B Instant       │
│ • Statutory CSV Sets  │    │ • 21+ Statutory Acts  │    │ • OSS-120B Reasoning         │
│   - 77,074 provisions │    │ • Self-Seeding Engine │    │ • Sub-2s Streaming Latency   │
└───────────────────────┘    └───────────────────────┘    └──────────────────────────────┘
```

---

## ⚖️ Comparative Evaluation

| Feature / Dimension | Generic LLMs (ChatGPT / Claude) | Commercial Portals (SCC Online / Manupatra) | ⚖️ DhaaraAI (LegalGPT) |
|:---|:---|:---|:---|
| **BNS ↔ IPC Concordance** | Hallucinates or confuses old vs new section numbers | Static PDF search; no conversational assistance | Dynamic algorithmic bidirectional concordance across 77,000+ provisions |
| **Supreme Court Precedents** | General summaries; prone to fabricated citations | Raw judgment text without contextual synthesis | Dense semantic retrieval over 66,106 SC chunks directly cited in responses |
| **Automated Legal Drafting** | Unformatted plain text lacking statutory clauses | Blank static Word templates needing manual filling | Interactive 5-step wizard generating formal court-ready A4 Word/PDF drafts |
| **Contract Clause Auditing** | High-level advice lacking Indian statutory backing | Not supported | Clause-by-clause predatory risk audit with balanced counter-provisions |
| **Data Privacy & Tenancy** | Prompts stored in cloud for model retraining | Costly per-seat enterprise licensing | Server-side cryptographic HMAC isolation with zero cross-tenant leakage |
| **Bilingual Accessibility** | Hindi output is often broken or unnatural | English only | Native Hindi (हिंदी) and English with voice STT & TTS |
| **Accessibility & Cost** | Requires paid subscriptions ($20/mo) | Heavy annual paywalls (₹30,000+/yr) | **100% Free & Open-Access for Indian Citizens** |

---

## 🔒 Security, Privacy & IDOR Prevention

DhaaraAI enforces strict zero-trust principles across all authenticated operations:

```
[Incoming Request] ──► [Bearer Token] ──► [HMAC-SHA256 Signature Check]
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼ Valid                                                             ▼ Invalid
             [Extract User ID]                                                   [401 Unauthorized]
                      │
                      ▼
         [Enforce SQL Restriction]
   WHERE owner_id = :authenticated_user_id
                      │
        ┌─────────────┴─────────────┐
        ▼ Matches                   ▼ Does Not Match (IDOR Attempt)
 [Execute Operation]         [Return 404 Not Found] (Indistinguishable)
```

1. **HMAC-SHA256 Session Tokens**: Every bearer token is signed with a high-entropy server secret. Client-side manipulation of `user_id` is cryptographically invalidated.
2. **Server-Side Identity Verification**: Endpoints depend on `Depends(get_current_user)`. The authenticated user context is extracted exclusively from the validated token.
3. **Strict Query Parameterization**: Every database query explicitly mandates `WHERE owner_id = :authenticated_user_id AND is_deleted = 0`.
4. **Indistinguishable IDOR Mitigations**: Attempting to query, rename, append to, or delete a conversation owned by another user yields an opaque `404 Not Found`, giving zero information to attackers.
5. **SlowAPI Rate Limiting**: Protects authentication endpoints (`/api/auth/register`, `/api/auth/login`) against brute-force credential stuffing.
6. **Zero-Knowledge Vault**: Client documents in the Legal Vault are encrypted locally using AES before storage, ensuring plain text never touches the server.

---

## 🧪 Automated Test Verification

DhaaraAI maintains **31+ automated regression, privacy, and functional test cases**:

### 1. Privacy & User Isolation Suite (11 Tests)
Verifies that no user can read, search, rename, delete, append messages to, or access another user's conversation (IDOR prevention):
```bash
cd backend
python test_chat_privacy_suite.py
```
```text
test_append_message_to_other_user_conversation ... ok (404 Not Found)
test_delete_other_user_conversation ... ok (404 Not Found)
test_get_other_user_conversation ... ok (404 Not Found)
test_idor_search_isolation ... ok (0 items returned)
test_invalid_token_rejected ... ok (401 Unauthorized)
test_rename_other_user_conversation ... ok (404 Not Found)
test_soft_deleted_conversation_inaccessible ... ok
----------------------------------------------------------------------
Ran 11 tests in 2.148s - OK (100% Passed)
```

### 2. Functional & Retrieval Suite (20 Tests)
Validates all 12 drafting templates, 150+ glossary terms, concordance mappings, and dual-corpus retrieval:
```bash
cd backend
python test_phase2_suite.py
```
```text
test_all_12_templates_generate_valid_drafts ... ok
test_bns_ipc_bidirectional_concordance ... ok
test_contract_analyzer_flags_predatory_clauses ... ok
test_glossary_domain_categorization ... ok
test_supreme_court_precedent_citation ... ok
----------------------------------------------------------------------
Ran 20 tests in 4.821s - OK (100% Passed)
```

---

## ☁️ Zero-Cost Production Cloud Architecture (₹0 Spend)

DhaaraAI is engineered with a **Zero-Cost Production Blueprint**, delivering 24/7 high availability without paid cloud subscriptions:

```
[Global Litigants & Advocates (Web/Mobile)]
                     │
                     ▼ HTTPS
       ┌──────────────────────────────┐
       │   Vercel Global Edge CDN     │  (100% Free Tier, Auto-SSL, Edge Caching)
       │    Frontend (React 19+Vite)   │  🌐 URL: https://dhaara-ai-ebon.vercel.app/
       └──────────────┬───────────────┘
                      │
                      ▼ REST API via VITE_API_BASE
       ┌──────────────────────────────┐
       │      Render.com Cloud VM     │  (100% Free Web Service, 750 hrs/month)
       │    FastAPI Python Backend    │  🚀 URL: https://dhaara-ai-backend.onrender.com
       ├──────────────────────────────┤
       │ • In-Memory BNS Concordance  │  (2,016+ section cross-mappings)
       │ • 150+ Legal Glossary DB     │  (Multi-domain legal dictionary)
       │ • 77k+ Statutory Provisions  │  (Loaded from compact CSV datasets)
       │ • Self-Seeding ChromaDB      │  (Vectorizes automatically without 1.9GB manual upload)
       │ • Isolated SQLite WAL Engine │  (Cryptographic user & session isolation)
       └──────────────────────────────┘
```

### 💡 Self-Healing ChromaDB Vector Seeding
A major hurdle in deploying legal RAG systems is the massive size of vector databases (often >1.9 GB). DhaaraAI eliminates this problem:
1. **Compact Raw Datasets in Git**: Raw statutes and sections total **~13 MB**, tracked directly in Git under standard file limits.
2. **On-Boot Self-Seeding (`embed_store.seed_defaults_if_empty()`)**: Upon deployment on a fresh server, the backend automatically detects an unseeded Chroma collection and generates embeddings on the fly in seconds.
3. **Zero Git Bloat**: Heavy `.bin` and `.sqlite3` binary caches are kept out of version control, preventing repository size bloat while guaranteeing instant deployments.

---

## 🛠️ Tech Stack Breakdown

### Frontend Workstation
- **Framework:** React 19.2 (Concurrent Mode, React Compiler compatible)
- **Build Tool:** Vite 8.3 (Lightning HMR and tree-shaking)
- **Styling:** Modular Vanilla CSS Design System (High-contrast legal tokens, zero CSS library lock-in)
- **Icons & Visuals:** Lucide React (1.47+)
- **Markdown & Code:** React Markdown 10.1
- **Export Engines:** `html2pdf.js` (A4 judicial standard) & Word (`.doc`) generator
- **Voice Capabilities:** Native Web Speech API (STT Voice Recognition & TTS Recitation)
- **Deployment:** Vercel Global Edge Network

### Backend Intelligence
- **Framework:** FastAPI 0.115+ (Asynchronous REST engine)
- **Server:** Uvicorn with ASGI event loop
- **Security:** HMAC-SHA256 Cryptographic Tokens, Python `cryptography`
- **Rate Limiting:** SlowAPI (Token bucket algorithm)
- **Validation:** Pydantic v2
- **Document Processing:** `pypdf` 5.0+

### AI & Retrieval Engine (RAG)
- **Inference Cloud:** Groq Cloud LPU
- **Models:** Llama 3.3 70B Versatile, Llama 3.1 8B Instant, OSS-120B
- **Vector Database:** ChromaDB 0.5+
- **Embedding Model:** `sentence-transformers` (`all-MiniLM-L6-v2`)
- **Data Collections:** 21+ Central Statutory Acts, 66,106+ Supreme Court case law chunks

### Database & Persistence
- **Transactional Database:** SQLite with Write-Ahead Logging (WAL mode)
- **Optional Distributed Sync:** MongoDB Sync module (`pymongo`, `dnspython`)

---

## 📁 Repository Structure

```
DhaaraAI/
├── backend/
│   ├── data/
│   │   ├── dhaara_chat.db        # SQLite chat history & users DB (WAL mode)
│   │   ├── acts.csv              # Central Acts statutory repository
│   │   ├── sections.csv          # 77,074 statutory provisions
│   │   └── mapping.csv           # BNS ↔ IPC & BNSS ↔ CrPC concordance mappings
│   ├── src/
│   │   ├── chat_history_db.py    # Persistent SQLite storage & HMAC auth layer
│   │   ├── rag_engine.py         # Dense vector retrieval & Groq Llama orchestrator
│   │   ├── draft_templates.py    # 12 Indian legal templates & dynamic generators
│   │   ├── legal_glossary.py     # 150+ legal terms across 14 legal domains
│   │   ├── bns_concordance.py    # Concordance search & transitional delta engine
│   │   ├── contract_analyzer.py  # Contract clause risk auditing engine
│   │   ├── embed_store.py        # ChromaDB vector store & auto-seeding logic
│   │   └── vault_share_db.py     # Encrypted document sharing engine
│   ├── main.py                   # FastAPI application & REST route definitions
│   ├── test_chat_privacy_suite.py# 11 Privacy & user isolation test cases
│   ├── test_phase2_suite.py      # 20 Functional & template test cases
│   ├── test_backend_suite.py     # Integration test suite
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LegalChat.jsx     # Ask AI workspace with permanent right chat history
│   │   │   ├── LegalChat/        # ChatHistorySidebar, ChatMessageItem, ChatInputArea
│   │   │   ├── LegalDrafter.jsx  # 5-step automated legal drafting studio
│   │   │   ├── LegalLibrary.jsx  # Central Acts repository & glossary explorer
│   │   │   ├── DocumentAnalyzer.jsx # Contract clause risk auditing workspace
│   │   │   ├── BnsConverter.jsx  # BNS ↔ IPC section concordance explorer
│   │   │   ├── CitizenRights.jsx # Emergency rights & helpline playbook
│   │   │   ├── LegalVault.jsx    # PIN-encrypted judicial document archive
│   │   │   ├── FeeCalculator.jsx # Stamp duty, court fee & MV fine estimator
│   │   │   ├── CyberChecker.jsx  # XposedOrNot dark-web breach scanner
│   │   │   └── AuthPage.jsx      # Authentication & registration modal
│   │   ├── config/
│   │   │   └── apiConfig.js      # API base URL configuration
│   │   ├── App.jsx               # Application shell, navigation dock & state router
│   │   ├── index.css             # High-contrast design tokens & dark mode styles
│   │   └── main.jsx              # React 19 entry point
│   ├── public/
│   │   ├── assets/legal/         # Curated legal tech imagery & banners
│   │   ├── manifest.json         # PWA Web App manifest
│   │   └── service-worker.js     # PWA Service worker
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json               # Vercel SPA routing configuration
├── PROJECT_SYNOPSIS_15_PAGES.md  # Detailed 15-page academic & engineering synopsis
├── UI_DESIGN_EXPLANATION.md      # UI/UX design tokens & visual hierarchy specification
└── README.md                     # Project documentation
```

---

## ⚡ REST API Documentation

The FastAPI backend exposes fully documented endpoints with interactive Swagger UI at `/docs`:

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register new user account with hashed credentials | No |
| `POST` | `/api/auth/login` | Authenticate and obtain HMAC-SHA256 bearer token | No |
| `GET` | `/api/auth/me` | Retrieve profile of authenticated user | **Yes** |
| `POST` | `/api/auth/logout` | Invalidate and revoke current session token | **Yes** |
| `POST` | `/api/query` | Conversational RAG query (Groq Llama + ChromaDB) | Optional |
| `GET` | `/api/conversations` | List user's conversations grouped by date | **Yes** |
| `POST` | `/api/conversations` | Create a new conversation session | **Yes** |
| `GET` | `/api/conversations/{id}` | Retrieve messages for a specific conversation | **Yes** |
| `PATCH` | `/api/conversations/{id}` | Rename conversation title | **Yes** |
| `DELETE` | `/api/conversations/{id}` | Soft-delete conversation and messages | **Yes** |
| `POST` | `/api/draft` | Generate court-ready legal draft from template | Optional |
| `POST` | `/api/analyze-contract` | Upload and analyze PDF/TXT agreement for risks | Optional |
| `GET` | `/api/concordance/{section}` | Lookup IPC ↔ BNS statutory concordance mapping | No |
| `GET` | `/api/glossary` | Retrieve Indian legal glossary terms & categories | No |
| `POST` | `/api/calculate-fees` | Calculate state-wise court fee & stamp duties | No |

---

## 🚀 Quickstart Guide (Local Development)

### 📋 Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**
- **Free Groq API Key** (obtainable from [console.groq.com](https://console.groq.com/keys))

---

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone https://github.com/raghav1902/DhaaraAI.git
cd DhaaraAI/backend

# Create and activate a virtual environment
# On Windows:
python -m venv venv
.\venv\Scripts\activate

# On Linux/macOS:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create a .env file with your credentials:
cat <<EOT >> .env
GROQ_API_KEY="gsk_your_groq_api_key_here"
DHAARA_CORS_ORIGINS="http://localhost:5173,http://localhost:3000,http://localhost:8000"
JWT_SECRET_KEY="your_custom_secure_secret_key"
EOT

# Start the FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

> **API Swagger UI:** Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

---

### 2️⃣ Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd DhaaraAI/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

> **Web Application:** Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Cloud Environment Variables

### Backend (`Render.com`)
| Variable | Example Value | Description |
|:---|:---|:---|
| `GROQ_API_KEY` | `gsk_...` | API key for high-speed Groq inference |
| `DHAARA_CORS_ORIGINS` | `https://dhaara-ai-ebon.vercel.app,http://localhost:5173` | Allowed origins for cross-origin resource sharing |
| `JWT_SECRET_KEY` | `your_random_64_char_hex_secret` | Secret key for signing HMAC-SHA256 session tokens |
| `PYTHON_VERSION` | `3.11.0` | Python runtime pin |

### Frontend (`Vercel`)
| Variable | Value | Description |
|:---|:---|:---|
| `VITE_API_BASE` | `https://dhaara-ai-backend.onrender.com` | Base URL connecting the client to the cloud backend |

---

## 🗺️ Product Roadmap

- [x] **Phase 1: Core Jurisprudence & RAG Architecture**
  - [x] Dense semantic retrieval over 21+ Central Acts.
  - [x] Full BNS 2023 ↔ IPC 1860 concordance mapping.
  - [x] Groq Llama 3.3 70B high-throughput inference engine.
- [x] **Phase 2: Workstation Suite & Citizen Empowerment**
  - [x] 12 Court-ready automated drafting templates with Word/PDF export.
  - [x] Precedent-backed retrieval over 66,106+ Supreme Court case chunks.
  - [x] 150+ Term bilingual legal glossary with Hindi transliteration.
  - [x] Contract clause risk auditor & equitable redlines.
  - [x] Court fee & stamp duty calculators.
- [x] **Phase 3: Zero-Trust Security & PWA Hardening**
  - [x] Strict HMAC-SHA256 user authentication & 100% IDOR-proof SQLite isolation.
  - [x] Client-side AES PIN-encrypted Legal Vault.
  - [x] XposedOrNot live dark-web breach scanner.
  - [x] Web Speech API STT & TTS bilingual audio support.
  - [x] Progressive Web App (PWA) offline manifest & service worker.
- [ ] **Phase 4: High Court Jurisdictions & Multi-Regional Expansion**
  - [ ] State High Court case law indexing (Delhi, Bombay, Allahabad, Madras).
  - [ ] Vernacular Indian language support (Tamil, Telugu, Bengali, Marathi, Gujarati).
  - [ ] E-Courts API integration for automated case status tracking.

---

## ⚠️ Statutory Legal Disclaimer

> **IMPORTANT NOTICE UNDER THE ADVOCATES ACT, 1961:**
> 
> DhaaraAI is an artificial intelligence research and civic enablement tool designed exclusively for educational, informational, and academic purposes. **It does not constitute formal legal advice, judicial counsel, or the formation of an attorney-client relationship under the Advocates Act, 1961 or the Bar Council of India Rules.**
> 
> Legal statutes, procedural timelines, and judicial interpretations evolve continuously. While DhaaraAI utilizes grounded retrieval against statutory acts and Supreme Court judgments, users and litigants must independently verify all legal drafts, citations, and procedural advice with a qualified, enrolled Advocate before taking formal legal action or filing documents in any court of law.

---

## 📜 License & Acknowledgments

This project is open-source and released under the **[MIT License](LICENSE)**.

- **Judicial Data:** Supreme Court of India judgments & Central Acts via legislative archives.
- **Language Models:** Groq Cloud LPU & Meta Llama 3.3.
- **Vector Search:** ChromaDB & Sentence-Transformers (`all-MiniLM-L6-v2`).
- **Icons & UI:** Lucide React & Tailwind-inspired Vanilla CSS tokens.

<div align="center">

**Built with dedication for Indian citizens, advocates, and judicial scholars.**

[![Live Demo](https://img.shields.io/badge/Launch-DhaaraAI_Workstation-2563eb?style=for-the-badge)](https://dhaara-ai-ebon.vercel.app/)

</div>
