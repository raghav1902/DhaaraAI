"""
rag_offline_fallbacks.py
========================
Provides graceful offline statutory concordance fallback when Groq API is unavailable or rate-limited.
"""

from bns_concordance import diagnose_situation
from prompts import LEGAL_DISCLAIMER_EN, LEGAL_DISCLAIMER_HI

def generate_offline_concordance_fallback(
    question: str,
    user_role: str,
    reason: str,
    language: str = "English"
) -> str:
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
                    f"#### {itm.get('offense_hi', itm.get('offense_en', 'अपराध'))}",
                    f"- **लागू कानून (BNS 2023)**: धारा {itm.get('bns_section','?')} ({itm.get('bns_title','BNS')})",
                    f"- **पुराना संदर्भ (IPC 1860)**: धारा {itm.get('ipc_section','?')} ({itm.get('ipc_title','IPC')})",
                    f"- **प्रकृति व जमानत**: {itm.get('nature','?')} | {itm.get('bailable','?')}",
                    f"- **सजा**: {itm.get('punishment','?')} | **अदालत**: {itm.get('triable_by','?')}",
                    f"- **तुरंत कार्रवाई**: {itm.get('victim_guidance','') if user_role == 'victim' else itm.get('accused_guidance','')}",
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
                    f"#### {itm.get('offense_en', 'Legal Matter')}",
                    f"- **Active Law (BNS 2023)**: Section {itm.get('bns_section','?')} ({itm.get('bns_title','BNS')})",
                    f"- **Legacy Law (IPC 1860)**: Section {itm.get('ipc_section','?')} ({itm.get('ipc_title','IPC')})",
                    f"- **Nature & Bail**: {itm.get('nature','?')} | {itm.get('bailable','?')}",
                    f"- **Punishment**: {itm.get('punishment','?')} | **Trial Court**: {itm.get('triable_by','?')}",
                    f"- **Action**: {itm.get('victim_guidance','') if user_role == 'victim' else itm.get('accused_guidance','')}",
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
