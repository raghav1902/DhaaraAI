"""
legal_glossary.py
=================
Comprehensive Indian Legal Glossary for DhaaraAI (Phase 2).
Provides high-utility Indian legal terms spanning 14 legal domains:
Criminal Law, Court Procedure, Bail, Civil Law, Constitutional Law,
Contract Law, Property Law, Family Law, Evidence, Consumer Law,
Cyber Law, Appeals & Revision, Limitation, and General Legal Terminology.
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "legal_glossary.json"

def _load_glossary_terms() -> List[Dict[str, Any]]:
    if _DATA_PATH.exists():
        try:
            with open(_DATA_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[legal_glossary] Failed to load glossary JSON from {_DATA_PATH}: {e}")
    return []

GLOSSARY_TERMS: List[Dict[str, Any]] = _load_glossary_terms()

# Cached unique categories
CATEGORIES: List[str] = sorted(list({t.get("category", "") for t in GLOSSARY_TERMS if t.get("category")}))

GLOSSARY_BY_ID: Dict[str, Dict[str, Any]] = {t["id"]: t for t in GLOSSARY_TERMS if "id" in t}


def get_all_terms() -> List[Dict[str, Any]]:
    """Returns all verified legal glossary terms."""
    return GLOSSARY_TERMS


def get_categories() -> List[str]:
    """Returns list of distinct legal categories."""
    return CATEGORIES


def get_term_by_id(term_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a glossary term by its identifier."""
    if not term_id:
        return None
    tid = str(term_id).strip().lower()
    if tid in GLOSSARY_BY_ID:
        return GLOSSARY_BY_ID[tid]
    for t in GLOSSARY_TERMS:
        if t.get("id", "").lower() == tid or t.get("term", "").lower() == tid:
            return t
    return None


def search_glossary(
    query: str,
    category: Optional[str] = None,
    limit: int = 15
) -> List[Dict[str, Any]]:
    """
    Search glossary terms across English terms, Hindi terms, aliases,
    and explanations.
    """
    query_norm = query.lower().strip()
    if not query_norm:
        if not category:
            return GLOSSARY_TERMS[:limit]
        filtered = [t for t in GLOSSARY_TERMS if t.get("category", "").lower() == category.lower()]
        return filtered[:limit]

    results = []
    for entry in GLOSSARY_TERMS:
        if category and entry.get("category", "").lower() != category.lower():
            continue

        score = 0
        term_en = entry["term"].lower()
        term_hi = entry.get("hindi_term", "").lower()
        aliases = [a.lower() for a in entry.get("aliases_synonyms", [])]
        en_exp = entry.get("simple_en_explanation", "").lower()
        hi_exp = entry.get("simple_hi_explanation", "").lower()
        acts = " ".join(entry.get("related_acts", [])).lower()
        sections = " ".join(entry.get("related_sections", [])).lower()

        if query_norm == entry["id"] or query_norm == term_en:
            score += 100
        elif term_en.startswith(query_norm):
            score += 50
        elif query_norm in term_en:
            score += 30
        elif query_norm in term_hi:
            score += 40
        elif any(query_norm == a for a in aliases):
            score += 45
        elif any(query_norm in a for a in aliases):
            score += 25
        elif query_norm in sections:
            score += 20
        elif query_norm in acts:
            score += 15
        elif query_norm in en_exp or query_norm in hi_exp:
            score += 10

        if score > 0:
            results.append((score, entry))

    results.sort(key=lambda x: x[0], reverse=True)
    return [r[1] for r in results[:limit]]


def find_glossary_match_for_query(query: str) -> Optional[Dict[str, Any]]:
    """
    High-precision matcher for conversational Ask AI:
    Detects if query asks 'what is caveat', 'define bail', 'meaning of cognizance', etc.
    """
    q = query.lower().strip()
    cleaned = re.sub(r'^(what is|what does|define|meaning of|explain|tell me about|samjhao|kya hai|kya hota hai)\s+', '', q)
    cleaned = re.sub(r'\s+(mean|means|kya hai|kya hota hai|samjhao)\??$', '', cleaned).strip('? .!')

    candidates = search_glossary(cleaned, limit=3)
    if candidates:
        first = candidates[0]
        first_term = first["term"].lower()
        aliases = [a.lower() for a in first.get("aliases_synonyms", [])]
        if cleaned in first_term or any(cleaned in a for a in aliases) or first["id"] in cleaned:
            return first
    return None
