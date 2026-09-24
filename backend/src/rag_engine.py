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
from real_legal_fetcher import RealLegalDataService, OFFICIAL_LEGAL_HELPLINES
from rag_offline_fallbacks import generate_offline_concordance_fallback
from draft_templates import generate_fallback_draft
from contract_analyzer import analyze_contract_document, heuristic_contract_analysis

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

    def set_api_key(self, key: str):
        self._init_groq_client(key)

    def _format_concordance_context(self, question: str, user_role: str) -> str:
        diagnosis = diagnose_situation(question, user_role=user_role)
        blocks = []

        transition = diagnosis.get("transition", {})
        blocks.append(f"Transition Alert: {transition.get('rule_en', '')}")

        crimes = diagnosis.get("matched_crimes", [])
        for c in crimes:
            b = (
                f"• Offense: {c['offense_en']}\n"
                f"  - Active BNS Section: {c['bns_section']} ({c['bns_act']}) — {c['bns_title']}\n"
                f"  - Legacy IPC Section: {c['ipc_section']} ({c['ipc_act']})\n"
                f"  - Classification: {c['nature']} | {c['bailable']} | Triable by: {c['triable_by']}\n"
                f"  - Punishment: {c['punishment']}\n"
                f"  - BNSS Procedure & Rights: {c['bnss_procedure']}\n"
                f"  - Action for Complainant: {c['victim_guidance']}\n"
                f"  - Safeguard for Accused: {c['accused_guidance']}"
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

        formatted_blocks = []
        for idx, chunk in enumerate(chunks, 1):
            block = (
                f"[Statute Record {idx}]\n"
                f"• Source: {chunk.get('source', 'IndiaCode')}\n"
                f"• Section: {chunk.get('section', 'General')} - {chunk.get('section_title', '')}\n"
                f"• Relevance: {chunk.get('similarity_score', 0.0):.4f}\n"
                f"• Statutory Text:\n{chunk.get('text', '').strip()}\n"
            )
            formatted_blocks.append(block)

        return "\n".join(formatted_blocks)

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
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Executes end-to-end situational legal intelligence query with robust fallbacks.
        """
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]

        # 1. Retrieve top_k chunks from ChromaDB
        raw_chunks = self.embed_store.query(question, top_k=top_k)

        # Filter chunks by similarity threshold
        relevant_chunks = [
            c for c in raw_chunks
            if c.get("similarity_score", 0.0) >= SIMILARITY_THRESHOLD
        ]

        used_chunks = relevant_chunks if relevant_chunks else (raw_chunks[:2] if raw_chunks else [])

        # 2. Build enriched context
        concordance_ctx = self._format_concordance_context(question, user_role)
        retrieved_ctx = self._format_retrieved_chunks(used_chunks)

        if is_hindi:
            system_prompt = SYSTEM_PROMPT_HI.format(
                disclaimer=LEGAL_DISCLAIMER_HI,
                concordance_context=concordance_ctx,
                retrieved_context=retrieved_ctx
            )
            user_prompt = (
                f"नागरिक का सवाल / स्थिति: {question}\n"
                f"नागरिक का दृष्टिकोण: {user_role}\n\n"
                f"कृपया 100% स्पष्ट, सरल हिंदी (देवनागरी लिपि) में बुलेट पॉइंट्स के साथ त्वरित, सीधा व पूरा कानूनी समाधान दें।"
            )
            active_disclaimer = LEGAL_DISCLAIMER_HI
        else:
            system_prompt = SYSTEM_PROMPT_EN.format(
                disclaimer=LEGAL_DISCLAIMER_EN,
                concordance_context=concordance_ctx,
                retrieved_context=retrieved_ctx
            )
            user_prompt = (
                f"Citizen Query / Situation: {question}\n"
                f"User Perspective: {user_role}\n\n"
                f"Please provide a crisp, direct, concise legal solution in clean bullet points following the specified format."
            )
            active_disclaimer = LEGAL_DISCLAIMER_EN

        # 3. Check Groq Client Availability
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
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        # 4. Invoke Groq API with robust Try/Except fallback
        try:
            if stream:
                response_stream = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=0.1,
                    max_tokens=900,
                    stream=True
                )

                def token_generator():
                    for chunk in response_stream:
                        if chunk.choices and chunk.choices[0].delta.content:
                            yield chunk.choices[0].delta.content

                return {
                    "answer_stream": token_generator(),
                    "sources": used_chunks,
                    "question": question,
                    "language": language,
                    "concordance": diagnose_situation(question, user_role)
                }
            else:
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=0.1,
                    max_tokens=900,
                    stream=False
                )
                answer_text = response.choices[0].message.content.strip()

                if active_disclaimer not in answer_text:
                    answer_text += f"\n\n*{active_disclaimer}*"

                return {
                    "answer": answer_text,
                    "sources": used_chunks,
                    "question": question,
                    "language": language,
                    "concordance": diagnose_situation(question, user_role)
                }

        except Exception as api_err:
            print(f"[rag_engine] Groq API call failed: {api_err}. Activating graceful fallback.")
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
                "concordance": diagnose_situation(question, user_role)
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
        relief_sought: str
    ) -> Dict[str, Any]:
        """
        Generates a formal, legally grounded FIR Application or Legal Demand Notice.
        """
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
        
        # Diagnose incident to find relevant statutory sections
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
घटना के मुख्य तथ्य: {facts}
संलग्न साक्ष्य: {evidence}
मांगी गई राहत / प्रार्थना: {relief_sought}
पहचानी गई संभावित धाराएं: {sections_str}

कृपया संपूर्ण, औपचारिक और प्रिंट करने योग्य विधिक ड्राफ्ट (FIR या लीगल नोटिस) तैयार करें।"""
        else:
            system_prompt = DRAFTING_SYSTEM_PROMPT_EN
            user_prompt = f"""Document Type: {document_type}
Complainant / Sender: {complainant.get('name', '')}, S/o or D/o or W/o: {complainant.get('father_name', '')}, Address: {complainant.get('address', '')}, Phone: {complainant.get('phone', '')}
Jurisdictional Police Station / City: {complainant.get('police_station', '')}
Accused / Respondent: {accused.get('name', 'Unknown')}, Address/Contact: {accused.get('address', 'Unknown / Digital')}
Incident Category: {incident_category}
Incident Date & Time: {incident_datetime}
Incident Location: {incident_location}
Statement of Facts: {facts}
Attached Evidence / Documents: {evidence}
Relief / Prayer Sought: {relief_sought}
Suggested Governing Sections: {sections_str}

Please produce a comprehensive, formal, print-ready legal draft adhering to Indian police/legal standards."""

        if not self.client:
            self._init_groq_client(self.api_key)

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.15,
                max_tokens=1500,
                stream=False
            )
            draft_text = response.choices[0].message.content.strip()
            return {
                "success": True,
                "document_type": document_type,
                "language": language,
                "sections_referenced": sections_summary,
                "draft": draft_text
            }
        except Exception as e:
            print(f"[rag_engine] Drafting failed via primary model: {e}")
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
                sections=sections_str
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
        sections: str
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
            sections=sections
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
