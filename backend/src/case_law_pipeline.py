"""
case_law_pipeline.py
====================
Production-grade Supreme Court of India Case-Law Normalization, Cleaning,
Deduplication, and Ingestion Pipeline for DhaaraAI.
"""

import os
import re
import json
import hashlib
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import List, Dict, Any, Optional, Iterator, Tuple
import pyarrow.parquet as pq

# Canonical Court Name
COURT_NAME = "Supreme Court of India"
DEFAULT_SOURCE = "Supreme Court Reports (eSCR)"
DEFAULT_SOURCE_URL_BASE = "https://digiscr.sci.gov.in/"

# Known Central Acts to extract
KNOWN_ACTS_PATTERNS = [
    ("Constitution of India", r"\b(?:Constitution\s+of\s+India|Constitution)\b"),
    ("Indian Penal Code", r"\b(?:Indian\s+Penal\s+Code|I\.?P\.?C\.?)\b"),
    ("Code of Criminal Procedure", r"\b(?:Code\s+of\s+Criminal\s+Procedure|Cr\.?P\.?C\.?)\b"),
    ("Indian Evidence Act", r"\b(?:Indian\s+Evidence\s+Act|Evidence\s+Act)\b"),
    ("Bharatiya Nyaya Sanhita", r"\b(?:Bharatiya\s+Nyaya\s+Sanhita|BNS\s*2023|BNS)\b"),
    ("Bharatiya Nagarik Suraksha Sanhita", r"\b(?:Bharatiya\s+Nagarik\s+Suraksha\s+Sanhita|BNSS\s*2023|BNSS)\b"),
    ("Bharatiya Sakshya Adhiniyam", r"\b(?:Bharatiya\s+Sakshya\s+Adhiniyam|BSA\s*2023|BSA)\b"),
    ("Negotiable Instruments Act", r"\b(?:Negotiable\s+Instruments\s+Act|N\.?I\.?\s*Act)\b"),
    ("Information Technology Act", r"\b(?:Information\s+Technology\s+Act|I\.?T\.?\s*Act)\b"),
    ("Consumer Protection Act", r"\b(?:Consumer\s+Protection\s+Act)\b"),
    ("Indian Contract Act", r"\b(?:Indian\s+Contract\s+Act|Contract\s+Act)\b"),
    ("Specific Relief Act", r"\b(?:Specific\s+Relief\s+Act)\b"),
    ("Arbitration and Conciliation Act", r"\b(?:Arbitration\s+and\s+Conciliation\s+Act)\b"),
    ("Motor Vehicles Act", r"\b(?:Motor\s+Vehicles\s+Act|M\.?V\.?\s*Act)\b"),
    ("Transfer of Property Act", r"\b(?:Transfer\s+of\s+Property\s+Act|T\.?P\.?\s*Act)\b"),
    ("Prevention of Corruption Act", r"\b(?:Prevention\s+of\s+Corruption\s+Act|P\.?C\.?\s*Act)\b"),
    ("Protection of Children from Sexual Offences Act", r"\b(?:POCSO|Protection\s+of\s+Children\s+from\s+Sexual\s+Offences)\b"),
    ("Limitation Act", r"\b(?:Limitation\s+Act)\b"),
    ("Companies Act", r"\b(?:Companies\s+Act)\b"),
    ("Insolvency and Bankruptcy Code", r"\b(?:Insolvency\s+and\s+Bankruptcy\s+Code|IBC)\b"),
]

