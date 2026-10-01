"""
case_law_chunker.py
===================
Legal-document-aware chunking system for Supreme Court of India judgments.
Preserves structural boundaries (headings, numbered paragraphs, legal issues,
findings, reasoning, statutory references, and operative orders) while maintaining
full case metadata on every chunk.
"""

import re
from typing import List, Dict, Any, Optional
from case_law_pipeline import CaseLawRecord

# Token approximation: 1 token ~ 4 characters in English legal texts
MIN_CHUNK_TOKENS = 600
TARGET_CHUNK_TOKENS = 950
MAX_CHUNK_TOKENS = 1250

MIN_CHARS = MIN_CHUNK_TOKENS * 4    # ~2400 chars
TARGET_CHARS = TARGET_CHUNK_TOKENS * 4  # ~3800 chars
MAX_CHARS = MAX_CHUNK_TOKENS * 4    # ~5000 chars
OVERLAP_CHARS = 120 * 4             # ~480 chars (~120 tokens)


def detect_structural_section(text_block: str) -> str:
    """Detects whether a paragraph block is a Headnote, Issue, Argument, Analysis, or Final Order."""
    sample = text_block[:300].lower()
    if any(k in sample for k in ["appeal allowed", "appeal dismissed", "petition disposed", "bail is granted", "operative order", "order accordingly", "in the result"]):
        return "Final Order / Decision"
    if any(k in sample for k in ["we are of the opinion", "we hold", "it is settled law", "ratio decidendi", "findings", "reasoning", "having considered the rival submissions"]):
        return "Judicial Findings & Analysis"
    if any(k in sample for k in ["learned counsel for the appellant", "submitted that", "contended that", "learned senior advocate", "solicitor general"]):
        return "Arguments of Counsel"
    if any(k in sample for k in ["question of law", "the points for consideration", "issues arising", "charge against the accused"]):
        return "Legal Issues & Facts"
    if any(k in sample for k in ["held:", "headnote", "constitution of india, art.", "indian penal code, s."]):
        return "Headnote / Law Points"
    return "Substantive Discussion"


