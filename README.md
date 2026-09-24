# ⚖️ DhaaraAI - Indian Legal Intelligence Platform

DhaaraAI is an advanced, AI-powered legal assistant tailored specifically for Indian citizens. It simplifies complex legal jargon and helps individuals understand their rights under the new **Bharatiya Nyaya Sanhita (BNS 2023)**, **Bharatiya Nagarik Suraksha Sanhita (BNSS)**, and the legacy **Indian Penal Code (IPC)**. 

Accessible in both **English and Hindi**, DhaaraAI empowers users to generate legal drafts, analyze contracts for unfair clauses, and receive immediate statutory guidance based on real-world legal scenarios.

---

## 🌟 Key Features

1. **AI Legal Chatbot & Query Engine**
   - Ask any legal question in plain English or Hindi (e.g., "Someone cheated me on UPI, what should I do?").
   - Instantly receive actionable, bulleted advice outlining the exact applicable BNS 2023 sections, whether the offense is bailable/cognizable, and immediate steps to take.
   - Built with a highly precise Retrieval-Augmented Generation (RAG) system grounded in verified IndiaCode statutory texts.

2. **Automated Legal Document Drafter**
   - Quickly generate formal, print-ready legal documents.
   - Supports drafting **Police FIR Applications** (under Sec 173 BNSS) and **Statutory Legal Demand Notices** (e.g., Cheque Bounce, Legal recovery).
   - Features quick-fill presets for common scenarios like Cyber Fraud, Road Accidents, and Cheque Bounces.

3. **Smart Document & Contract Analyzer**
   - Paste any rental agreement, employment bond, or freelance contract.
   - The AI audits the text against the Indian Contract Act 1872 and highlights "Red Flags" (e.g., unfair non-compete clauses, one-sided termination).
   - Provides balanced, fair alternative clauses that you can negotiate with before signing.

4. **Bilingual Support (English & Hindi)**
   - Fully localized UI and AI generation in English and pure Hindi (Devanagari) to serve a diverse demographic.

---

## 🏗️ System Architecture

The project employs a modern, decoupled web architecture:

- **Frontend (`/frontend`)**: 
  - A fast, responsive Single Page Application built with **React** and **Vite**.
  - Features a clean, professional light theme UI with intuitive navigation and interactive wizards.
- **Backend (`/backend`)**: 
  - A robust **Python API** powered by **FastAPI**.
  - Integrates a **Retrieval-Augmented Generation (RAG)** engine using **ChromaDB** for vector storage and semantic search.
  - Powered by **Groq's Llama 3.3 70B** LLM for lightning-fast, highly accurate legal reasoning.

---

## 🚀 Setup and Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Python** (3.9 or higher)
- **Git**

### 2. Backend Configuration
The backend requires a Groq API key to process AI-driven legal queries.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file and define your API key:
   ```env
   GROQ_API_KEY="your_groq_api_key_here"
   ```
3. Install dependencies and start the server:
   ```bash
   pip install -r requirements.txt
   uvicorn src.main:app --reload --port 8000
   ```
   *The backend API will be available at http://localhost:8000.*

### 3. Running the Frontend Application
Start the Vite development server in a separate terminal session:

```bash
cd frontend
npm install
npm run dev
```
*The frontend UI will be accessible at http://localhost:5173.*

---

## 📁 Project Structure

- **`/frontend/src/components`**: Contains modular React components (`LegalDrafter.jsx`, `DocumentAnalyzer.jsx`, etc.).
- **`/backend/src`**: Core Python logic including `rag_engine.py` and `prompts.py`.
- **`/backend/data`**: Structured legal databases, CSVs, and JSON files used for the RAG knowledge base.

---

## ⚠️ Disclaimer
**DhaaraAI provides general legal information and AI-assisted drafting tools. It is NOT a substitute for professional legal counsel.** The generated drafts and advice should be reviewed by a qualified advocate before being used in formal legal proceedings. The developers assume no liability for the outcomes of utilizing this platform.
