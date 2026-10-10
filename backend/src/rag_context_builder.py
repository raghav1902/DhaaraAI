"""
rag_context_builder.py
======================
Helper utilities for structuring statutory chunks, case law records,
and prompt contexts for the DhaaraAI RAG pipeline.
"""

from typing import List, Dict, Any, Optional, Tuple
from bns_concordance import diagnose_situation
from real_legal_fetcher import RealLegalDataService
from prompts import (
    LEGAL_DISCLAIMER_EN,
    LEGAL_DISCLAIMER_HI,
    SYSTEM_PROMPT_EN,
    SYSTEM_PROMPT_HI,
)

def format_concordance_context(
    question: str,
    user_role: str,
    diagnosis: Optional[Dict[str, Any]] = None
) -> str:
    """Formats BNS/IPC crime diagnosis into structured context block."""
    if diagnosis is None:
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

def format_retrieved_chunks(chunks: List[Dict[str, Any]]) -> str:
    """Formats dense statutory chunks from ChromaDB with explicit citation manifest."""
    if not chunks:
        return "No specific dense text chunks retrieved from IndiaCode repository."

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

def format_case_law_chunks(chunks: List[Dict[str, Any]], question: str = "") -> str:
    """Formats retrieved Supreme Court case law chunks along with landmark judicial directives."""
    formatted_blocks = []

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

def build_template_guidance_response(
    template: Dict[str, Any],
    question: str,
    language: str,
    user_role: str
) -> Dict[str, Any]:
    """Generates structured response when user intent matches a legal drafting template."""
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

def build_glossary_definition_response(
    term: Dict[str, Any],
    question: str,
    language: str,
    user_role: str
) -> Dict[str, Any]:
    """Generates structured response when user intent matches a legal glossary term."""
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

def build_query_prompts(
    question: str,
    language: str,
    user_role: str,
    concordance_ctx: str,
    retrieved_ctx: str,
    case_law_ctx: str
) -> Tuple[str, str, str, int]:
    """Assembles localized system prompt, user prompt, disclaimer, and token budget."""
    is_hindi = str(language).strip().lower() in ["hindi", "hi", "हिंदी"]
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

    return system_prompt, user_prompt, active_disclaimer, token_budget
