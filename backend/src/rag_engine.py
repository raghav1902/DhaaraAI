"""
rag_engine.py
=============
Next-Generation Indian Statutory RAG Engine for DhaaraAI.
Integrates ChromaDB dense semantic retrieval with Groq's Llama 3.3 70B model,
BNS 2023 <-> IPC 1860 Master Concordance, and Supreme Court Landmark Directives.

Design Principles:
1. High Factual Precision: Grounded, citation-backed responses strictly based on statutory law.
2. Zero Outdated Laws: Prioritizes Bharatiya Nyaya Sanhita (BNS 2023) and BNSS 2023, with legacy IPC/CrPC cross-references.
3. Clean IndiaCode Source: Statutory definitions derived from verified IndiaCode legislative texts.
4. Robust Fallbacks: Graceful degradation if vector search finds no matching statute or if Groq API times out/rate-limits.
5. Mandatory Statutory Disclaimer: Appended to every response.
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

DEFAULT_MODEL = "openai/gpt-oss-120b"
FALLBACK_MODEL = "qwen/qwen3.8-27b"
SIMILARITY_THRESHOLD = 0.30

# Mandatory statutory disclaimers
LEGAL_DISCLAIMER_EN = "This is general legal information, not a substitute for professional legal advice. Please consult an advocate."
LEGAL_DISCLAIMER_HI = "यह केवल सामान्य कानूनी जानकारी है, पेशेवर कानूनी सलाह का विकल्प नहीं है। किसी योग्य अधिवक्ता से परामर्श अवश्य लें।"

SYSTEM_PROMPT_EN = """You are DhaaraAI, a fast, precise Indian Legal Intelligence Assistant.
Your goal is to give common Indian citizens a quick, direct, and complete legal solution in under 30 seconds of reading.

CRITICAL RULES:
1. HIGH IMPACT & CONCISE: DO NOT write walls of text, repetitive introductions, or huge complex tables. Use clean bullet points and short cards.
2. CITATION (BNS 2023 FIRST): For criminal offenses, always cite the ACTIVE Bharatiya Nyaya Sanhita, 2023 (BNS) section first, followed by the legacy Indian Penal Code, 1860 (IPC) section as cross-reference. (Note: incidents after 1 July 2024 fall under BNS 2023).
3. MANDATORY FORMAT:
### ⚡ Quick Summary (Direct Answer)
- 2-3 crisp bullet points: exactly what happened, what law applies, whether bailable, and the immediate outcome.

### ⚖️ Applicable Legal Sections (BNS 2023 & IPC)
- **Active Law (BNS 2023)**: Section [BNS Section] — [Offense Title]
- **Legacy Law (IPC 1860)**: Section [IPC Section] (for historical cross-reference)
- **Punishment & Fine**: [Imprisonment term / Fine amount / Community Service]

### 📌 Key Legal Points (Bail & Police Action)
- **Offense Nature**: Cognizable (Police can file FIR & investigate) OR Non-Cognizable
- **Bail Status**: Bailable (Bail available at police station as a matter of right) OR Non-Bailable (Court discretion)
- **Court**: Triable by [Magistrate / Sessions Court]

### 📋 Immediate Action Plan (Step-by-Step)
- **For Complainant / Victim**: 3 practical immediate actions (FIR/Zero FIR, evidence to preserve, medical/photo).
- **For Accused / Other Party**: 2 protective safeguards (Notice under Sec 35(3) BNSS - no automatic arrest for offenses <= 7 yrs; Anticipatory Bail rights).

### 📞 Emergency Helplines
- Police: 112 | Cyber Financial Fraud: 1930 | Women Helpline: 181 | Free Legal Aid: 1516

*{disclaimer}*

