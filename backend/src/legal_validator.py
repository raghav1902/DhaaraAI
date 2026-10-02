"""
legal_validator.py
==================
Post-generation legal citation and accuracy validator for DhaaraAI LegalChat.

Validates generated answers against the retrieved statutory and case-law
context that was injected into the prompt. Detects:
  1. Known act-section misattributions (e.g. 'BNS 138' for cheque bounce,
     'BNSS 438' instead of BNSS 482 for anticipatory bail, etc.)
  2. Overreach / absolute language ('automatically illegal', 'per se illegal' etc.)
  3. Case citations that cannot be confirmed against retrieved case-law chunks

Pure Python -- zero additional API calls, negligible per-request latency (~1 ms).
"""

import re
from typing import List, Dict, Any, Tuple


# ─────────────────────────────────────────────────────────────────────────────
# KNOWN MISATTRIBUTION PATTERNS
# Each tuple: (compiled_regex, human_readable_explanation)
# These are verifiably wrong combinations under Indian law.
# ─────────────────────────────────────────────────────────────────────────────
_RAW_MISATTRIBUTIONS: List[Tuple[str, str]] = [
    # Cheque bounce is NI Act 138, NOT BNS 138
    (
        r"\bBNS[\s\-]*(?:Section\s+)?138\b",
        "Section 138 belongs to the Negotiable Instruments Act, 1881 — not BNS 2023. "
        "BNS Section 138 is a different provision (offences by companies). "
        "Correct citation: Section 138 Negotiable Instruments Act, 1881."
    ),
    # Anticipatory bail: CrPC 438 -> BNSS 482 (not BNSS 438)
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?438\b",
        "Anticipatory bail under BNSS 2023 is Section 482, not Section 438. "
        "Section 438 belongs to legacy CrPC 1973. "
        "Correct citation: Section 482 BNSS 2023."
    ),
    # Notice before arrest: CrPC 41A -> BNSS 35(3)
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?41[Aa]\b",
        "Notice before arrest under BNSS 2023 is Section 35(3), not Section 41A. "
        "Section 41A belongs to legacy CrPC 1973. "
        "Correct citation: Section 35(3) BNSS 2023."
    ),
    # FIR: CrPC 154 -> BNSS 173
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?154\b",
        "FIR under BNSS 2023 is Section 173, not Section 154. "
        "Section 154 belongs to legacy CrPC 1973. "
        "Correct citation: Section 173 BNSS 2023."
    ),
    # Magistrate FIR direction: CrPC 156(3) -> BNSS 175(3)
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?156\s*\(?3\)?\b",
        "Magistrate direction to register FIR under BNSS 2023 is Section 175(3), not Section 156(3). "
        "Section 156(3) belongs to legacy CrPC 1973. "
        "Correct citation: Section 175(3) BNSS 2023."
    ),
    # Default/statutory bail: CrPC 167(2) -> BNSS 187(5)(b)
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?167\b",
        "Default/statutory bail under BNSS 2023 is Section 187(5)(b), not Section 167. "
        "Section 167(2) belongs to legacy CrPC 1973. "
        "Correct citation: Section 187(5)(b) BNSS 2023."
    ),
    # Electronic evidence certificate: IEA 65B -> BSA 63
    (
        r"\bBSA[\s\-]*(?:Section\s+)?65[Bb]\b",
        "Electronic record certificate under BSA 2023 is Section 63, not Section 65B. "
        "Section 65B belongs to legacy Indian Evidence Act 1872. "
        "Correct citation: Section 63 BSA 2023."
    ),
    # IPC numbers applied to BNS sections
    (
        r"\bIPC[\s\-]*(?:Section\s+)?318\b",
        "Section 318 belongs to BNS 2023 (cheating), not IPC. "
        "The IPC equivalent is Section 420. "
        "Correct citation: Section 318(4) BNS 2023."
    ),
    (
        r"\bIPC[\s\-]*(?:Section\s+)?303\b",
        "Section 303 belongs to BNS 2023 (theft), not IPC. "
        "The IPC equivalent is Section 379. "
        "Correct citation: Section 303 BNS 2023."
    ),
    # Regular bail: CrPC 437 -> BNSS 483
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?437\b",
        "Regular bail under BNSS 2023 is Section 483, not Section 437. "
        "Section 437 belongs to legacy CrPC 1973. "
        "Correct citation: Section 483 BNSS 2023."
    ),
    # Sessions bail: CrPC 439 -> BNSS 484
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?439\b",
        "Sessions Court bail under BNSS 2023 is Section 484, not Section 439. "
        "Section 439 belongs to legacy CrPC 1973. "
        "Correct citation: Section 484 BNSS 2023."
    ),
    # Habeas corpus is a constitutional writ (Article 32/226), not a BNSS section
    (
        r"\bBNSS[\s\-]*(?:Section\s+)?491\b",
        "Habeas corpus is a Constitutional Writ under Article 226 (High Court) or Article 32 (Supreme Court). "
        "BNSS Section 491 (if cited) belongs to legacy CrPC — the Constitutional writ is the correct remedy. "
        "Correct citation: Article 226 Constitution of India."
    ),
]

# Pre-compile for performance
KNOWN_MISATTRIBUTIONS: List[Tuple[re.Pattern, str]] = [
    (re.compile(pat, re.IGNORECASE), explanation)
    for pat, explanation in _RAW_MISATTRIBUTIONS
]


# ─────────────────────────────────────────────────────────────────────────────
# OVERREACH / ABSOLUTE LANGUAGE — almost never legally accurate
# ─────────────────────────────────────────────────────────────────────────────
OVERREACH_PHRASES: List[str] = [
    "controlling precedent",
    "automatically illegal",
    "automatically entitled",
    "automatically granted",
    "automatically void",
    "mandatory in every case",
    "always entitled to bail",
    "must always grant bail",
    "per se illegal",
    "ipso facto illegal",
    "irrespective of facts",
    "in all cases",
    "universally applicable",
    "arrest is always illegal",
    "bail must be granted",
]


