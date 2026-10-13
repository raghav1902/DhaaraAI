# ⚖️ DhaaraAI (LegalGPT)

A full-stack, bilingual (English & Hindi) legal intelligence and document drafting assistant for the Indian legal system, with dedicated support for India's criminal law transition (**BNS**, **BNSS**, and **BSA**).

[🌐 Live Demo](https://dhaara-ai-ebon.vercel.app/) • [⚡ API Docs (Swagger)](https://dhaara-ai-backend.onrender.com/docs) • [📖 Project Synopsis](./PROJECT_SYNOPSIS_15_PAGES.md) • [🎨 UI Overview](./UI_DESIGN_EXPLANATION.md)

---

## Why DhaaraAI?

On **July 1, 2024**, India replaced three major colonial-era criminal statutes:
- **IPC (1860)** ➔ **Bharatiya Nyaya Sanhita (BNS, 2023)**
- **CrPC (1973)** ➔ **Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)**
- **IEA (1872)** ➔ **Bharatiya Sakshya Adhiniyam (BSA, 2023)**

This change created real-world confusion for law students, advocates, and ordinary citizens trying to understand renumbered sections, modified procedural timelines, altered bail provisions, and transitional rules (e.g. which statute applies depending on the date of offence).

**DhaaraAI** was built to solve this practical problem: a single workstation where users can search old vs new sections, query legal context with citations, generate court drafts, audit agreements for unfair clauses, and look up emergency rights.

---

## What It Can Do

| Feature | What it does |
|---|---|
| **LegalGPT (Ask AI)** | Legal Q&A using RAG across 21+ Central Acts and Supreme Court judgment precedents. Cites landmark cases (e.g., *Arnesh Kumar*, *Lalita Kumari*, *Satender Kumar Antil*) with bilingual (English/Hindi) voice input/output. |
| **BNS ↔ IPC Concordance** | Instant bidirectional mapping across 77,000+ provisions of IPC ↔ BNS, CrPC ↔ BNSS, and IEA ↔ BSA, showing penalty and procedural changes side-by-side. |
| **Legal Drafting Studio** | Generates 12 common legal drafts (FIR applications, Bail petitions, Sec 138 notices, Affidavits, Consumer complaints, etc.) with live preview and Word (.doc) / A4 PDF export. |
| **Contract Risk Auditor** | Upload PDF/TXT agreements to identify unilateral termination clauses, unreasonable lock-ins, overreaching non-competes, and uncapped liabilities with suggested balanced clauses. |
| **Court Fee & Stamp Duty Calculator** | Estimates civil court fees, property stamp duty/registration charges (including women buyer concessions), and 2024 Motor Vehicle Act traffic penalties. |
| **Encrypted Legal Vault** | PIN-protected local document storage so sensitive legal drafts stay encrypted in the browser. |
| **Citizen Emergency SOS Playbook** | Immediate step-by-step guides for police arrest/detention, cyber fraud golden hours, traffic stops, and direct links to emergency numbers (`1930`, `112`, `1091`, `15100`). |
| **Dark-Web Breach Check** | Quick compromise lookup via the XposedOrNot public API without storing or logging personal search queries. |
| **Legal Glossary & Acts Library** | 150+ legal terms across 14 categories with plain-language definitions, Hindi terms, and full text access to primary Central Acts. |

---

## Architecture

```
Frontend (React 19 + Vite) ──► HTTPS / REST ──► FastAPI (Python 3.10+)
    │                                                   │
    ├─ PWA / Speech API                                 ├─ Groq API (Llama 3.3 70B)
    └─ Deployed on Vercel                               ├─ ChromaDB (Dense Vector Search)
                                                        ├─ SQLite WAL (Chat sessions + Auth)
                                                        └─ Deployed on Render
```

- **Frontend:** React 19, Vite, clean Vanilla CSS design tokens (no bulky UI framework dependencies), Lucide icons.
- **Backend:** FastAPI, Uvicorn, SlowAPI rate limiting, Pydantic v2, `pypdf`.
- **AI & Retrieval:** Groq LPU inference (Llama 3.3 70B), ChromaDB vector store seeded from statutory datasets, `sentence-transformers` (`all-MiniLM-L6-v2`).
- **Security & Multi-Tenancy:** HMAC-SHA256 bearer tokens, owner-scoped database queries (`WHERE owner_id = :id AND is_deleted = 0`) to prevent IDOR vulnerabilities.

---

## Project Structure

```
DhaaraAI/
├── backend/
│   ├── data/
│   │   ├── dhaara_chat.db        # SQLite database for chat sessions
│   │   ├── acts.csv              # Primary acts reference
│   │   ├── sections.csv          # Statutory provisions dataset
│   │   └── mapping.csv           # BNS ↔ IPC section concordance
│   ├── src/
│   │   ├── chat_history_db.py    # Database helpers & session security
│   │   ├── rag_engine.py         # Vector search retrieval & Groq integration
│   │   ├── draft_templates.py    # Templates for legal drafts
│   │   ├── legal_glossary.py     # Legal terms & domain taxonomy
│   │   ├── bns_concordance.py    # Concordance search logic
│   │   ├── contract_analyzer.py  # Clause risk detection
│   │   ├── embed_store.py        # ChromaDB setup and seeding
│   │   └── vault_share_db.py     # Document sharing logic
│   ├── main.py                   # FastAPI app & route handlers
│   ├── test_chat_privacy_suite.py# Auth and isolation test cases
│   ├── test_phase2_suite.py      # Drafting and concordance tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # Core feature tabs & components
│   │   │   ├── LegalChat.jsx
│   │   │   ├── LegalDrafter.jsx
│   │   │   ├── BnsConverter.jsx
│   │   │   ├── DocumentAnalyzer.jsx
│   │   │   ├── FeeCalculator.jsx
│   │   │   ├── CitizenRights.jsx
│   │   │   └── LegalVault.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Local Setup

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (.env)
cp .env.example .env  # or create .env manually
```

Add your keys to `backend/.env`:
```env
GROQ_API_KEY="your_groq_api_key_here"
DHAARA_CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
JWT_SECRET_KEY="your_secure_random_key"
```

Run the backend server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Frontend

```bash
cd frontend

# Install packages
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tests

Run the backend test suites from the `backend/` directory:

```bash
cd backend

# Test user isolation and auth
python test_chat_privacy_suite.py

# Test drafting templates and concordance lookups
python test_phase2_suite.py
```

---

## Disclaimer

**Not Formal Legal Advice:**
DhaaraAI is an independent, open-source technology project developed for research, educational, and civic reference purposes. It does not provide certified legal advice or replace professional counsel under the Advocates Act, 1961. Always consult a licensed advocate before filing documents or initiating legal proceedings.

---

## License

This project is licensed under the [MIT License](LICENSE).
