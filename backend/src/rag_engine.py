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

from prompts import (
    LEGAL_DISCLAIMER_EN,
    LEGAL_DISCLAIMER_HI,
    SYSTEM_PROMPT_EN,
    SYSTEM_PROMPT_HI,
    DRAFTING_SYSTEM_PROMPT_EN,
    DRAFTING_SYSTEM_PROMPT_HI,
    CONTRACT_ANALYSIS_SYSTEM_PROMPT
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
            # Fallback to offline template
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
        """Fallback template if Groq API is unreachable."""
        is_notice = "notice" in str(document_type).lower()

        if is_notice:
            if is_hindi:
                return f"""रजिस्टर्ड डाक / विधिक मांग नोटिस (LEGAL DEMAND NOTICE)

दिनांक: {incident_datetime or 'आज का दिनांक'}
स्थान: {incident_location or 'स्थान'}

सेवा में (प्रतिवादी / प्राप्तकर्ता):
श्रीमान/श्रीमती: {accused.get('name', 'प्रतिवादी का नाम')}
पता / संपर्क: {accused.get('address', 'प्रतिवादी का पूर्ण पता')}

प्रेषक (परिवादी / नोटिसकर्ता):
{complainant.get('name', 'नोटिसकर्ता का नाम')},
आत्मज/पत्नी: {complainant.get('father_name', 'पिता/पति का नाम')},
निवासी: {complainant.get('address', 'नोटिसकर्ता का पता')},
संपर्क सूत्र: {complainant.get('phone', '')}

विषय: विधिक मांग नोटिस बाबत {facts[:60]}... 
सुसंगत विधिक धाराएं: {sections}

महोदय,
मेरे मुवक्किल/नोटिसकर्ता की ओर से आपको यह कानूनी नोटिस निम्नलिखित तथ्यों पर प्रेषित किया जाता है:

1. यह कि नोटिसकर्ता का विधिवत परिचय व अधिकार क्षेत्र उपरोक्त पते पर स्थित है।
2. यह कि दिनांक {incident_datetime} को स्थान {incident_location} पर निम्नलिखित कृत्य/घटना घटित हुई:
   {facts}
3. यह कि आपके उक्त कृत्य के विरुद्ध निम्नलिखित साक्ष्य व दस्तावेज सुरक्षित हैं:
   {evidence or 'उपलब्ध अभिलेख, बैंक लेनदेन एवं पत्राचार'}
4. यह कि आपका यह कृत्य {sections} तथा भारतीय न्याय संहिता, 2023 (BNS) के सुसंगत प्रावधानों के अंतर्गत प्रत्यक्ष रूप से विधि विरुद्ध एवं दंडनीय है।

अतः इस विधिक नोटिस के माध्यम से आपको निर्देशित किया जाता है कि:
{relief or 'इस नोटिस की प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त देय राशि/क्षतिपूर्ति का भुगतान करें अथवा विवादित कृत्य का तत्काल निवारण करें।'}

चेतावनी: यदि आप इस नोटिस की प्राप्ति के 15 दिनों के भीतर उपरोक्त मांग की पूर्ति करने में विफल रहते हैं, तो नोटिसकर्ता आपके विरुद्ध सक्षम न्यायालय एवं पुलिस प्राधिकारियों के समक्ष दीवानी (Civil) एवं आपराधिक (Criminal) विधिक कार्यवाही संस्थित करने के लिए बाध्य होगा, जिसका संपूर्ण हर्ज़ा-खर्चा एवं परिणाम आपके व्यक्तिगत दायित्व पर होगा।

नोटिसकर्ता के हस्ताक्षर: .......................................
({complainant.get('name', 'नोटिसकर्ता')})"""
            else:
                return f"""LEGAL DEMAND NOTICE / STATUTORY NOTICE
(Sent via Registered Post A.D. / Speed Post / Digital Mode)

Date: {incident_datetime or 'CURRENT DATE'}
Place: {incident_location or 'LOCATION'}

TO (NOTICE RECIPIENT / RESPONDENT):
Name: {accused.get('name', 'Name of the Accused / Respondent')}
Address / Contact: {accused.get('address', 'Full Address / Contact Details')}

FROM (COMPLAINANT / SENDER):
{complainant.get('name', 'Complainant Full Name')},
S/o, D/o, W/o: {complainant.get('father_name', 'Parent/Spouse Name')},
Residing at: {complainant.get('address', 'Complete Address')},
Contact: {complainant.get('phone', '')}

SUBJECT: STATUTORY LEGAL DEMAND NOTICE UNDER INDIAN LAW
GOVERNING STATUTES: {sections}

Sir / Madam,

Under instructions from and on behalf of my client / undersigned, I hereby serve upon you this formal Legal Demand Notice on the following grounds and facts:

1. FACTUAL BACKGROUND:
   On or around {incident_datetime} at {incident_location}, the following incident / dispute transpired:
   {facts}

2. SUPPORTING EVIDENCE & DOCUMENTATION:
   The complainant holds conclusive documentation/evidence regarding the above matter, including:
   {evidence or 'Bank transfer statements, electronic communications, and transaction slips'}

3. STATUTORY INFRINGEMENT & BREACH:
   Your aforesaid wrongful actions and default constitute serious civil wrongs as well as cognizable offenses under {sections} and governing Indian enactments.

4. DEMAND & RELIEF SOUGHT:
   You are hereby called upon to comply with the following demands:
   {relief or 'Rectify the default / refund the aggrieved amount in full within 15 (fifteen) statutory days from receipt of this notice.'}

NOTICE PERIOD & PENAL CONSEQUENCES:
Take notice that if you fail to comply with the aforesaid statutory requisition within 15 (fifteen) calendar days from the receipt of this legal notice, the undersigned shall be constrained to initiate appropriate civil suits and criminal proceedings against you before the competent Courts of Law under the Bharatiya Nyaya Sanhita, 2023 (BNS) and Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS), holding you solely liable for all statutory costs, damages, interest, and legal consequences arising therefrom.

Complainant / Notice Sender Signature: .......................................
({complainant.get('name', 'Complainant / Sender')})"""

        if is_hindi:
            return f"""सेवा में,
श्रीमान थाना प्रभारी (SHO) महोदय,
थाना: {complainant.get('police_station', 'स्थानीय पुलिस थाना')},

विषय: धारा 173 भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS) के तहत प्राथमिकी (FIR) दर्ज करने बाबत।
संदर्भ धाराएं: {sections}

महोदय,
सविनय निवेदन है कि प्रार्थी/परिवादी का विवरण निम्नवत है:
1. परिवादी का नाम: {complainant.get('name', '')}
   पिता/पति का नाम: {complainant.get('father_name', '')}
   निवासी: {complainant.get('address', '')}
   मोबाइल नंबर: {complainant.get('phone', '')}

2. आरोपी / संदिग्ध का विवरण:
   नाम: {accused.get('name', 'अज्ञात')}
   पता/विवरण: {accused.get('address', 'अज्ञात')}

3. घटना का समय व स्थान:
   दिनांक व समय: {incident_datetime}
   स्थान: {incident_location}

4. घटना का विवरण:
   {facts}

5. संलग्न साक्ष्य / दस्तावेज:
   {evidence}

6. प्रार्थना:
   अतः श्रीमान जी से सादर प्रार्थना है कि प्रार्थी की उक्त शिकायत को तुरंत धारा 173 BNSS के अंतर्गत प्रथम सूचना रिपोर्ट (FIR) के रूप में दर्ज कर उचित कानूनी कार्रवाई करने की कृपा करें।

सत्यापन:
मैं सत्यनिष्ठा से प्रतिज्ञान करता/करती हूँ कि ऊपर लिखे तथ्य मेरी जानकारी और विश्वास में पूर्णतः सत्य हैं।

दिनांक: ...............
स्थान: ...............

हस्ताक्षर / अंगूठा निशानी: ...................................
({complainant.get('name', 'परिवादी')})"""
        else:
            return f"""TO,
THE STATION HOUSE OFFICER (SHO),
POLICE STATION: {complainant.get('police_station', '[Jurisdictional Police Station]')},

SUBJECT: COMPLAINT UNDER SECTION 173 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS) FOR REGISTRATION OF FIR.
GOVERNING STATUTES: {sections}

Sir/Madam,

I, the undersigned Complainant, state the relevant facts of the case as under:

1. COMPLAINANT PARTICULARS:
   - Full Name: {complainant.get('name', '')}
   - S/o, D/o, W/o: {complainant.get('father_name', '')}
   - Address: {complainant.get('address', '')}
   - Contact Number: {complainant.get('phone', '')}

2. ACCUSED / RESPONDENT PARTICULARS:
   - Name: {accused.get('name', 'Unknown person(s)')}
   - Address/Details: {accused.get('address', 'Unknown')}

3. INCIDENT TIMELINE & LOCATION:
   - Date & Time: {incident_datetime}
   - Location: {incident_location}

4. STATEMENT OF FACTS:
   {facts}

5. ENCLOSURES & EVIDENCE:
   {evidence}

6. PRAYER:
   It is therefore most respectfully prayed that an FIR may kindly be registered immediately under Section 173 of BNSS, 2023 read with applicable provisions of BNS 2023, and rigorous investigation be initiated against the accused person(s) in the interest of justice.

VERIFICATION:
Verified at on this day that the contents of the above complaint are true and correct to the best of my knowledge and belief.

Date: .....................
Place: ....................

Signature of Complainant: .......................................
({complainant.get('name', 'Complainant')})"""

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
        is_hindi = "hindi" in str(language).lower()

        # Attempt Groq LLM analysis first if client is available
        if self.client:
            prompt_lang = "HINDI (देवनागरी)" if is_hindi else "ENGLISH"
            system_instruction = CONTRACT_ANALYSIS_SYSTEM_PROMPT.format(prompt_lang=prompt_lang)

            user_msg = f"Document Type: {document_type}\n\nDocument Text:\n{document_text[:6000]}"

            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": user_msg}
                    ],
                    model=DEFAULT_MODEL,
                    temperature=0.2,
                    response_format={"type": "json_object"}
                )
                import json
                parsed = json.loads(chat_completion.choices[0].message.content)
                parsed["success"] = True
                parsed["source"] = "AI Legal Audit"
                return parsed
            except Exception as e:
                print(f"Groq contract analysis failed: {e}. Falling back to rule-based engine.")

        # Heuristic fallback analysis under Indian law
        return self._heuristic_contract_analysis(document_text, document_type, is_hindi)

    def _heuristic_contract_analysis(self, text: str, doc_type: str, is_hindi: bool) -> Dict[str, Any]:
        """Rule-based Indian contract auditor detecting predatory clauses."""
        text_lower = text.lower()
        red_flags = []
        missing = []
        score = 20

        # Check 1: Non-compete restraint of trade (Sec 27 Indian Contract Act)
        if any(k in text_lower for k in ["non-compete", "not work for any competitor", "restraint of trade", "shall not engage in any other business", "प्रतिस्पर्धी"]):
            score += 25
            red_flags.append({
                "clause": "Post-employment / post-service non-compete restriction",
                "issue": "Blanket post-termination non-compete clauses are declared void as restraint of lawful profession under Indian law." if not is_hindi else "भारतीय कानून के तहत नौकरी के बाद किसी अन्य कंपनी में काम करने पर पूर्ण रोक गैर-कानूनी (शून्य) मानी जाती है।",
                "statute": "Section 27, Indian Contract Act, 1872 (Restraint of trade void)",
                "severity": "High",
                "fair_alternative": "The restriction shall strictly apply only to safeguarding verified proprietary trade secrets and active customer solicitation during active service." if not is_hindi else "प्रतिबंध केवल सेवा अवधि के दौरान वास्तविक व्यावसायिक रहस्यों एवं ग्राहकों के अनुचित उपयोग तक सीमित रहेगा।"
            })

        # Check 2: Unilateral termination or unfair penalty (Sec 73, 74)
        if any(k in text_lower for k in ["terminate at any time without notice", "sole discretion without cause", "forfeit the entire deposit", "non-refundable deposit", "जब्त"]):
            score += 25
            red_flags.append({
                "clause": "Unilateral termination or blanket deposit forfeiture",
                "issue": "Allows one party to terminate arbitrarily or confiscate deposits without genuine pre-estimated loss." if not is_hindi else "एकतरफा समाप्ति या बिना हिसाब-किताब के पूरी जमा राशि (सिक्योरिटी) जब्त करने का एकतरफा अधिकार।",
                "statute": "Sections 73 & 74, Indian Contract Act, 1872 (Reasonable compensation vs penalty)",
                "severity": "High",
                "fair_alternative": "Either party may terminate by providing a minimum 30 days written notice. Security deposit must be refunded within 15 days of handover with itemized deductions only." if not is_hindi else "दोनों पक्षों को कम से कम 30 दिन का लिखित नोटिस देना होगा। कब्जा सौंपने के 15 दिनों में सिक्योरिटी का पूरा हिसाब देकर राशि लौटानी होगी।"
            })

        # Check 3: Uncapped indemnity or complete waiver of liability
        if any(k in text_lower for k in ["indemnify and hold harmless", "unlimited liability", "not responsible for any damage or loss", "पूर्ण रूप से उत्तरदायी"]):
            score += 20
            red_flags.append({
                "clause": "One-sided broad indemnity / complete waiver of owner liability",
                "issue": "Exempts the stronger party from standard duty of care while placing open-ended risk on the signer." if not is_hindi else "मालिक या मुख्य संस्था को अपनी लापरवाही से मुक्त करना और आपके ऊपर असीमित देनदारी डालना।",
                "statute": "Section 23 & 73, Indian Contract Act, 1872; Consumer Protection Act 2019",
                "severity": "Medium",
                "fair_alternative": "Indemnity shall be strictly mutual and capped at the total fee/rent paid under this agreement, excluding cases of gross negligence or willful misconduct." if not is_hindi else "क्षतिपूर्ति आपसी होगी तथा समझौते के तहत देय वास्तविक राशि तक सीमित रहेगी।"
            })

        # Check 4: Exclusive distant jurisdiction
        if any(k in text_lower for k in ["exclusive jurisdiction of courts in", "exclusive jurisdiction", "अधिकार क्षेत्र"]):
            red_flags.append({
                "clause": "Exclusive distant court jurisdiction clause",
                "issue": "May force disputes into inconvenient outstation courts far from where the service was actually rendered." if not is_hindi else "विवाद होने पर दूरस्थ शहर की अदालत में जाने की एकतरफा शर्त।",
                "statute": "Section 28, Indian Contract Act & Section 20, CPC 1908",
                "severity": "Low",
                "fair_alternative": "Disputes shall be subject to the competent courts having jurisdiction over the location where the property is situated or service is rendered." if not is_hindi else "विवाद उसी स्थान की अदालत में सुना जाएगा जहां संपत्ति स्थित है अथवा सेवा प्रदान की गई है।"
            })

        # Check 5: Missing essential protections
        if "rent" in text_lower or "tenant" in text_lower or "lease" in text_lower:
            missing.append("Specific time-bound security deposit refund clause with interest if delayed (Model Tenancy Act)")
            missing.append("Clear structural repair responsibility vs minor tenant maintenance demarcation")
        elif "employ" in text_lower or "job" in text_lower or "service" in text_lower:
            missing.append("Clear working hours, overtime policy, and statutory PF/ESI entitlement references")
            missing.append("Objective dispute resolution and mediation before litigation")
        else:
            missing.append("Mutual termination clause with equal notice period for both parties")
            missing.append("Force Majeure clause covering natural disasters and governmental orders")

        score = min(score, 95)
        risk_label = "Critical" if score >= 75 else "High" if score >= 50 else "Medium" if score >= 30 else "Low"

        if is_hindi:
            summary = f"यह {doc_type} प्रकृति का विधिक दस्तावेज है। विश्लेषण में {len(red_flags)} संभावित जोखिमपूर्ण या एकतरफा शर्तें पाई गई हैं।"
            advice = [
                "हस्ताक्षर करने से पूर्व एकतरफा शर्तों (विशेषकर सिक्योरिटी जब्ती व गैर-प्रतिस्पर्धा) पर लिखित संशोधन मांगें।",
                "व्हाट्सएप या ईमेल पर समझौते से जुड़ी सभी सहमतियां लिखित रूप में सुरक्षित रखें।"
            ]
        else:
            summary = f"This document appears to be a {doc_type}. The statutory review identified {len(red_flags)} potentially unfavorable or unenforceable provisions under Indian contract law."
            advice = [
                "Request written revisions for the flagged high-severity clauses before executing the contract.",
                "Ensure all side agreements or verbal promises are incorporated into the written annexures."
            ]

        return {
            "success": True,
            "source": "Indian Statutory Heuristic Engine",
            "summary": summary,
            "risk_score": risk_label,
            "risk_percentage": score,
            "key_findings": [
                f"{len(red_flags)} problematic provisions identified" if not is_hindi else f"{len(red_flags)} आपत्तिजनक शर्तें चिन्हित की गईं",
                "Compliance examined under Indian Contract Act 1872" if not is_hindi else "भारतीय अनुबंध अधिनियम 1872 के आधार पर समीक्षा की गई"
            ],
            "red_flags": red_flags,
            "missing_protections": missing,
            "actionable_advice": advice
        }

if __name__ == "__main__":
    engine = DhaaraRAGEngine()
    q = "Someone cheated me online for 50000 rupees through UPI. What case will be filed?"
    print(f"Testing Query: {q}")
    res = engine.query(q)
    print("\nGenerated Response:")
    print(res["answer"])