# ─────────────────────────────────────────────────────────────────────────────
# STOP WORDS for case-name fuzzy matching
# ─────────────────────────────────────────────────────────────────────────────
_CASE_STOPWORDS = frozenset({
    "state", "india", "union", "versus", "other", "others", "anr", "ors",
    "through", "secretary", "ministry", "government", "govt", "court",
    "high", "supreme", "bench", "chief", "justice", "another", "uoi",
    "commissioner", "collector", "district", "deputy",
})

# Pattern to extract "X v. Y" style case names
_CASE_PATTERN = re.compile(
    r'\b([A-Z][A-Za-z &\.\-\']{2,55}?)'
    r'\s+(?:v(?:s)?\.?|versus)\s+'
    r'([A-Z][A-Za-z &\.\-\']{2,55})\b'
)


class LegalAccuracyValidator:
    """
    Validates a generated legal answer against the retrieved context.

    Usage in rag_engine.py:
        validator = LegalAccuracyValidator()
        answer, warnings = validator.validate_answer(
            answer_text, statute_chunks, case_chunks, question
        )
    """

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _extract_cited_cases(self, text: str) -> List[str]:
        """Extract all 'X v. Y' case name mentions from generated text."""
        seen: set = set()
        result: List[str] = []
        for a, b in _CASE_PATTERN.findall(text):
            a, b = a.strip().rstrip(". ,"), b.strip().rstrip(". ,")
            if len(a) < 4 or len(b) < 4:
                continue
            canonical = f"{a} v. {b}"
            if canonical not in seen:
                seen.add(canonical)
                result.append(canonical)
        return result

    def _key_words(self, name: str) -> List[str]:
        """Meaningful keywords from a case name for fuzzy matching."""
        tokens = re.split(r'[\s\.,&\-\']+', name.lower())
        return [t for t in tokens if len(t) > 3 and t not in _CASE_STOPWORDS]

    def _case_confirmed_in_retrieved(
        self,
        case_name: str,
        case_chunks: List[Dict[str, Any]],
    ) -> bool:
        """
        Fuzzy-check if a cited case name appears in retrieved case-law chunks.
        Returns True if 2+ meaningful keywords match any chunk's case_name + text.
        """
        kws = self._key_words(case_name)
        if not kws:
            return True  # Too ambiguous to validate — benefit of doubt

        for chunk in case_chunks:
            chunk_case = (chunk.get("case_name", "") or "").lower()
            chunk_text = (chunk.get("text", "") or "").lower()[:600]
            haystack = chunk_case + " " + chunk_text
            hits = sum(1 for kw in kws[:4] if kw in haystack)
            if hits >= min(2, len(kws)):
                return True
        return False

    # ── Validation steps ──────────────────────────────────────────────────────

    def _check_misattributions(self, answer: str) -> List[str]:
        issues: List[str] = []
        for pattern, explanation in KNOWN_MISATTRIBUTIONS:
            if pattern.search(answer):
                issues.append(f"Possible misattribution — {explanation}")
        return issues

    def _check_overreach(self, answer: str) -> List[str]:
        lower = answer.lower()
        return [
            f'Absolute language used: "{phrase}" — verify this is supported by a cited authority.'
            for phrase in OVERREACH_PHRASES
            if phrase in lower
        ]

    def _check_case_citations(
        self,
        answer: str,
        case_chunks: List[Dict[str, Any]],
    ) -> List[str]:
        cited = self._extract_cited_cases(answer)
        unverified = [
            c for c in cited
            if not self._case_confirmed_in_retrieved(c, case_chunks)
        ]
        if not unverified:
            return []
        names = "; ".join(unverified[:3])
        return [
            f"Citation advisory: The following case(s) were cited but could not be "
            f"confirmed against retrieved authorities — {names}. "
            f"Verify independently with primary sources before reliance."
        ]

    # ── Public API ────────────────────────────────────────────────────────────

    def validate_answer(
        self,
        answer: str,
        statute_chunks: List[Dict[str, Any]],
        case_chunks: List[Dict[str, Any]],
        question: str = "",
    ) -> Tuple[str, List[str]]:
        """
        Validate a generated legal answer against retrieved context.

        Returns:
            (validated_answer, warnings_list)
            If no issues, answer is returned unchanged.
            If issues found, an advisory footnote is appended.
        """
        warnings: List[str] = []
        warnings.extend(self._check_misattributions(answer))
        warnings.extend(self._check_overreach(answer))
        warnings.extend(self._check_case_citations(answer, case_chunks))

        if warnings:
            lines = [
                "\n\n---",
                "> \u26a0\ufe0f **DhaaraAI Accuracy Advisory** "
                "*(auto-generated by citation validator)*",
            ]
            for w in warnings:
                lines.append(f"> - {w}")
            lines.append(
                "> \n> *Verify flagged citations with a practising advocate or primary "
                "statutory source before initiating formal legal proceedings.*"
            )
            answer = answer + "\n".join(lines)

        return answer, warnings

    def get_validation_summary(
        self, warnings: List[str]
    ) -> Dict[str, Any]:
        """Structured summary of validation results (for logging/testing)."""
        return {
            "total_warnings": len(warnings),
            "misattributions": sum(1 for w in warnings if "misattribution" in w.lower()),
            "overreach_language": sum(1 for w in warnings if "absolute language" in w.lower()),
            "unverified_cases": sum(1 for w in warnings if "citation advisory" in w.lower()),
            "clean": len(warnings) == 0,
        }