# Major Landmark / Legal Issue Taxonomy
LANDMARK_CATEGORY_RULES = [
    ("Bail", [r"\banticipatory\s+bail\b", r"\bsection\s+438\b", r"\bsection\s+482\s+bnss\b", r"\bregular\s+bail\b", r"\bsection\s+437\b", r"\bsection\s+439\b", r"\bbail\s+is\s+the\s+rule\b"]),
    ("Cheque Bounce", [r"\bsection\s+138\b", r"\bcheque\s+bounce\b", r"\bdishonou?r\s+of\s+cheque\b", r"\bnegotiable\s+instruments\b", r"\bsection\s+139\b"]),
    ("Evidence", [r"\bsection\s+65b\b", r"\belectronic\s+evidence\b", r"\belectronic\s+records?\b", r"\bbharatiya\s+sakshya\b", r"\bd\.?k\.?\s*basu\b", r"\bcertificate\s+under\s+section\s+65b\b"]),
    ("Cyber Law", [r"\binformation\s+technology\s+act\b", r"\bsection\s+66[a-d]?\b", r"\bcyber\s*crime\b", r"\bidentity\s+theft\b", r"\bhacking\b", r"\bshreya\s+singhal\b"]),
    ("Constitutional Law", [r"\barticle\s+21\b", r"\barticle\s+14\b", r"\barticle\s+19\b", r"\barticle\s+32\b", r"\barticle\s+226\b", r"\bbasic\s+structure\b", r"\bconstitutional\s+bench\b"]),
    ("Fundamental Rights", [r"\bright\s+to\s+privacy\b", r"\bputtaswamy\b", r"\bfundamental\s+rights?\b", r"\bpart\s+iii\b", r"\bfreedom\s+of\s+speech\b"]),
    ("Criminal Law", [r"\bsection\s+302\b", r"\bsection\s+304a\b", r"\bmurder\b", r"\bculpable\s+homicide\b", r"\bbns\s+section\s+106\b", r"\bcheating\s+and\s+dishonestly\b", r"\bsection\s+420\b"]),
    ("Matrimonial / Family Law", [r"\bsection\s+498a\b", r"\bcruelty\s+by\s+husband\b", r"\bmaintenance\b", r"\bsection\s+125\b", r"\bdomestic\s+violence\b", r"\bdivorce\b", r"\bdowry\b"]),
    ("Consumer Law", [r"\bconsumer\s+protection\b", r"\bdeficiency\s+in\s+service\b", r"\bunfair\s+trade\s+practice\b", r"\bdistrict\s+consumer\s+forum\b", r"\bncdrc\b"]),
    ("Contract Law", [r"\bbreach\s+of\s+contract\b", r"\bspecific\s+performance\b", r"\bsection\s+73\b", r"\bfrustration\s+of\s+contract\b", r"\bsection\s+56\b", r"\bliquidated\s+damages\b"]),
    ("Property Law", [r"\badverse\s+possession\b", r"\bsale\s+deed\b", r"\bevict(?:ion|ed)\b", r"\bland\s+acquisition\b", r"\bpartition\s+suit\b"]),
    ("Administrative Law", [r"\bnatural\s+justice\b", r"\baudi\s+alteram\s+partem\b", r"\bwrit\s+of\s+mandamus\b", r"\bwrit\s+of\s+certiorari\b", r"\barbitrary\s+action\b"]),
]


