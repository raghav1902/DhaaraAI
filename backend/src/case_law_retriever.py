"""
case_law_retriever.py
=====================
High-Precision Legal Retrieval & Hybrid Reranking Service for Supreme Court Case Law.
Combines dense semantic vector retrieval (ChromaDB), statutory entity matching,
precedent boosting, and metadata filtering.
"""

import re
from typing import List, Dict, Any, Optional
from embed_store import LegalEmbedStore
from case_law_landmarks import (
    LANDMARK_JUDGMENTS_REGISTRY,
    STATUTE_TO_PRECEDENT_MAP,
    get_precedents_for_statute,
)


class CaseLawRetriever:
    """
    Dedicated Case Law Retrieval Service with hybrid scoring and legal entity boosting.
    """

    def __init__(self, embed_store: Optional[LegalEmbedStore] = None):
        self.embed_store = embed_store or LegalEmbedStore()

    def _extract_query_entities(self, query: str) -> Dict[str, Any]:
        """Extracts legal concepts, sections, articles, and acts from user prompt (bilingual English/Hindi/Hinglish)."""
        q_lower = query.lower()

        # Extract sections e.g. "Section 138", "Dhara 420", "धारा 318", "498A", "Sec 438"
        sections = re.findall(r"\b(?:section|sec\.?|dhara|dhaara|धारा|दफा)\s*(\d+[a-z]?(?:\(\d+\))?)", q_lower)
        # Also detect prominent bare section numbers with strong legal context
        bare_sec_matches = re.findall(r"\b(138|498a|420|302|376|438|482|173|35|65b|63|318)\b", q_lower)
        for s in bare_sec_matches:
            if s not in sections:
                sections.append(s)

        # Extract articles e.g. "Article 21", "Art. 14", "अनुच्छेद 21"
        articles = re.findall(r"\b(?:article|art\.?|अनुच्छेद)\s*(\d+[a-z]?)", q_lower)

        # Detect specific high-profile case names
        case_names = []
        for known_name in [
            "puttaswamy", "arnesh kumar", "lalita kumari", "chiranjit lal", "shreya singhal",
            "bir singh", "dashrath", "antil", "sushila aggarwal", "arjun panditrao", "satyabrata",
            "dk basu", "d.k. basu", "rajnesh", "rajesh sharma", "maneka gandhi", "kesavananda",
            "ravinder kaur", "suraj lamp", "mk gupta", "m.k. gupta", "vesa holdings"
        ]:
            if known_name in q_lower:
                case_names.append(known_name)

        return {
            "sections": sections,
            "articles": articles,
            "case_names": case_names,
            "is_bail_query": any(k in q_lower for k in [
                "bail", "anticipatory", "arrest", "custody", "zamanat", "जमानत", "गिरफ्तारी",
                "girftari", "police pakad", "remand", "hiraasat", "warrant", "bina warrant", "custodial"
            ]),
            "is_cheque_query": any(k in q_lower for k in [
                "cheque", "check", "bounce", "dishonour", "138", "negotiable", "चेक", "बाउंस", "अनादर", "stop payment"
            ]),
            "is_privacy_query": any(k in q_lower for k in [
                "privacy", "puttaswamy", "article 21", "निजता", "surveillance", "data protection"
            ]),
            "is_evidence_query": any(k in q_lower for k in [
                "evidence", "electronic evidence", "65b", "cctv", "whatsapp", "call recording", "saboot", "gawahi", "सबूत", "गवाही", "digital signature"
            ]),
            "is_cyber_query": any(k in q_lower for k in [
                "cyber", "it act", "information technology", "hacking", "otp", "phishing", "online fraud", "cyber crime", "साइबर", "fake profile"
            ]),
            "is_contract_query": any(k in q_lower for k in [
                "contract", "breach", "frustration", "damages", "agreement", "samjhauta", "समझौता", "agreement to sell"
            ]),
            "is_consumer_query": any(k in q_lower for k in [
                "consumer", "deficiency", "refund", "unfair trade", "grahak", "graahak", "उपभोक्ता", "ग्राहक", "खराब सामान", "warranty", "guarantee"
            ]),
            "is_matrimonial_query": any(k in q_lower for k in [
                "talaq", "divorce", "maintenance", "kharcha", "498a", "cruelty", "dahej", "dowry", "patni", "husband", "gharelu hinsa", "domestic violence", "तलाक", "दहेज", "घरेलू हिंसा", "alimony", "affidavit of assets"
            ]),
            "is_property_query": any(k in q_lower for k in [
                "property", "land", "plot", "zameen", "kabza", "tenant", "eviction", "landlord", "kirayedaar", "मकान मालिक", "किरायेदार", "कब्जा", "जमीन", "registry", "mutation", "patta", "adverse possession", "trespass"
            ]),
            "is_fraud_query": any(k in q_lower for k in [
                "fraud", "dhokhadhadi", "dhokha", "धोखाधड़ी", "420", "318", "scam", "paise le liye", "money stolen", "chhal", "thagi", "ठगी", "cheating"
            ]),
            "is_fir_query": any(k in q_lower for k in [
                "fir", "zero fir", "police complaint", "thana", "daroga", "refuse fir", "cognizable", "थाना", "प्रथम सूचना रिपोर्ट"
            ])
        }

    def _calculate_hybrid_score(self, chunk: Dict[str, Any], query: str, entities: Dict[str, Any]) -> float:
        """
        Calculates hybrid relevance score combining:
        - Vector semantic similarity (base)
        - Section/Article exact match boost
        - Case Name match boost
        - Topic relevance boost
        """
        base_sim = chunk.get("similarity_score", 0.0)
        boost = 0.0

        chunk_text = (chunk.get("text", "") + " " + chunk.get("ratio_summary", "")).lower()
        chunk_sections = chunk.get("sections", "").lower()
        chunk_articles = chunk.get("articles", "").lower()
        chunk_name = chunk.get("case_name", "").lower()

        # 1. Section match boost (+0.20)
        for sec in entities["sections"]:
            if sec in chunk_sections or f"section {sec}" in chunk_text:
                boost += 0.20
                break

        # 2. Article match boost (+0.20)
        for art in entities["articles"]:
            if art in chunk_articles or f"article {art}" in chunk_text:
                boost += 0.20
                break

        # 3. Named Landmark Case boost (+0.35)
        for name in entities["case_names"]:
            if name in chunk_name or name in chunk_text:
                boost += 0.35
                break

        # 4. Domain Topic alignment boosts (+0.15)
        if entities.get("is_bail_query") and any(k in chunk_text for k in ["bail", "anticipatory", "arrest", "custody"]):
            boost += 0.15
        elif entities.get("is_cheque_query") and any(k in chunk_text for k in ["cheque", "138", "negotiable", "dishonour"]):
            boost += 0.15
        elif entities.get("is_privacy_query") and any(k in chunk_text for k in ["privacy", "article 21"]):
            boost += 0.15
        elif entities.get("is_evidence_query") and any(k in chunk_text for k in ["electronic evidence", "65b", "admissibility"]):
            boost += 0.15
        elif entities.get("is_cyber_query") and any(k in chunk_text for k in ["cyber", "information technology"]):
            boost += 0.15
        elif entities.get("is_matrimonial_query") and any(k in chunk_text for k in ["matrimonial", "maintenance", "498a", "cruelty", "marriage", "divorce", "dowry"]):
            boost += 0.15
        elif entities.get("is_property_query") and any(k in chunk_text for k in ["property", "possession", "title", "conveyance", "tenant", "adverse possession"]):
            boost += 0.15
        elif entities.get("is_fraud_query") and any(k in chunk_text for k in ["cheating", "fraud", "420", "318"]):
            boost += 0.15
        elif entities.get("is_consumer_query") and any(k in chunk_text for k in ["consumer", "deficiency", "service"]):
            boost += 0.15
        elif entities.get("is_fir_query") and any(k in chunk_text for k in ["154", "173", "cognizable", "fir"]):
            boost += 0.15

        # Cap combined score at 1.0
        final_score = min(1.0, base_sim + boost)
        return round(final_score, 4)

    def retrieve_cases(
        self,
        query: str,
        top_k: int = 5,
        year_min: Optional[int] = None,
        year_max: Optional[int] = None,
        category_filter: Optional[str] = None,
        act_filter: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Executes hybrid retrieval against the Supreme Court case-law repository.
        """
        entities = self._extract_query_entities(query)

        # 1. Query vector database
        raw_results = self.embed_store.query_case_law(query_text=query, top_k=top_k * 3)

        # 2. Check curated landmark registry for direct matches
        curated_matches = []
        q_lower = query.lower()
        for lm in LANDMARK_JUDGMENTS_REGISTRY:
            lm_text = f"{lm['case_name']} {lm['category']} {lm['articles']} {lm['sections']} {lm['acts']} {lm['key_ratio']}".lower()
            match_score = 0.0

            # Check if any query entity matches landmark record
            if any(n in lm["case_name"].lower() for n in entities["case_names"]):
                match_score = 0.95
            elif any(s in lm["sections"].lower() for s in entities["sections"] if s):
                match_score = 0.88
            elif any(a in lm["articles"].lower() for a in entities["articles"] if a):
                match_score = 0.88
            elif entities.get("is_bail_query") and lm["category"] == "Bail":
                match_score = 0.82
            elif entities.get("is_cheque_query") and lm["category"] == "Cheque Bounce":
                match_score = 0.82
            elif entities.get("is_privacy_query") and "privacy" in lm_text:
                match_score = 0.90
            elif entities.get("is_evidence_query") and lm["category"] == "Evidence":
                match_score = 0.82
            elif entities.get("is_cyber_query") and lm["category"] == "Cyber Law":
                match_score = 0.82
            elif entities.get("is_consumer_query") and lm["category"] == "Consumer Law":
                match_score = 0.84
            elif entities.get("is_matrimonial_query") and lm["category"] == "Matrimonial / Family Law":
                match_score = 0.84
            elif entities.get("is_property_query") and lm["category"] == "Property Law":
                match_score = 0.84
            elif entities.get("is_contract_query") and lm["category"] == "Contract Law":
                match_score = 0.82
            elif entities.get("is_fir_query") and ("173" in lm["sections"] or "154" in lm["sections"] or "fir" in lm_text):
                match_score = 0.88
            elif entities.get("is_fraud_query") and ("318" in lm["sections"] or "420" in lm["sections"] or "cheating" in lm_text):
                match_score = 0.84

            if match_score > 0.0:
                curated_matches.append({
                    "chunk_id": f"curated_{lm['cnr']}",
                    "text": f"Supreme Court of India | {lm['case_name']} | {lm['citation']}\n\nKey Holding / Ratio Decidendi:\n{lm['key_ratio']}",
                    "case_id": lm["cnr"],
                    "case_name": lm["case_name"],
                    "court": lm["court"],
                    "judgment_date": lm["judgment_date"],
                    "year": int(lm["judgment_date"].split("-")[-1]) if "-" in lm["judgment_date"] else int(lm["judgment_date"]) if lm["judgment_date"].isdigit() else 2020,
                    "bench": lm["bench"],
                    "citation": lm["citation"],
                    "case_type": "Landmark Supreme Court Precedent",
                    "source": "Supreme Court Reports (Curated Landmark)",
                    "source_url": lm["source_url"],
                    "acts": lm["acts"],
                    "sections": lm["sections"],
                    "articles": lm["articles"],
                    "keywords": lm["category"],
                    "landmark_category": lm["category"],
                    "ratio_summary": lm["key_ratio"],
                    "structural_section": "Landmark Ratio Decidendi",
                    "similarity_score": match_score,
                    "source_type": "case_law"
                })

        # 3. Combine and deduplicate by case_id / case_name
        combined_pool = curated_matches + raw_results
        seen_cases = set()
        deduped = []

        for item in combined_pool:
            identifier = item.get("case_id") or item.get("case_name")
            if identifier in seen_cases:
                continue
            seen_cases.add(identifier)

            # Metadata Filters
            yr = item.get("year", 1950)
            if year_min and yr < year_min:
                continue
            if year_max and yr > year_max:
                continue
            if category_filter and category_filter.lower() != "all":
                if category_filter.lower() not in item.get("landmark_category", "").lower():
                    continue
            if act_filter:
                if act_filter.lower() not in item.get("acts", "").lower():
                    continue

            # Compute hybrid score
            item["hybrid_score"] = self._calculate_hybrid_score(item, query, entities)
            deduped.append(item)

        # 4. Rank by hybrid score descending
        deduped.sort(key=lambda x: x.get("hybrid_score", 0.0), reverse=True)
        top_results = deduped[:top_k]

        # 5. Extract clean relevant passage for citations
        for item in top_results:
            raw_text = item.get("text", "")
            # Remove header prefix
            body = re.sub(r"^Supreme Court of India.*?\n\n", "", raw_text, flags=re.DOTALL)
            item["relevant_passage"] = item.get("ratio_summary") or body[:350].strip() + "..."

        return top_results