--- VERIFIED STATUTORY CONCORDANCE ---
{concordance_context}
---------------------------------------
--- RETRIEVED STATUTORY TEXTS ---
{retrieved_context}
---------------------------------
"""

SYSTEM_PROMPT_HI = """आप DhaaraAI हैं, एक त्वरित, सटीक और विश्वसनीय भारतीय कानूनी सहायक (Legal Intelligence Assistant)।
आपका उद्देश्य आम नागरिक को उनकी कानूनी स्थिति, लागू धाराएं और अधिकार केवल 30 सेकंड में बिल्कुल स्पष्ट व सरल रूप से समझाना है।

अनिवार्य भाषा व प्रारूप नियम:
1. शत-प्रतिशत शुद्ध व सरल हिंदी: आपका पूरा उत्तर केवल और केवल हिंदी (देवनागरी लिपि) में होना चाहिए। कोई भी हेडिंग, बिंदु या सलाह अंग्रेजी में न लिखें।
2. संक्षिप्त व सटीक: अनावश्यक लंबे पैराग्राफ या बड़ी थकाऊ टेबल न बनाएं। उत्तर को साफ-सुथरे बुलेट पॉइंट्स में रखें ताकि कोई भी व्यक्ति तुरंत समझ सके।
3. BNS 2023 प्राथमिकता: 1 जुलाई 2024 के बाद की घटनाओं के लिए नई 'भारतीय न्याय संहिता, 2023 (BNS)' की मुख्य धारा पहले लिखें, और पुराने संदर्भ के लिए 'IPC 1860' की धारा साथ में बताएं।

अनिवार्य उत्तर प्रारूप (Strict Hindi Format):
### ⚡ त्वरित फैसला / समाधान (Quick Summary)
- 2-3 बुलेट पॉइंट्स: क्या हुआ, कौन सी मुख्य धारा लगेगी, क्या यह जमानती है और तुरंत क्या स्थिति बनेगी।

### ⚖️ लागू कानूनी धाराएं (BNS 2023 व IPC)
- **लागू कानून (BNS 2023)**: धारा [BNS Section] — [अपराध का शीर्षक]
- **पुराना कानून (IPC 1860)**: धारा [IPC Section] (पुराने रिकॉर्ड की तुलना हेतु)
- **सजा व जुर्माना**: [अधिकतम सजा / जुर्माना / सामुदायिक सेवा]

### 📌 कानूनी स्थिति (जमानत व पुलिस अधिकार)
- **अपराध की प्रकृति**: संज्ञेय (Cognizable - पुलिस सीधे FIR दर्ज कर सकती है) या असंज्ञेय
- **जमानत की स्थिति**: जमानती (Bailable - थाने से ही मुचलके पर जमानत मिल सकती है) या गैर-जमानती
- **अदालत**: [संबंधित मजिस्ट्रेट / सत्र न्यायालय]

### 📋 तुरंत क्या करें (कदम-दर-कदम कार्रवाई)
- **यदि आप पीड़ित / शिकायतकर्ता हैं**: 3 आवश्यक कदम (FIR दर्ज कराना, घटनास्थल के फोटो/सबूत, मेडिकल रिपोर्ट)।
- **यदि आप पर आरोप है / दूसरी पार्टी हैं**: 2 कानूनी सुरक्षा (धारा 35(3) BNSS नोटिस नियम - 7 साल से कम सजा में बिना उचित कारण सीधी गिरफ्तारी नहीं; जमानत अधिकार)।

### 📞 आपातकालीन हेल्पलाइन
- पुलिस सहायता: 112 | साइबर वित्तीय धोखाधड़ी: 1930 | महिला हेल्पलाइन: 181 | मुफ्त कानूनी सलाह: 1516

*{disclaimer}*