class CaseLawChunker:
    """
    Intelligent Chunking Engine for Supreme Court judgments.
    Splits text by structural paragraph units without truncating sentences or statutory citations,
    and applies overlap to maintain procedural continuity.
    """

    def __init__(
        self,
        target_chars: int = TARGET_CHARS,
        max_chars: int = MAX_CHARS,
        overlap_chars: int = OVERLAP_CHARS,
        max_chunks_per_case: Optional[int] = 5,
    ):
        self.target_chars = target_chars
        self.max_chars = max_chars
        self.overlap_chars = overlap_chars
        self.max_chunks_per_case = max_chunks_per_case

    def split_into_semantic_blocks(self, text: str) -> List[str]:
        """
        Splits text into cohesive blocks (paragraphs, numbered clauses, or major headings).
        """
        # Split on double newlines or numbered legal paragraph markers (e.g., "\n1. ", "\n(2) ")
        raw_paras = re.split(r"\n\s*\n+|(?<=\n)(?=\d{1,3}\.\s+[A-Z])", text)
        blocks = []
        for p in raw_paras:
            clean_p = p.strip()
            if not clean_p:
                continue
            # If a single paragraph is excessively long (> MAX_CHARS), split by sentences
            if len(clean_p) > self.max_chars:
                sentences = re.split(r"(?<=[.\?!;])\s+(?=[A-Z0-9])", clean_p)
                accum = ""
                for s in sentences:
                    if len(accum) + len(s) + 1 <= self.target_chars:
                        accum = f"{accum} {s}".strip()
                    else:
                        if accum:
                            blocks.append(accum)
                        accum = s
                if accum:
                    blocks.append(accum)
            else:
                blocks.append(clean_p)
        return blocks

    def chunk_case(self, record: CaseLawRecord) -> List[Dict[str, Any]]:
        """
        Transforms a CaseLawRecord into an ordered sequence of indexed chunks,
        each retaining complete case metadata.
        """
        text = record.cleaned_text or record.full_text
        if not text:
            return []

        blocks = self.split_into_semantic_blocks(text)
        if not blocks:
            return []

        raw_chunks = []
        current_chunk_blocks = []
        current_len = 0

        for block in blocks:
            block_len = len(block)
            if current_len + block_len + 2 <= self.max_chars:
                current_chunk_blocks.append(block)
                current_len += block_len + 2
            else:
                # Flush current chunk
                if current_chunk_blocks:
                    chunk_text = "\n\n".join(current_chunk_blocks)
                    raw_chunks.append(chunk_text)

                    # Compute overlap from trailing blocks
                    overlap_blocks = []
                    overlap_len = 0
                    for prev_b in reversed(current_chunk_blocks):
                        if overlap_len + len(prev_b) <= self.overlap_chars:
                            overlap_blocks.insert(0, prev_b)
                            overlap_len += len(prev_b)
                        else:
                            break

                    current_chunk_blocks = overlap_blocks + [block]
                    current_len = sum(len(b) for b in current_chunk_blocks) + (len(current_chunk_blocks) * 2)
                else:
                    raw_chunks.append(block)
                    current_chunk_blocks = []
                    current_len = 0

        if current_chunk_blocks:
            chunk_text = "\n\n".join(current_chunk_blocks)
            raw_chunks.append(chunk_text)

        # If a long judgment exceeds max_chunks_per_case, select the most legally salient chunks
        if self.max_chunks_per_case and len(raw_chunks) > self.max_chunks_per_case:
            selected_chunks = []
            # 1. Opening Headnote & Legal Issues (first 1-2 chunks)
            selected_chunks.append(raw_chunks[0])
            if self.max_chunks_per_case > 2:
                selected_chunks.append(raw_chunks[1])

            # 2. Middle substantive analysis chunks (highest legal term density)
            middle_pool = raw_chunks[2:-1] if len(raw_chunks) > 3 else []
            if middle_pool:
                def legal_score(txt):
                    lower = txt.lower()
                    score = 0
                    for term in ["held", "ratio", "we are of the opinion", "section", "article", "settled", "constitution", "precedent", "order"]:
                        score += lower.count(term)
                    return score

                middle_pool_sorted = sorted(middle_pool, key=legal_score, reverse=True)
                needed_middle = max(1, self.max_chunks_per_case - len(selected_chunks) - 1)
                selected_chunks.extend(middle_pool_sorted[:needed_middle])

            # 3. Final Decision / Operative Order (last chunk)
            if len(raw_chunks) > 1 and raw_chunks[-1] not in selected_chunks:
                selected_chunks.append(raw_chunks[-1])

            raw_chunks = selected_chunks

        total_chunks = len(raw_chunks)
        indexed_chunks = []

        # Convert list fields to metadata-friendly strings
        acts_str = ", ".join(record.acts[:8])
        sections_str = ", ".join(record.sections[:12])
        articles_str = ", ".join(record.articles[:10])
        keywords_str = ", ".join(record.keywords[:10])

        for idx, chunk_text in enumerate(raw_chunks, 1):
            struct_type = detect_structural_section(chunk_text)
            clean_case_id = re.sub(r"[^0-9a-zA-Z_]", "", record.case_id)
            chunk_id = f"sc_{clean_case_id}_c{idx}"

            # Prepend concise header to chunk for semantic anchoring during embedding
            header_prefix = (
                f"Supreme Court of India | {record.case_name} | {record.citation} | "
                f"Date: {record.judgment_date} | Section Focus: {struct_type}\n\n"
            )
            enriched_text = header_prefix + chunk_text

            chunk_meta = {
                "chunk_id": chunk_id,
                "case_id": record.case_id,
                "case_name": record.case_name,
                "court": record.court,
                "judgment_date": record.judgment_date,
                "year": int(record.year),
                "bench": record.judges,
                "citation": record.citation,
                "case_type": record.case_type,
                "source": record.source,
                "source_url": record.source_url,
                "acts": acts_str,
                "sections": sections_str,
                "articles": articles_str,
                "keywords": keywords_str,
                "landmark_category": record.landmark_category or "General",
                "ratio_summary": record.ratio_summary[:300],
                "structural_section": struct_type,
                "chunk_index": idx,
                "total_chunks": total_chunks,
                "token_count": len(enriched_text.split()),
                "source_type": "case_law",
            }

            indexed_chunks.append({
                "chunk_id": chunk_id,
                "text": enriched_text,
                "metadata": chunk_meta,
            })

        return indexed_chunks
