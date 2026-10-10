"""
rag_engine.py
=============
Next-Generation Indian Statutory RAG Engine for DhaaraAI.
Integrates ChromaDB dense semantic retrieval with Groq's Llama 3.3 70B model,
BNS 2023 <-> IPC 1860 Master Concordance, and Supreme Court Landmark Directives.
"""

import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

from embed_store import LegalEmbedStore
from bns_concordance import diagnose_situation
from rag_offline_fallbacks import generate_offline_concordance_fallback
from draft_templates import generate_fallback_draft, find_matching_template_for_query
import legal_glossary
from contract_analyzer import analyze_contract_document, heuristic_contract_analysis
from legal_validator import LegalAccuracyValidator
from prompts import (
    DRAFTING_SYSTEM_PROMPT_EN,
    DRAFTING_SYSTEM_PROMPT_HI,
)
import rag_context_builder as rcb

# Singleton validator instance — shared across all requests (thread-safe, stateless)
_validator = LegalAccuracyValidator()

DEFAULT_MODEL = "openai/gpt-oss-120b"
FALLBACK_MODEL = "qwen/qwen3.8-27b"
SIMILARITY_THRESHOLD = 0.30


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

    def set_api_key(self, key: str):
        self._init_groq_client(key)

    def _format_concordance_context(self, question: str, user_role: str, diagnosis: Optional[Dict[str, Any]] = None) -> str:
        return rcb.format_concordance_context(question, user_role, diagnosis)

    def _format_retrieved_chunks(self, chunks: List[Dict[str, Any]]) -> str:
        return rcb.format_retrieved_chunks(chunks)

    def _format_case_law_chunks(self, chunks: List[Dict[str, Any]], question: str = "") -> str:
        return rcb.format_case_law_chunks(chunks, question)

    def _build_template_guidance_response(
        self,
        template: Dict[str, Any],
        question: str,
        language: str,
        user_role: str
    ) -> Dict[str, Any]:
        return rcb.build_template_guidance_response(template, question, language, user_role)

    def _build_glossary_definition_response(
        self,
        term: Dict[str, Any],
        question: str,
        language: str,
        user_role: str
    ) -> Dict[str, Any]:
        return rcb.build_glossary_definition_response(term, question, language, user_role)

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
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]

        # Layer 1: Draft Template Intent Routing
        matched_template = find_matching_template_for_query(question)
        if matched_template:
            return self._build_template_guidance_response(matched_template, question, language, user_role)

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

        if is_case_law_query:
            used_chunks = case_chunks + statute_chunks
        else:
            used_chunks = statute_chunks + case_chunks

        # Format context blocks
        diagnosis_data = diagnose_situation(question, user_role=user_role)
        concordance_ctx = self._format_concordance_context(question, user_role, diagnosis=diagnosis_data)
        retrieved_ctx = self._format_retrieved_chunks(statute_chunks)
        case_law_ctx = self._format_case_law_chunks(case_chunks, question)

        system_prompt, user_prompt, active_disclaimer, token_budget = rcb.build_query_prompts(
            question=question,
            language=language,
            user_role=user_role,
            concordance_ctx=concordance_ctx,
            retrieved_ctx=retrieved_ctx,
            case_law_ctx=case_law_ctx
        )

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
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
        extras = extra_fields or {}
        extra_info_str = ", ".join([f"{k}: {v}" for k, v in extras.items() if v]) if extras else ""

        diagnosis = diagnose_situation(f"{incident_category} {facts}")
        matched_crimes = diagnosis.get("matched_crimes", [])
        sections_summary = []
        for c in matched_crimes[:3]:
            sections_summary.append(f"BNS Sec {c['bns_section']} ({c['bns_title']}) [Legacy IPC Sec {c['ipc_section']}]")
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

                # Guarantee that all user-supplied template particulars are present in the final draft
                if extras:
                    import re
                    for k, v in extras.items():
                        if v and str(v) not in draft_text:
                            k_clean = re.escape(k.replace("_", " "))
                            draft_text = re.sub(rf"\[[^\]]*{k_clean}[^\]]*\]", str(v), draft_text, count=1, flags=re.IGNORECASE)
                    missing = [f"{k.replace('_', ' ').title()}: {v}" for k, v in extras.items() if v and str(v) not in draft_text]
                    if missing:
                        sec_header = "\n\nविशिष्ट संलग्न विवरण (SCHEDULE OF PARTICULARS):" if is_hindi else "\n\nSCHEDULE OF SPECIFIC PARTICULARS:"
                        draft_text = draft_text + sec_header + "\n" + "\n".join(f"- {m}" for m in missing)

                return {
                    "success": True,
                    "document_type": document_type,
                    "language": language,
                    "sections_referenced": sections_summary,
                    "draft": draft_text
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
            "draft": fallback_draft
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