--- सत्यापित कानूनी संदर्भ ---
{concordance_context}
---------------------------
--- वैधानिक टेक्स्ट (IndiaCode) ---
{retrieved_context}
----------------------------------
"""


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
        """
        Provides graceful offline fallback when Groq API is unavailable or rate-limited.
        """
        is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
        diagnosis = diagnose_situation(question, user_role=user_role)
        matched = diagnosis.get("matched_crimes", [])

        if is_hindi:
            lines = [
                f"**सूचना**: {reason}",
                "",
                "### ⚡ मुख्य कानूनी समाधान (Verified Concordance):",
            ]
            if matched:
                for itm in matched:
                    lines.extend([
                        f"#### {itm.get('offense_hi', itm['offense_en'])}",
                        f"- **लागू कानून (BNS 2023)**: धारा {itm['bns_section']} ({itm['bns_title']})",
                        f"- **पुराना संदर्भ (IPC 1860)**: धारा {itm['ipc_section']} ({itm['ipc_title']})",
                        f"- **प्रकृति व जमानत**: {itm['nature']} | {itm['bailable']}",
                        f"- **सजा**: {itm['punishment']} | **अदालत**: {itm['triable_by']}",
                        f"- **तुरंत कार्रवाई**: {itm['victim_guidance'] if user_role == 'victim' else itm['accused_guidance']}",
                        ""
                    ])
            else:
                lines.extend([
                    "सामान्य कानूनी प्रक्रिया:",
                    "1. संज्ञेय अपराध में धारा 173 BNSS (Zero FIR) के तहत FIR दर्ज कराना अनिवार्य है।",
                    "2. 7 वर्ष से कम सजा वाले अपराधों में धारा 35(3) BNSS के तहत पहले नोटिस दिया जाता है।",
                    "3. आपातकालीन सहायता: 112 (पुलिस), 1930 (साइबर फ्रॉड), 1516 (मुफ्त कानूनी सलाह)।",
                    ""
                ])
            lines.extend([
                "**आपातकालीन हेल्पलाइन**:",
                "- पुलिस सहायता: 112 | वित्तीय फ्रॉड: 1930 | महिला सुरक्षा: 181 | कानूनी सहायता: 1516",
                "",
                f"*{LEGAL_DISCLAIMER_HI}*"
            ])
        else:
            lines = [
                f"**Notice**: {reason}",
                "",
                "### ⚡ Primary Statutory Guidance:",
            ]
            if matched:
                for itm in matched:
                    lines.extend([
                        f"#### {itm['offense_en']}",
                        f"- **Active Law (BNS 2023)**: Section {itm['bns_section']} ({itm['bns_title']})",
                        f"- **Legacy Law (IPC 1860)**: Section {itm['ipc_section']} ({itm['ipc_title']})",
                        f"- **Nature & Bail**: {itm['nature']} | {itm['bailable']}",
                        f"- **Punishment**: {itm['punishment']} | **Trial Court**: {itm['triable_by']}",
                        f"- **Action**: {itm['victim_guidance'] if user_role == 'victim' else itm['accused_guidance']}",
                        ""
                    ])
            else:
                lines.extend([
                    "General Statutory Guidance:",
                    "1. Cognizable offenses require mandatory First Information Report (FIR) under Section 173 BNSS.",
                    "2. For offenses punishable up to 7 years, Section 35(3) BNSS notice applies prior to arrest.",
                    "3. Emergency escalation: Call 112 for Police, 1930 for cyber fraud, or 1516 for legal aid.",
                    ""
                ])
            lines.extend([
                "**Emergency Helplines**:",
                "- Police: 112 | Cyber Crime: 1930 | Women: 181 | Legal Aid: 1516",
                "",
                f"*{LEGAL_DISCLAIMER_EN}*"
            ])

        return "\n".join(lines)

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

        # Vector search fallback flag
        vector_fallback_needed = (len(relevant_chunks) == 0)
        fallback_prefix = ""
        if vector_fallback_needed:
            used_chunks = raw_chunks[:2] if raw_chunks else []
        else:
            used_chunks = relevant_chunks

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


if __name__ == "__main__":
    engine = DhaaraRAGEngine()
    q = "Someone cheated me online for 50000 rupees through UPI. What case will be filed?"
    print(f"Testing Query: {q}")
    res = engine.query(q)
    print("\nGenerated Response:")
    print(res["answer"])
