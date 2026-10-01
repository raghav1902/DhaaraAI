# 🏛️ Supreme Court Case-Law RAG Engine — DhaaraAI Documentation

## 1. System Overview
The **DhaaraAI Supreme Court Case-Law Integration** turns raw Indian Supreme Court Reports (eSCR) Parquet datasets into an intelligent, production-grade legal research and citation layer. It connects directly with the existing IndiaCode statutory concordance engine (BNS 2023, BNSS 2023, BSA 2023).

---

## 2. Architecture & Pipeline Components

```
                   Parquet Dataset (backend/data/*.parquet)
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │   Streaming Reader & Text Cleaner (case_law_pipeline)  │
       │   - Multilingual Disclaimer Stripping                  │
       │   - Running Header / Footer Scrubbing                  │
       │   - OCR Hyphenation & Line-Break Normalization         │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │      Deduplication & Metadata Normalization Layer      │
       │   - Canonical English Selection (Strip _HIN, _PUN etc) │
       │   - Title Extraction: "Petitioner v. Respondent"       │
       │   - SCR / INSC Citation Formatting                     │
       │   - Acts, Sections & Constitutional Article Detection  │
       │   - Landmark Category Assignment (12 Legal Domains)    │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │     Legal-Document-Aware Chunker (case_law_chunker)    │
       │   - Paragraph / Clause Preservation (~950 tokens/chunk)│
       │   - Structural Tagging (Headnote / Facts / Order)      │
       │   - Complete Parent Case Metadata Anchoring            │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │     ChromaDB Collection: 'dhaara_case_law'             │
       │   - 384-dimensional dense vectors (all-MiniLM-L6-v2)   │
       │   - Deterministic Chunk IDs (sc_{cnr}_c{idx})          │
       │   - Resumable Checkpoint State Management              │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │       Hybrid Legal Retriever (case_law_retriever)      │
       │   - Vector Semantic Search (Cosine Similarity)         │
       │   - Entity-Driven Lexical & Landmark Boosting          │
       │   - Metadata Filtering (Year, Category, Acts, Sections)│
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │           Ask AI Dual-Retrieval Integration            │
       │   - Input: User Query & Citizen Perspective            │
       │   - Dual Search: [IndiaCode Statutes] + [Case Law]     │
       │   - Grounded LLM Response with Distinct Citations      │
       │   - Clickable eSCR Source Verification Links           │
       └────────────────────────────────────────────────────────┘
```

---

## 3. Data Model (`CaseLawRecord`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `case_id` | `str` | Normalized canonical CNR (e.g. `1950_1_869_940` or `2014_8_128`). |
| `case_name` | `str` | Cleaned case caption (e.g. `Arnesh Kumar v. State of Bihar`). |
| `court` | `str` | Always `"Supreme Court of India"`. |
| `judgment_date` | `str` | Extracted decision date (`DD-MM-YYYY`) or year. |
| `year` | `int` | Decision year (1950–2024). |
| `bench` | `str` | Coram / presiding judges (e.g. `Chandramauli Kr. Prasad, Pinaki Chandra Ghose JJ.`). |
| `citation` | `str` | Official SCR citation (e.g. `[2014] 8 S.C.R. 128 \| 2014 INSC 492`). |
| `case_type` | `str` | `Civil Appeal`, `Criminal Appeal`, `Writ Petition`, `Special Leave Petition`. |
| `full_text` | `str` | Original raw text from Parquet. |
| `cleaned_text` | `str` | Text stripped of disclaimers, repeated headers, and footers. |
| `source` | `str` | `"Supreme Court Reports (eSCR)"`. |
| `source_url` | `str` | Clickable link to official digital Supreme Court repository (`https://digiscr.sci.gov.in/`). |
| `acts` | `List[str]` | Statutory Acts referenced (IPC, CrPC, Constitution, NI Act, IT Act, etc.). |
| `sections` | `List[str]` | Sections referenced (Section 138, Section 438, Section 35(3), etc.). |
| `articles` | `List[str]` | Articles referenced (Article 21, Article 14, Article 32, etc.). |
| `keywords` | `List[str]` | Legal topics extracted. |
| `landmark_category` | `str` | One of the 12 core domains (Bail, Privacy, Cheque Bounce, Evidence, etc.). |
| `ratio_summary` | `str` | Key operative legal holding / ratio decidendi sentence. |

---

## 4. Reusable Ingestion Pipeline CLI (`ingest_case_law.py`)

The ingestion script is located at `backend/ingest_case_law.py`.

```bash
# 1. Representative Sample Ingestion (Curated landmark cases across all 12 domains)
python ingest_case_law.py --sample

# 2. Ingest up to 250 judgments with batching
python ingest_case_law.py --limit 250 --batch-size 64

# 3. Full Corpus Ingestion (Streams test.parquet, validation.parquet, train.parquet)
python ingest_case_law.py --full --batch-size 64

# 4. View Case-Law VectorDB Metrics
python ingest_case_law.py --stats

# 5. Clean Re-index (Deletes existing collection and re-embeds)
python ingest_case_law.py --reset --sample
```

---

## 5. Dedicated API Endpoints

### 1. `GET /api/case-law/search`
Query Supreme Court judgments with semantic search and metadata filters.
* **Params**: `query`, `top_k`, `category`, `act`, `year_min`, `year_max`
* **Response**:
  ```json
  {
    "query": "anticipatory bail",
    "total": 2,
    "results": [
      {
        "case_name": "Arnesh Kumar v. State of Bihar",
        "citation": "[2014] 8 S.C.R. 128 | 2014 INSC 492",
        "hybrid_score": 0.97,
        "court": "Supreme Court of India",
        "judgment_date": "02-07-2014",
        "relevant_passage": "Arrest brings humiliation, curtails freedom and casts scars forever...",
        "source_url": "https://digiscr.sci.gov.in/",
        "source_type": "case_law"
      }
    ]
  }
  ```

### 2. `GET /api/case-law/landmarks`
Retrieve curated landmark judgments grouped by domain.
* **Params**: `category` (optional, e.g. `Bail`, `Constitutional Law`, `Cheque Bounce`)

### 3. `GET /api/case-law/stats`
Returns corpus statistics, vector counts, unique judgments, and category breakdown.

### 4. `GET /api/case-law/precedents-by-statute`
Returns Supreme Court precedents linked to a statutory section (e.g. `bns_318_4`, `ni_act_138`, `bnss_482`, `article_21`).

### 5. `POST /api/query` (Enhanced Ask AI)
Returns both `statutory_sources` (IndiaCode) and `case_law_sources` (Supreme Court precedents) alongside the grounded answer.

---

## 6. Automated Test Suite (`test_case_law_suite.py`)
Run the test suite at any time:
```bash
cd backend
python test_case_law_suite.py
```
Validates:
* Parquet loading & streaming
* Text cleaning & noise removal
* Metadata extraction & normalization
* Duplicate & translation detection
* Intelligent legal chunking
* ChromaDB storage in `dhaara_case_law`
* All 10 Target Queries (Article 21, Privacy, Anticipatory Bail, Sec 138, Sec 498A, Cybercrime, Evidence, Fundamental Rights, Consumer disputes, Contract disputes)
* Metadata filtering
* Statutory cross-links
* Ask AI Dual Retrieval integration
