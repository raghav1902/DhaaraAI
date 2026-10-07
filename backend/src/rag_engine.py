"""
rag_engine.py
=============
Next-Generation Indian Statutory RAG Engine for DhaaraAI.
Integrates ChromaDB dense semantic retrieval with Groq's Llama 3.3 70B model,
BNS 2023 <-> IPC 1860 Master Concordance, and Supreme Court Landmark Directives.
"""

import os
from typing import List, Dict, Any, Generator, Optional
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

from embed_store import LegalEmbedStore
from bns_concordance import diagnose_situation, get_transition_alert
from real_legal_fetcher import RealLegalDataService
from rag_offline_fallbacks import generate_offline_concordance_fallback
from draft_templates import generate_fallback_draft, find_matching_template_for_query
import legal_glossary
from contract_analyzer import analyze_contract_document, heuristic_contract_analysis
from legal_validator import LegalAccuracyValidator

# Singleton validator instance — shared across all requests (thread-safe, stateless)
_validator = LegalAccuracyValidator()

DEFAULT_MODEL = "openai/gpt-oss-120b"
FALLBACK_MODEL = "qwen/qwen3.8-27b"
SIMILARITY_THRESHOLD = 0.30

from prompts import (
    LEGAL_DISCLAIMER_EN,
    LEGAL_DISCLAIMER_HI,
    SYSTEM_PROMPT_EN,
    SYSTEM_PROMPT_HI,
    DRAFTING_SYSTEM_PROMPT_EN,
    DRAFTING_SYSTEM_PROMPT_HI,
)