@dataclass
class CaseLawRecord:
    case_id: str
    case_name: str
    court: str = COURT_NAME
    judgment_date: str = ""
    year: int = 1950
    judges: str = ""
    citation: str = ""
    case_type: str = "Supreme Court Judgment"
    full_text: str = ""
    cleaned_text: str = ""
    source: str = DEFAULT_SOURCE
    source_url: str = DEFAULT_SOURCE_URL_BASE
    acts: List[str] = field(default_factory=list)
    sections: List[str] = field(default_factory=list)
    articles: List[str] = field(default_factory=list)
    keywords: List[str] = field(default_factory=list)
    landmark_category: Optional[str] = None
    ratio_summary: str = ""
    disposal_nature: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def clean_judgment_text(text: str) -> str:
    """
    Cleans raw judgment text by:
    1. Removing the multilingual disclaimer preamble found in eSCR files.
    2. Removing recurring page running heads (e.g. S.C.R. SUPREME COURT REPORTS).
    3. Stripping metadata footers (Decision Date, Case No, Flip view PDF).
    4. Normalizing whitespace, hyphens, and OCR line breaks.
    """
    if not text:
        return ""

    # 1. Strip multilingual disclaimer banner at the beginning
    cleaned = re.sub(
        r"^.*?(?:Neither the Courts concerned nor the National Informatics Centre.*?carrying out the corrections\.\s*)",
        "",
        text,
        flags=re.DOTALL | re.IGNORECASE,
    )

    # 2. Strip trailing metadata footer line (Decision Date : ... | Flip view PDF)
    cleaned = re.sub(
        r"Decision Date\s*:\s*[\d\-]+\s*\|\s*Case No\s*:\s*[^\|]+\|\s*Disposal Nature\s*:\s*[^\|]+\|\s*Bench\s*:\s*[^\|]+(?:Flip view PDF)?",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    # 3. Strip recurring SCR running headers and footers
    cleaned = re.sub(r"(?:\[?\d{4}\]?\s*\d*\s*)?S\.?C\.?R\.?\s*SUPREME COURT REPORTS\s*\d*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b\d+\s+S\.?C\.?R\.?\s+\d+\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b(?:Flip view PDF|View PDF|Page \d+ of \d+)\b", "", cleaned, flags=re.IGNORECASE)

    # 4. Normalize hyphenated words broken across lines (e.g. "con-\nstitutional" -> "constitutional")
    cleaned = re.sub(r"(\w+)-\s*\n\s*(\w+)", r"\1\2", cleaned)

    # 5. Collapse excessive whitespace and blank lines
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    cleaned = re.sub(r"\n\s*\n+", "\n\n", cleaned)

    return cleaned.strip()


def extract_acts(text: str) -> List[str]:
    """Extracts known statutory Acts mentioned in the judgment text."""
    found = []
    for act_name, pattern in KNOWN_ACTS_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            found.append(act_name)
    return found


def extract_sections(text: str) -> List[str]:
    """Extracts statutory section references (e.g., Section 138, Sec 438, Section 318(4))."""
    matches = re.findall(
        r"\b(?:Section|Sec\.)\s+(\d+[A-Z]?(?:\(\d+\))?(?:\([a-z]\))?)",
        text,
        re.IGNORECASE,
    )
    # Deduplicate while preserving order and top frequent
    seen = set()
    cleaned = []
    for m in matches:
        sec = f"Section {m}"
        if sec not in seen:
            seen.add(sec)
            cleaned.append(sec)
        if len(cleaned) >= 20:
            break
    return cleaned


def extract_articles(text: str) -> List[str]:
    """Extracts constitutional article references (e.g., Article 21, Art. 14, Article 32)."""
    matches = re.findall(
        r"\b(?:Article|Art\.)\s+(\d+[A-Z]?(?:\(\d+\))?)",
        text,
        re.IGNORECASE,
    )
    seen = set()
    cleaned = []
    for m in matches:
        art = f"Article {m}"
        if art not in seen:
            seen.add(art)
            cleaned.append(art)
        if len(cleaned) >= 15:
            break
    return cleaned


def detect_landmark_category(text: str, title: str) -> Tuple[Optional[str], List[str]]:
    """Identifies primary legal category and keywords for the judgment."""
    combined = f"{title}\n{text}".lower()
    matched_categories = []
    keywords = []

    for cat, rules in LANDMARK_CATEGORY_RULES:
        for rule in rules:
            if re.search(rule, combined):
                if cat not in matched_categories:
                    matched_categories.append(cat)
                kw = rule.replace(r"\b", "").replace(r"\s+", " ").replace("\\", "")
                if kw not in keywords:
                    keywords.append(kw.title())

    primary_category = matched_categories[0] if matched_categories else None
    return primary_category, keywords[:10]


def extract_ratio_summary(text: str, max_chars: int = 400) -> str:
    """Extracts the operative legal finding or holding sentence."""
    # Look for operative phrasing
    patterns = [
        r"(?:We are of the (?:considered )?opinion that|It is well settled that|We hold that|The legal principle that emerges is that|In our considered view|Held:)\s*([^\n\.\;]{40,350}[\.\;])",
        r"(?:The question that arises for consideration is|The question of law before this Court is)\s*([^\n\.\;]{40,300}[\.\;])",
        r"(?:For the reasons stated above|In the result|Consequently,),\s*([^\n\.\;]{40,300}[\.\;])",
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            summary = m.group(0).strip()
            return summary[:max_chars]

    # Fallback to first substantive paragraph after title
    lines = [l.strip() for l in text.split("\n\n") if len(l.strip()) > 80]
    if lines:
        return lines[0][:max_chars]
    return text[:max_chars].strip()


def extract_case_metadata(cnr: str, year: int, raw_text: str) -> CaseLawRecord:
    """
    Parses a raw Parquet record into a normalized CaseLawRecord.
    """
    cleaned_txt = clean_judgment_text(raw_text)

    # 1. Metadata footer values if available
    foot_m = re.search(
        r"Decision Date\s*:\s*([\d\-]+)\s*\|\s*Case No\s*:\s*([^\|]+)\|\s*Disposal Nature\s*:\s*([^\|]+)\|\s*Bench\s*:\s*([^\|]+)",
        raw_text,
        re.IGNORECASE,
    )
    decision_date = foot_m.group(1).strip() if foot_m else ""
    case_no = foot_m.group(2).strip() if foot_m else ""
    disposal = foot_m.group(3).strip() if foot_m else ""
    bench_foot = foot_m.group(4).strip() if foot_m else ""

    # 2. Case Name Extraction
    title = ""
    # Pattern A: NAME versus NAME - [YEAR] ...
    m1 = re.search(
        r"^([A-Z0-9\s\.\,\(\)\'\-]{3,80})\s+(?:versus|v\.|vs\.)\s+([A-Z0-9\s\.\,\(\)\'\-]{3,80})(?:\s*-\s*\[|\s+Coram|\s+\[\d{4}\]|\s*\n)",
        cleaned_txt,
        re.IGNORECASE,
    )
    if m1:
        p1 = re.sub(r"^.*?SUPREME COURT REPORTS\s*\d*\s*", "", m1.group(1), flags=re.IGNORECASE).strip()
        p2 = m1.group(2).strip()
        title = f"{p1} v. {p2}"
    else:
        # Pattern B: NAME v. NAME in first 1500 chars
        m2 = re.search(
            r"([A-Z0-9\s\.\,\(\)\'\-]{3,60})\s+(?:v\.|versus|VS\.)\s+([A-Z0-9\s\.\,\(\)\'\-]{3,60})",
            cleaned_txt[:1500],
        )
        if m2:
            p1 = re.sub(r"^.*?SUPREME COURT REPORTS\s*\d*\s*", "", m2.group(1), flags=re.IGNORECASE).strip()
            title = f"{p1} v. {m2.group(2).strip()}"

    if not title or len(title) < 5:
        title = f"Supreme Court Judgment ({cnr})"

    # Clean title capitalization and punctuation
    title = re.sub(r"\s+", " ", title).strip(" -.,")

    # 3. Citation Extraction
    citation_parts = []
    scr_m = re.search(r"\[?\d{4}\]?\s*\d*\s*S\.?C\.?R\.?\s*\d+", raw_text)
    if scr_m:
        citation_parts.append(scr_m.group(0).strip())
    else:
        # Formulate from CNR e.g. 1950_1_453_459_EN -> [1950] 1 S.C.R. 453
        cnr_tokens = cnr.split("_")
        if len(cnr_tokens) >= 3 and cnr_tokens[0].isdigit() and cnr_tokens[1].isdigit() and cnr_tokens[2].isdigit():
            citation_parts.append(f"[{cnr_tokens[0]}] {cnr_tokens[1]} S.C.R. {cnr_tokens[2]}")
        else:
            citation_parts.append(f"SCR ({year})")

    insc_m = re.search(r"\b\d{4}\s+INSC\s+\d+\b", raw_text)
    if insc_m:
        citation_parts.append(insc_m.group(0).strip())

    citation = " | ".join(citation_parts)

    # 4. Judges / Bench
    judges = bench_foot
    if not judges:
        coram_m = re.search(r"Coram\s*:\s*([A-Z\s\.\,\*]+?)(?=\s*(?:\d+\s+S\.C\.R\.|\n\n|\[\d{4}\]|$))", cleaned_txt)
        if coram_m:
            judges = coram_m.group(1).replace("*", "").strip()
        else:
            bracket_m = re.search(r"\[([A-Z\s\.\,]+(?:JJ?\.|C\.?J\.?|JUSTICE|J\b)[^\]\n]*)\]", cleaned_txt[:1500])
            if bracket_m:
                judges = bracket_m.group(1).strip()

    if not judges:
        judges = "Supreme Court Bench"

    # 5. Case Type
    case_type = "Supreme Court Appeal"
    upper_sample = f"{case_no} {cleaned_txt[:1200]}".upper()
    if "CIVIL APPEAL" in upper_sample:
        case_type = "Civil Appeal"
    elif "CRIMINAL APPEAL" in upper_sample:
        case_type = "Criminal Appeal"
    elif "WRIT PETITION" in upper_sample:
        case_type = "Writ Petition"
    elif "SPECIAL LEAVE" in upper_sample:
        case_type = "Special Leave Petition"

    # 6. Acts, Sections, Articles, Keywords, Category
    acts = extract_acts(cleaned_txt)
    sections = extract_sections(cleaned_txt)
    articles = extract_articles(cleaned_txt)
    category, keywords = detect_landmark_category(cleaned_txt, title)
    ratio = extract_ratio_summary(cleaned_txt)

    # Formulate official source link
    # eSCR search link or digiscr citation link
    source_url = f"{DEFAULT_SOURCE_URL_BASE}"

    return CaseLawRecord(
        case_id=cnr,
        case_name=title,
        court=COURT_NAME,
        judgment_date=decision_date or str(year),
        year=int(year) if str(year).isdigit() else 1950,
        judges=judges,
        citation=citation,
        case_type=case_type,
        full_text=raw_text,
        cleaned_text=cleaned_txt,
        source=DEFAULT_SOURCE,
        source_url=source_url,
        acts=acts,
        sections=sections,
        articles=articles,
        keywords=keywords,
        landmark_category=category,
        ratio_summary=ratio,
        disposal_nature=disposal,
    )


class CaseLawDatasetIterator:
    """
    Streaming, memory-efficient Parquet iterator with deduplication and normalization.
    """

    def __init__(
        self,
        parquet_path: str,
        only_canonical_english: bool = True,
        batch_size: int = 500
    ):
        self.parquet_path = Path(parquet_path)
        self.only_canonical_english = only_canonical_english
        self.batch_size = batch_size
        self.seen_case_hashes = set()
        self.seen_base_cnrs = set()

    def _is_english_or_canonical(self, cnr: str) -> bool:
        """Filter out non-English regional translation variants."""
        if not self.only_canonical_english:
            return True
        if cnr.endswith("_EN") or not "_" in cnr or re.match(r"^\d{4}_\d+$", cnr):
            return True
        # If suffix is regional language e.g. _HIN, _PUN, _BEN, _MAR, skip
        suffix = cnr.split("_")[-1]
        regional_codes = {"HIN", "PUN", "BEN", "GUJ", "MAL", "TEL", "MAR", "URD", "KAN", "ORI", "TAM", "ASM"}
        return suffix not in regional_codes

    def _get_base_cnr(self, cnr: str) -> str:
        """Strip language suffix to detect duplicate translations."""
        suffix = cnr.split("_")[-1]
        regional_codes = {"EN", "HIN", "PUN", "BEN", "GUJ", "MAL", "TEL", "MAR", "URD", "KAN", "ORI", "TAM", "ASM"}
        if suffix in regional_codes:
            return "_".join(cnr.split("_")[:-1])
        return cnr

    def iter_records(self, max_records: Optional[int] = None) -> Iterator[CaseLawRecord]:
        """Streams normalized CaseLawRecord objects from Parquet file."""
        if not self.parquet_path.exists():
            raise FileNotFoundError(f"Parquet file not found: {self.parquet_path}")

        parquet_file = pq.ParquetFile(str(self.parquet_path))
        yielded_count = 0

        for batch in parquet_file.iter_batches(batch_size=self.batch_size, columns=["cnr", "year", "full_text"]):
            df = batch.to_pandas()
            for _, row in df.iterrows():
                cnr = str(row["cnr"]).strip()
                year = row["year"]
                raw_text = str(row["full_text"])

                # 1. Filter regional translation duplicates
                if not self._is_english_or_canonical(cnr):
                    continue

                base_cnr = self._get_base_cnr(cnr)
                if base_cnr in self.seen_base_cnrs:
                    continue
                self.seen_base_cnrs.add(base_cnr)

                # 2. Text deduplication via hash of normalized sample
                norm_sample = re.sub(r"\s+", "", raw_text[:2000]).lower()
                text_hash = hashlib.md5(norm_sample.encode("utf-8")).hexdigest()
                if text_hash in self.seen_case_hashes:
                    continue
                self.seen_case_hashes.add(text_hash)

                # 3. Extract and normalize
                record = extract_case_metadata(cnr, year, raw_text)
                yield record
                yielded_count += 1

                if max_records and yielded_count >= max_records:
                    return