class DhaaraRAGEngine:
    """
    Orchestrates semantic retrieval from ChromaDB, BNS 2023 concordance,
    and grounded answer generation via Groq Llama 3.3 70B.
    """

    def __init__(
        self,
        embed_store: Optional[LegalEmbedStore] = None,
        model_name: str = DEFAULT_MODEL,
        api_key: Optional[str] = None
    ):
        self.embed_store = embed_store or LegalEmbedStore()
        self.embed_store.seed_defaults_if_empty()
        self.model_name = model_name
        self.api_key = api_key or os.getenv("GROQ_API_KEY", "").strip()
        self.client = None

        if self.api_key:
            self._init_groq_client(self.api_key)

    def _init_groq_client(self, key: str):
        try:
            self.api_key = key.strip()
            self.client = Groq(api_key=self.api_key)
        except Exception as e:
            print(f"[rag_engine] Failed to initialize Groq client: {e}")
            self.client = None

    def _set_api_key_internal(self, key: str):
        """Private: update Groq key internally. Never expose this via any API route."""
        if not key or not str(key).strip().startswith("gsk_"):
            print("[rag_engine] Invalid or empty API key — skipping update.")
            return
        self._init_groq_client(key)

    def _format_concordance_context(self, question: str, user_role: str, diagnosis: Optional[Dict[str, Any]] = None) -> str:
        if diagnosis is None:
            diagnosis = diagnose_situation(question, user_role=user_role)
        blocks = []

        transition = diagnosis.get("transition", {})
        blocks.append(f"Transition Alert: {transition.get('rule_en', '')}")

        crimes = diagnosis.get("matched_crimes", [])
        for c in crimes:
            # Escape curly braces from all concordance values to prevent prompt injection
            def _esc(v: str) -> str:
                return str(v or "").replace("{", "(").replace("}", ")")

            b = (
                f"• Offense: {_esc(c.get('offense_en', ''))}\n"
                f"  - Active BNS Section: {_esc(c.get('bns_section', ''))} ({_esc(c.get('bns_act', ''))}) — {_esc(c.get('bns_title', ''))}\n"
                f"  - Legacy IPC Section: {_esc(c.get('ipc_section', ''))} ({_esc(c.get('ipc_act', ''))})\n"
                f"  - Classification: {_esc(c.get('nature', ''))} | {_esc(c.get('bailable', ''))} | Triable by: {_esc(c.get('triable_by', ''))}\n"
                f"  - Punishment: {_esc(c.get('punishment', ''))}\n"
                f"  - BNSS Procedure & Rights: {_esc(c.get('bnss_procedure', ''))}\n"
                f"  - Action for Complainant: {_esc(c.get('victim_guidance', ''))}\n"
                f"  - Safeguard for Accused: {_esc(c.get('accused_guidance', ''))}"
            )
            blocks.append(b)

        guidelines = RealLegalDataService.get_landmark_guidance_for_query(question)
        for g in guidelines:
            gb = (
                f"• Landmark Ruling: {g['case_name']} ({g['governing_statute']})\n"
                f"  Binding Principle: {g['key_rule']}\n"
                f"  Citizen Remedy: {g['citizen_remedy']}"
            )
            blocks.append(gb)

        return "\n\n".join(blocks) if blocks else "General Indian legal statutory inquiry."

    def _format_retrieved_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        if not chunks:
            return "No specific dense text chunks retrieved from IndiaCode repository."

        # ── Manifest header: explicitly tells the model which sections are available ──
        manifest_lines = [
            "=== RETRIEVED STATUTORY SECTIONS — cite ONLY from this list ==="
        ]
        for i, chunk in enumerate(chunks, 1):
            st = chunk.get("source_type", "Statutory Sources")
            if st != "Case Law":
                manifest_lines.append(
                    f"  {i}. {chunk.get('source', 'Unknown Act')} "
                    f"— Section {chunk.get('section', '?')}: {chunk.get('section_title', '')}"
                )
        manifest_lines.append("=== END STATUTORY MANIFEST ===")
        manifest_header = "\n".join(manifest_lines)

        formatted_blocks = [manifest_header]
        for idx, chunk in enumerate(chunks, 1):
            st = chunk.get("source_type", "Statutory Sources")
            raw_text = chunk.get("text", "").strip()
            if st == "Case Law":
                block = (
                    f"[Supreme Court Precedent Record {idx}]\n"
                    f"• Case Name: {chunk.get('case_name', 'Supreme Court of India')}\n"
                    f"• Citation: {chunk.get('citation', '')}\n"
                    f"• Judgment Date: {chunk.get('judgment_date', '')}\n"
                    f"• Relevance: {chunk.get('similarity_score', 0.0):.4f}\n"
                    f"• Judgment Excerpt:\n{raw_text[:1000]}\n"
                )
            else:
                block = (
                    f"[Statute Record {idx}]\n"
                    f"• Source: {chunk.get('source', 'IndiaCode')}\n"
                    f"• Section: {chunk.get('section', 'General')} - {chunk.get('section_title', '')}\n"
                    f"• Relevance: {chunk.get('similarity_score', 0.0):.4f}\n"
                    f"• Statutory Text:\n{raw_text[:1000]}\n"
                )
            formatted_blocks.append(block)

        return "\n".join(formatted_blocks)

    def _format_case_law_chunks(self, chunks: List[Dict[str, Any]], question: str = "") -> str:
        """
        Formats retrieved Supreme Court case law chunks along with landmark judicial directives.
        Prepends an explicit manifest so the model knows exactly which cases are available.
        """
        formatted_blocks = []

        # 1. Landmark directives matching query
        landmark_names: List[str] = []
        if question:
            landmarks = RealLegalDataService.get_landmark_guidance_for_query(question)
            for g in landmarks:
                landmark_names.append(g.get('case_name', ''))
                formatted_blocks.append(
                    f"[Supreme Court Landmark Directive]\n"
                    f"• Ruling: {g.get('case_name')}\n"
                    f"• Statute: {g.get('governing_statute')}\n"
                    f"• Ratio / Rule: {g.get('key_rule')}\n"
                    f"• Remedy: {g.get('citizen_remedy')}\n"
                )

        # 2. Dense case law vectors from dhaara_case_law
        vector_names: List[str] = []
        for idx, chunk in enumerate(chunks, 1):
            court_name = chunk.get("court") or ("Supreme Court of India" if chunk.get("court_level") == "SC" else "High Court")
            court_level = chunk.get("court_level") or ("SC" if "supreme" in court_name.lower() else "HC")
            case_name = chunk.get('case_name', 'Indian Judicial Precedent')
            vector_names.append(f"{case_name} ({court_level})")
            block = (
                f"[Judicial Precedent Record {idx} - {court_name} ({court_level})]\n"
                f"• Court: {court_name} [{court_level}]\n"
                f"• Case Name: {case_name}\n"
                f"• Citation: {chunk.get('citation', '')}\n"
                f"• Judgment Date: {chunk.get('judgment_date', '')}\n"
                f"• Relevance: {chunk.get('similarity_score', 0.0):.4f}\n"
                f"• Judicial Holding / Excerpt:\n{chunk.get('text', '').strip()[:800]}\n"
            )
            formatted_blocks.append(block)

        if not formatted_blocks:
            return (
                "=== NO CASE LAW RETRIEVED ===\n"
                "IMPORTANT: Do NOT cite any specific case name or holding. "
                "State: 'No specific precedent retrieved; general statutory principles apply.'\n"
                "=== END ===\n"
            )

        # 3. Prepend manifest so model knows the exact available cases
        all_names = landmark_names + vector_names
        manifest_lines = ["=== RETRIEVED CASE LAW — cite ONLY these cases in your answer ==="]
        for i, name in enumerate(all_names, 1):
            manifest_lines.append(f"  {i}. {name}")
        manifest_lines.append(
            "  If a case you want to cite is NOT in this list, do NOT cite it.\n"
            "=== END CASE LAW MANIFEST ==="
        )
        manifest_header = "\n".join(manifest_lines)

        return manifest_header + "\n\n" + "\n".join(formatted_blocks)

    def _build_template_guidance_response(
        self,
        template: Dict[str, Any],
        question: str,
        language: str,
        user_role: str
    ) -> Dict[str, Any]:
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
        t_id = template["template_id"]
        t_title = template.get("title_hi" if is_hindi else "title", template["title"])
        t_basis = template.get("legal_basis", "")
        t_act = template.get("relevant_act", "")
        t_secs = template.get("relevant_sections", "")
        t_desc = template.get("description_hi" if is_hindi else "description", template["description"])
        t_req_fields = template.get("required_fields", [])
        t_req_docs = template.get("required_documents", [])

        if is_hindi:
            ans = f"""### **{t_title}** — विधिक ड्राफ्ट प्रारूप एवं दिशानिर्देश

#### **1. विधिक आधार व सांविधिक व्यवस्था**
- **शासी अधिनियम**: {t_act}
- **संबंधित धाराएं**: {t_secs}
- **प्रक्रियात्मक अनिवार्यता**: {t_desc}
- **कानूनी आधार**: {t_basis}

#### **2. अनिवार्य आवश्यक विवरण व दस्तावेज**
- **अनिवार्य विवरण**: {', '.join(t_req_fields) if t_req_fields else 'पक्षकारों का नाम, पता व घटना विवरण'}
- **संलग्न किए जाने वाले दस्तावेज**: {', '.join(t_req_docs) if t_req_docs else 'साक्ष्य व पहचान प्रमाण'}

#### **3. ड्राफ्टिंग एवं विधिक प्रक्रिया चरण**
1. सभी आवश्यक तथ्य व विवरण (तारीख, स्थान, चेक/बैंक मेमो अथवा घटना विवरण) क्रमवार एकत्रित करें।
2. अधिनियम के तहत निर्धारित 15-दिवसीय अथवा विहित वैधानिक समय-सीमा का पालन करें।
3. ड्राफ्ट तैयार करने के बाद सक्षम प्राधिकारी / न्यायालय अथवा विपक्षी को प्रेषित करें।

> ✍️ **सुझाव**: आप **DhaaraAI Drafting Studio** में जाकर इस दस्तावेज़ को सीधे जनरेट, एडिट तथा **Word (.doc) / PDF** में एक्सपोर्ट कर सकते हैं।

*AI-assisted draft guidance — verify facts, applicable law, jurisdiction and procedural requirements before filing.*"""
        else:
            ans = f"""### **{t_title}** — Legal Draft Template & Procedure

#### **1. Statutory Framework & Governing Law**
- **Governing Enactment**: {t_act}
- **Applicable Sections**: {t_secs}
- **Legal Basis**: {t_basis}
- **Procedural Mandate**: {t_desc}

#### **2. Mandatory Information & Essential Documents**
- **Required Fields**: {', '.join(t_req_fields) if t_req_fields else 'Party details, facts, date, jurisdiction'}
- **Essential Documents**: {', '.join(t_req_docs) if t_req_docs else 'Identity proof, incident records, receipts'}

#### **3. Step-by-Step Drafting Procedure**
1. Collate chronological facts (dates, amounts, transaction IDs, return memos, or occurrence details).
2. Adhere strictly to the statutory cure / limitation period (e.g., 15 days upon notice service for Sec 138 NI Act).
3. Verify territorial jurisdiction (Magistrate court, Sessions court, or Consumer Commission) before dispatch/filing.

> ✍️ **Drafting Studio Integration**: You can open **DhaaraAI Drafting Studio** to dynamically fill and export this complete legal document in **Word (.doc)** and **PDF** formats.

*AI-assisted draft guidance — verify facts, applicable law, jurisdiction and procedural requirements before filing.*"""

        sources = [{
            "source_type": "Draft Template",
            "template_id": t_id,
            "title": t_title,
            "section": t_secs,
            "section_title": t_title,
            "source": t_act,
            "legal_basis": t_basis,
            "action": "open_drafter"
        }]

        return {
            "answer": ans,
            "sources": sources,
            "question": question,
            "language": language,
            "concordance": diagnose_situation(question, user_role)
        }

    def _build_glossary_definition_response(
        self,
        term: Dict[str, Any],
        question: str,
        language: str,
        user_role: str
    ) -> Dict[str, Any]:
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
        term_en = term["term"]
        term_hi = term.get("hindi_term", "")
        simple_exp = term.get("simple_hi_explanation" if is_hindi else "simple_en_explanation", "")
        legal_ctx = term.get("legal_context", "")
        acts = term.get("related_acts", [])
        secs = term.get("related_sections", [])
        cases = term.get("related_case_law_ids", [])
        aliases = term.get("aliases_synonyms", [])

        if is_hindi:
            ans = f"""### **{term_hi or term_en}** ({term_en})

#### **1. सरल व्याख्या (Plain Citizen Meaning)**
{simple_exp}

#### **2. औपचारिक प्रक्रियात्मक एवं विधिक संदर्भ (Legal Context)**
{legal_ctx}

#### **3. संबंधित अधिनियम एवं धाराएं (Governing Statutes)**
- **अधिनियम**: {', '.join(acts) if acts else 'भारतीय संविधि'}
- **सुसंगत धाराएं**: {', '.join(secs) if secs else 'विहित प्रावधान'}
"""
            if cases:
                ans += f"\n#### **4. प्रमुख न्यायिक दृष्टांत (Landmark Case Law)**\n- {', '.join(cases)}\n"
            if aliases:
                ans += f"\n*समानार्थी / अन्य नाम: {', '.join(aliases)}*\n"
        else:
            ans = f"""### **{term_en}** {f'({term_hi})' if term_hi else ''}

#### **1. Plain Meaning & Citizen Explanation**
{simple_exp}

#### **2. Procedural & Statutory Context**
{legal_ctx}

#### **3. Relevant Acts & Statutory Sections**
- **Acts**: {', '.join(acts) if acts else 'Indian Statutes'}
- **Governing Sections**: {', '.join(secs) if secs else 'Statutory provisions'}
"""
            if cases:
                ans += f"\n#### **4. Landmark Precedents**\n- {', '.join(cases)}\n"
            if aliases:
                ans += f"\n*Common Aliases / Synonyms: {', '.join(aliases)}*\n"

        ans += "\n*Reference from DhaaraAI Verified Legal Glossary. Consult professional counsel for case-specific legal strategy.*"

        sources = [{
            "source_type": "Legal Glossary",
            "term_id": term["id"],
            "term": term_en,
            "hindi_term": term_hi,
            "category": term.get("category", ""),
            "section": ", ".join(secs) if secs else term_en,
            "section_title": f"Legal Glossary — {term_en}",
            "source": ", ".join(acts) if acts else "Indian Legal Glossary",
            "action": "open_glossary"
        }]

        return {
            "answer": ans,
            "sources": sources,
            "question": question,
            "language": language,
            "concordance": diagnose_situation(question, user_role)
        }

    def _generate_offline_concordance_fallback(
        self,
        question: str,
        user_role: str,
        reason: str,
        language: str = "English"
    ) -> str:
        return generate_offline_concordance_fallback(
            question=question,
            user_role=user_role,
            reason=reason,
            language=language
        )

    def query(
        self,
        question: str,
        language: str = "English",
        user_role: str = "general",
        top_k: int = 5,
        stream: bool = False,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Executes end-to-end situational legal intelligence query with multi-layer knowledge routing:
        - Draft Templates Layer (e.g. 'Make a cheque bounce notice')
        - Legal Glossary Layer (e.g. 'What does cognizance mean?')
        - Supreme Court Case-Law RAG Layer (e.g. 'What did Supreme Court say about Section 41A?')
        - Statutory RAG & Concordance Layer (e.g. 'What is BNS Section 318?')
        """
        safe_question = str(question or "").strip()
        if not safe_question:
            safe_question = "general legal rights and statutory remedies"
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]

        # Layer 1: Draft Template Intent Routing
        matched_template = find_matching_template_for_query(safe_question)
        if matched_template:
            return self._build_template_guidance_response(matched_template, safe_question, language, user_role)

        # Layer 2: Legal Glossary Definition Intent Routing
        glossary_match = legal_glossary.find_glossary_match_for_query(question)
        if glossary_match:
            return self._build_glossary_definition_response(glossary_match, question, language, user_role)

        # Layer 3 & 4: Dual Semantic RAG (Statutory Knowledge + Supreme Court Precedents)
        q_lower = question.lower()
        is_case_law_query = any(k in q_lower for k in [
            "supreme court", "case law", "precedent", "judgment", "ruling", "arnesh kumar",
            "bench", "held", "sc held", "sc ruled", "landmark case", "directive", "quashing guideline"
        ])
        
        # 1. Statutory Retrieval
        raw_statute_chunks = self.embed_store.query(question, top_k=top_k)
        statute_chunks = [
            c for c in raw_statute_chunks
            if c.get("similarity_score", 0.0) >= SIMILARITY_THRESHOLD
        ][:4]
        if not statute_chunks and raw_statute_chunks:
            statute_chunks = raw_statute_chunks[:3]
        for c in statute_chunks:
            if "source_type" not in c:
                c["source_type"] = "Statutory Sources"

        # 2. Case Law Retrieval from dhaara_case_law (Supreme Court precedents)
        raw_case_chunks = self.embed_store.query_case_law(question, top_k=4 if is_case_law_query else 3)
        case_chunks = [
            c for c in raw_case_chunks
            if c.get("similarity_score", 0.0) >= 0.35
        ][:3]
        if not case_chunks and raw_case_chunks:
            case_chunks = raw_case_chunks[:2]
        for c in case_chunks:
            c["source_type"] = "Case Law"

        # Combined used chunks for source citation UI cards (order by relevance/intent)
        if is_case_law_query:
            used_chunks = case_chunks + statute_chunks
        else:
            used_chunks = statute_chunks + case_chunks

        # Format context blocks
        diagnosis_data = diagnose_situation(question, user_role=user_role)
        concordance_ctx = self._format_concordance_context(question, user_role, diagnosis=diagnosis_data)
        retrieved_ctx = self._format_retrieved_chunks(statute_chunks)
        case_law_ctx = self._format_case_law_chunks(case_chunks, question)

        # Determine Query Complexity for Adaptive Depth
        is_simple_query = (
            len(question.strip().split()) <= 4 and
            any(question.strip().lower().startswith(w) for w in ["what is", "define", "kya hai", "meaning of"])
        )
        if is_simple_query:
            token_budget = 1200
            depth_instruction = (
                "Provide a clear, focused legal explanation covering: "
                "(1) ### Direct Answer — the core definition and legal position in 2–4 sentences; "
                "(2) ### What the Law Says — the governing statute, exact section number, and its legal elements; "
                "(3) ### Practical Next Steps — immediate citizen action if relevant."
                if not is_hindi else
                "कृपया निम्नलिखित अनुभागों में स्पष्ट व संक्षिप्त उत्तर दें: "
                "(1) ### सीधा उत्तर — 2–4 वाक्यों में मूल परिभाषा व विधिक स्थिति; "
                "(2) ### कानून क्या कहता है — शासी अधिनियम, सटीक धारा संख्या, व कानूनी तत्व; "
                "(3) ### व्यावहारिक अगले कदम — यदि प्रासंगिक हो।"
            )
        else:
            token_budget = 1400
            depth_instruction = (
                "MANDATORY — Produce a COMPLETE structured legal research response using ALL applicable sections below. "
                "Do NOT truncate mid-section. Do NOT write a key-points-only card.\n\n"
                "REQUIRED SECTIONS (include every section that applies to the query):\n"
                "### Direct Answer\n"
                "### What the Law Says\n"
                "### How It Applies to Your Situation\n"
                "### Procedure / What Happens Next\n"
                "### Important Deadlines & Limitation\n"
                "### Required Documents / Evidence\n"
                "### Relevant Case Law\n"
                "### Important Points / Exceptions\n"
                "### Practical Next Steps\n"
                "### Sources\n\n"
                "HARD RULES:\n"
                "- Start EVERY response with ### Direct Answer.\n"
                "- ONLY cite case names that appear in the RETRIEVED CASE LAW context. Never fabricate citations.\n"
                "- State exact act names + section numbers (e.g. Section 138 Negotiable Instruments Act, 1881 — NOT 'BNS 138').\n"
                "- For criminal queries: note BNS/BNSS/BSA (current) AND IPC/CrPC/IEA (legacy) equivalents side-by-side.\n"
                "- List numbered steps for ### Procedure and ### Practical Next Steps.\n"
                "- End with the AI-generated disclaimer."
                if not is_hindi else
                "अनिवार्य — नीचे दिए गए सभी लागू अनुभागों का उपयोग करते हुए एक संपूर्ण, बहु-अनुभागीय विधिक अनुसंधान उत्तर प्रस्तुत करें। "
                "किसी भी अनुभाग को बीच में न छोड़ें। केवल 'Key Points' वाला संक्षिप्त उत्तर न दें।\n\n"
                "अनिवार्य अनुभाग (जो भी प्रश्न पर लागू हों):\n"
                "### सीधा उत्तर (Direct Answer)\n"
                "### कानून क्या कहता है (What the Law Says)\n"
                "### यह आपकी स्थिति पर कैसे लागू होता है\n"
                "### प्रक्रिया / आगे क्या होगा\n"
                "### महत्वपूर्ण समय-सीमाएं\n"
                "### आवश्यक दस्तावेज / साक्ष्य\n"
                "### प्रासंगिक केस लॉ\n"
                "### महत्वपूर्ण बिंदु / अपवाद\n"
                "### व्यावहारिक अगले कदम\n"
                "### स्रोत\n\n"
                "अनिवार्य नियम:\n"
                "- हर उत्तर ### सीधा उत्तर से शुरू करें।\n"
                "- केवल वही केस नाम उद्धृत करें जो RETRIEVED CASE LAW संदर्भ में उपलब्ध हों।\n"
                "- सटीक अधिनियम नाम व धारा संख्या बताएं; BNS/BNSS/BSA और IPC/CrPC के समतुल्य एक साथ दर्शाएं।\n"
                "- प्रक्रिया व अगले कदमों को क्रमांकित सूची में लिखें।"
            )

        if is_hindi:
            system_prompt = SYSTEM_PROMPT_HI.format(
                disclaimer=LEGAL_DISCLAIMER_HI,
                concordance_context=concordance_ctx,
                retrieved_context=retrieved_ctx,
                case_law_context=case_law_ctx
            )
            user_prompt = (
                f"नागरिक का सवाल / स्थिति: {question}\n"
                f"नागरिक का दृष्टिकोण: {user_role}\n\n"
                f"{depth_instruction}"
            )
            active_disclaimer = LEGAL_DISCLAIMER_HI
        else:
            system_prompt = SYSTEM_PROMPT_EN.format(
                disclaimer=LEGAL_DISCLAIMER_EN,
                concordance_context=concordance_ctx,
                retrieved_context=retrieved_ctx,
                case_law_context=case_law_ctx
            )
            user_prompt = (
                f"Citizen Query / Situation: {question}\n"
                f"User Perspective: {user_role}\n\n"
                f"{depth_instruction}"
            )
            active_disclaimer = LEGAL_DISCLAIMER_EN

        # Check Groq Client Availability
        if not self.client:
            if not self.api_key:
                offline_resp = self._generate_offline_concordance_fallback(
                    question=question,
                    user_role=user_role,
                    reason="Groq API key not configured. Showing offline statutory guidance." if not is_hindi else "Groq API कुंजी उपलब्ध नहीं है। ऑफलाइन वैधानिक मार्गदर्शन दिखाया जा रहा है।",
                    language=language
                )
                return {
                    "answer": offline_resp,
                    "sources": used_chunks,
                    "question": question,
                    "language": language,
                    "concordance": diagnose_situation(question, user_role)
                }
            self._init_groq_client(self.api_key)

        messages = [
            {"role": "system", "content": system_prompt}
        ]

        # Inject up to the last 6 previous conversation turns if provided
        if conversation_history:
            recent_turns = conversation_history[-6:]
            for turn in recent_turns:
                t_role = turn.get("role")
                t_content = turn.get("content", "")
                if t_role in ["user", "assistant"] and t_content:
                    # Truncate any oversized previous turns to save token budget
                    trimmed_content = t_content if len(t_content) <= 1200 else t_content[:1200] + "... [context truncated]"
                    messages.append({"role": t_role, "content": trimmed_content})

        messages.append({"role": "user", "content": user_prompt})

        # Invoke Groq API with primary and fallback models
        models_to_try = [self.model_name]
        if FALLBACK_MODEL not in models_to_try:
            models_to_try.append(FALLBACK_MODEL)
        if "openai/gpt-oss-20b" not in models_to_try:
            models_to_try.append("openai/gpt-oss-20b")

        last_err = None
        for model in models_to_try:
            try:
                # Clamp max_tokens to 950 for models with strict 1,000 OTPM rate limits (e.g. qwen)
                eff_max_tokens = min(token_budget, 950) if "qwen" in model.lower() else token_budget

                if stream:
                    response_stream = self.client.chat.completions.create(
                        model=model,
                        messages=messages,
                        temperature=0.1,
                        max_tokens=eff_max_tokens,
                        stream=True
                    )

                    def token_generator():
                        collected = []
                        for chunk in response_stream:
                            if chunk.choices and chunk.choices[0].delta.content:
                                text_piece = chunk.choices[0].delta.content
                                collected.append(text_piece)
                                yield text_piece
                        full_answer = "".join(collected)
                        if active_disclaimer not in full_answer:
                            yield f"\n\n*{active_disclaimer}*"
                        try:
                            _, warnings = _validator.validate_answer(
                                answer=full_answer,
                                statute_chunks=statute_chunks,
                                case_chunks=case_chunks,
                                question=question
                            )
                            if warnings:
                                advisory_lines = [
                                    "\n\n---",
                                    "> ⚠️ **DhaaraAI Accuracy Advisory** *(auto-generated by citation validator)*",
                                ]
                                for w in warnings:
                                    advisory_lines.append(f"> - {w}")
                                advisory_lines.append(
                                    "> \n> *Verify flagged citations with a practising advocate or primary statutory source before initiating formal legal proceedings.*"
                                )
                                yield "\n".join(advisory_lines)
                        except Exception as ve:
                            print(f"[legal_validator] Stream validation skipped: {ve}")

                    return {
                        "answer_stream": token_generator(),
                        "sources": used_chunks,
                        "question": question,
                        "language": language,
                        "concordance": diagnose_situation(question, user_role)
                    }
                else:
                    response = self.client.chat.completions.create(
                        model=model,
                        messages=messages,
                        temperature=0.1,
                        max_tokens=eff_max_tokens,
                        stream=False
                    )
                    raw_content = response.choices[0].message.content or ""
                    answer_text = raw_content.strip()
                    if not answer_text and hasattr(response.choices[0].message, "reasoning"):
                        answer_text = (response.choices[0].message.reasoning or "").strip()

                    if answer_text:
                        if active_disclaimer not in answer_text:
                            answer_text += f"\n\n*{active_disclaimer}*"

                        # Post-generation accuracy validation
                        try:
                            answer_text, validation_warnings = _validator.validate_answer(
                                answer=answer_text,
                                statute_chunks=statute_chunks,
                                case_chunks=case_chunks,
                                question=question
                            )
                            if validation_warnings:
                                print(f"[legal_validator] {len(validation_warnings)} issue(s) flagged for query: {question[:80]}")
                                for w in validation_warnings:
                                    print(f"  • {w}")
                        except Exception as ve:
                            print(f"[legal_validator] Validation skipped due to error: {ve}")

                        return {
                            "answer": answer_text,
                            "sources": used_chunks,
                            "question": question,
                            "language": language,
                            "concordance": diagnosis_data
                        }
            except Exception as api_err:
                print(f"[rag_engine] Model '{model}' failed: {api_err}. Trying next fallback...")
                last_err = api_err
                continue

        # If all API calls fail, activate graceful offline fallback
        print(f"[rag_engine] All model attempts failed. Last error: {last_err}. Activating offline fallback.")
        error_reason = (
            "AI सेवा अस्थायी रूप से अनुपलब्ध है। त्वरित वैधानिक जानकारी नीचे उपलब्ध है:"
            if is_hindi else
            "AI service temporarily unavailable. Direct statutory guidance is provided below:"
        )
        fallback_text = self._generate_offline_concordance_fallback(
            question=question,
            user_role=user_role,
            reason=error_reason,
            language=language
        )

        return {
            "answer": fallback_text,
            "sources": used_chunks,
            "question": question,
            "language": language,
            "concordance": diagnosis_data
        }

    def generate_legal_draft(
        self,
        document_type: str,
        language: str,
        complainant: Dict[str, str],
        accused: Dict[str, str],
        incident_category: str,
        incident_datetime: str,
        incident_location: str,
        facts: str,
        evidence: str,
        relief_sought: str,
        extra_fields: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generates a formal, legally grounded court-compliant draft across all 12 templates.
        """
        # Null-safe all inputs before any string interpolation
        complainant  = complainant  or {}
        accused      = accused      or {}
        facts             = str(facts             or "Not specified").strip() or "Not specified"
        evidence          = str(evidence          or "None provided").strip() or "None provided"
        relief_sought     = str(relief_sought     or "As per applicable law").strip() or "As per applicable law"
        incident_category = str(incident_category or "General Complaint").strip() or "General Complaint"
        incident_datetime = str(incident_datetime or "Not specified").strip() or "Not specified"
        incident_location = str(incident_location or "Not specified").strip() or "Not specified"

        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
        extras = extra_fields or {}
        extra_info_str = ", ".join([f"{k}: {v}" for k, v in extras.items() if v]) if extras else ""
        # Diagnose incident to find relevant statutory sections
        diagnosis = diagnose_situation(f"{incident_category} {facts}")
        matched_crimes = diagnosis.get("matched_crimes", [])
        sections_summary = []
        for c in matched_crimes[:3]:
            bns_sec   = c.get("bns_section", "?")
            bns_title = c.get("bns_title",   "BNS 2023")
            ipc_sec   = c.get("ipc_section", "?")
            sections_summary.append(f"BNS Sec {bns_sec} ({bns_title}) [Legacy IPC Sec {ipc_sec}]")

        sections_str = ", ".join(sections_summary) if sections_summary else "Relevant sections of Bharatiya Nyaya Sanhita, 2023 (BNS)"


        if is_hindi:
            system_prompt = DRAFTING_SYSTEM_PROMPT_HI
            user_prompt = f"""दस्तावेज़ का प्रकार: {document_type}
आवेदक / परिवादी: {complainant.get('name', '')}, पिता/पति: {complainant.get('father_name', '')}, पता: {complainant.get('address', '')}, फोन: {complainant.get('phone', '')}
थाना / शहर: {complainant.get('police_station', '')}
आरोपी / प्रतिवादी: {accused.get('name', 'अज्ञात')}, पता/संपर्क: {accused.get('address', 'अज्ञात / डिजिटल')}
अपराध की श्रेणी: {incident_category}
घटना की तारीख व समय: {incident_datetime}
घटना स्थल: {incident_location}
विशिष्ट विवरण / अतिरिक्त फील्ड्स: {extra_info_str or 'लागू नहीं'}
घटना के मुख्य तथ्य: {facts}
संलग्न साक्ष्य: {evidence}
मांगी गई राहत / प्रार्थना: {relief_sought}
पहचानी गई संभावित धाराएं: {sections_str}

कृपया संपूर्ण, औपचारिक और प्रिंट करने योग्य विधिक ड्राफ्ट तैयार करें।"""
        else:
            system_prompt = DRAFTING_SYSTEM_PROMPT_EN
            user_prompt = f"""Document Type: {document_type}
Complainant / Sender: {complainant.get('name', '')}, S/o or D/o or W/o: {complainant.get('father_name', '')}, Address: {complainant.get('address', '')}, Phone: {complainant.get('phone', '')}
Jurisdictional Police Station / City: {complainant.get('police_station', '')}
Accused / Respondent: {accused.get('name', 'Unknown')}, Address/Contact: {accused.get('address', 'Unknown / Digital')}
Incident Category: {incident_category}
Incident Date & Time: {incident_datetime}
Incident Location: {incident_location}
Specific Template Particulars: {extra_info_str or 'None'}
Statement of Facts: {facts}
Attached Evidence / Documents: {evidence}
Relief / Prayer Sought: {relief_sought}
Suggested Governing Sections: {sections_str}

Please produce a comprehensive, formal, print-ready legal draft adhering to Indian court/police standards."""

        if not self.client:
            self._init_groq_client(self.api_key)

        models_to_try = [self.model_name]
        for fb in [FALLBACK_MODEL, "openai/gpt-oss-20b"]:
            if fb and fb not in models_to_try:
                models_to_try.append(fb)

        for model in models_to_try:
            try:
                eff_max_tokens = min(1400, 950) if "qwen" in model.lower() else 1400
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.15,
                    max_tokens=eff_max_tokens,
                    stream=False
                )
                raw_text = response.choices[0].message.content or ""
                draft_text = raw_text.strip()
                if not draft_text and hasattr(response.choices[0].message, "reasoning"):
                    draft_text = (response.choices[0].message.reasoning or "").strip()

                if not draft_text:
                    raise ValueError(f"Model {model} returned empty draft output.")

                return {
                    "success": True,
                    "document_type": document_type,
                    "language": language,
                    "sections_referenced": sections_summary,
                    "draft": draft_text,
                    "model": model
                }
            except Exception as e:
                print(f"[rag_engine] Drafting attempt failed on '{model}': {e}. Trying next fallback...")
                continue

        print("[rag_engine] All drafting models failed. Activating deterministic fallback template.")
        fallback_draft = self._generate_fallback_draft(
            document_type=document_type,
            is_hindi=is_hindi,
            complainant=complainant,
            accused=accused,
            incident_datetime=incident_datetime,
            incident_location=incident_location,
            facts=facts,
            evidence=evidence,
            relief=relief_sought,
            sections=sections_str,
            extra_fields=extras
        )
        return {
            "success": True,
            "document_type": document_type,
            "language": language,
            "sections_referenced": sections_summary,
            "draft": fallback_draft,
            "mode": "statutory_verified_template"
        }

    def _generate_fallback_draft(
        self,
        document_type: str,
        is_hindi: bool,
        complainant: Dict[str, str],
        accused: Dict[str, str],
        incident_datetime: str,
        incident_location: str,
        facts: str,
        evidence: str,
        relief: str,
        sections: str,
        extra_fields: Optional[Dict[str, Any]] = None
    ) -> str:
        return generate_fallback_draft(
            document_type=document_type,
            is_hindi=is_hindi,
            complainant=complainant,
            accused=accused,
            incident_datetime=incident_datetime,
            incident_location=incident_location,
            facts=facts,
            evidence=evidence,
            relief=relief,
            sections=sections,
            extra_fields=extra_fields
        )

    def analyze_legal_document(
        self,
        document_text: str,
        document_type: str = "General Contract",
        language: str = "English"
    ) -> Dict[str, Any]:
        """
        Analyzes a contract or legal document under Indian law.
        Identifies red flags, one-sided clauses, statutory non-compliance,
        and provides fair alternative wording and plain summaries.
        """
        return analyze_contract_document(
            client=self.client,
            default_model=self.model_name,
            document_text=document_text,
            document_type=document_type,
            language=language
        )

    def _heuristic_contract_analysis(self, text: str, doc_type: str, is_hindi: bool) -> Dict[str, Any]:
        return heuristic_contract_analysis(text, doc_type, is_hindi)

if __name__ == "__main__":
    engine = DhaaraRAGEngine()
    q = "Someone cheated me online for 50000 rupees through UPI. What case will be filed?"
    print(f"Testing Query: {q}")
    res = engine.query(q)
    print("\nGenerated Response:")
    print(res["answer"])
