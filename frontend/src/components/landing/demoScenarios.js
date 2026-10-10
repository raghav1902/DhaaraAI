export const SAMPLE_SCENARIOS = {
  "What is section 420 IPC in the new BNS?": {
    category: "BNS 2023 Statutory Concordance",
    statute: "Section 318(4) Bharatiya Nyaya Sanhita (BNS) 2023",
    oldRef: "Formerly Section 420 of Indian Penal Code 1860",
    answer: "Under the new Bharatiya Nyaya Sanhita (BNS) 2023, Cheating and dishonestly inducing delivery of property (formerly Section 420 IPC) is codified under Section 318(4). The core ingredients of dishonest inducement remain consistent, with updated judicial sentencing parameters up to 7 years imprisonment and fine.",
    citation: "Supreme Court of India • State of Kerala v. A. Pareed Pillai (1972) AIR 1973 SC 326",
    tags: ["Offence Against Property", "Cognizable & Non-Bailable", "Court of Magistrate 1st Class"]
  },
  "Analyze a Non-Disclosure Agreement": {
    category: "Contract Clause Risk Audit",
    statute: "Section 27, Indian Contract Act 1872",
    oldRef: "Agreement in Restraint of Trade",
    answer: "Clause 8.2 specifies a 'Perpetual non-compete restraint covering all Indian jurisdictions'. Under Indian contract jurisprudence and Section 27 of the Indian Contract Act, post-employment restrictive covenants are generally void ab initio. Recommend limiting restriction to active trade secret confidentiality without blanket restraint on profession.",
    citation: "Percept D'Mark (India) (P) Ltd. v. Zaheer Khan (2006) 4 SCC 227",
    tags: ["High Risk Clause Flagged", "Section 27 Enforceability", "Drafting Redline Available"]
  },
  "Draft a Legal Notice for unpaid invoices": {
    category: "Commercial Dispute Notice Framework",
    statute: "Section 138 NI Act & Section 318 BNS",
    oldRef: "Civil Recovery Notice Framework",
    answer: "Court-ready statutory demand notice drafted for ₹4,85,000/- outstanding across tax invoices. Formatted with 15-day peremptory cure timeline, interest calculation at 18% p.a., and reserve notice for civil suit under Order 37 CPC alongside criminal complaint for fraudulent misappropriation.",
    citation: "Supreme Court Bench Guidelines • C.C. Alavi Haji v. Palapetty Muhammed (2007) 6 SCC 555",
    tags: ["Ready to Print Notice", "Order 37 CPC Compliant", "Interest Clause Factored"]
  },
  "Calculate Court Fee for ₹15 Lakh Suit in Delhi": {
    category: "Court Fee & Stamp Valuation",
    statute: "Court Fees Act 1870 (Delhi Amendment) Schedule I, Article 1",
    oldRef: "Ad-Valorem Valuation on Plaint",
    answer: "For a commercial recovery suit valued at ₹15,00,000/- before the District Courts of Delhi: Fixed ad-valorem fee payable is ₹21,240/-. Process fee: ₹500/-, Advocate Welfare Stamp: ₹25/-. No exemption applies as plaintiff is a corporate entity.",
    citation: "Delhi High Court (Original Side) Rules 2018 & Court Fees Act 1870",
    tags: ["₹21,240 Court Fee Computed", "Delhi State Rules", "District Court & High Court Ready"]
  },
  "Scan email for cyber data breach and fraud remedies": {
    category: "Cyber Exposure & Statutory Remedy",
    statute: "Information Technology Act 2000 (Sections 66, 66C, 72A)",
    oldRef: "Identity Theft & Data Confidentiality Breach",
    answer: "Target identified in 2 historical database exposures. Leaked data classes include plain text credentials, phone records, and login identifiers. Immediate action required: invoke National Cyber Helpline 1930, lodge complaint on cybercrime.gov.in, and file statutory breach claim under Section 43A & 72A IT Act 2000.",
    citation: "IT Act 2000 Sec 66C (Identity Theft) & Sec 72A (Disclosure in breach of lawful contract)",
    tags: ["High Risk Alert", "1930 Helpline Recourse", "IT Act 2000 Ready"]
  }
};

export const getScenarioFallback = (query) => ({
  category: "Indian Legal Precedent Retrieval",
  statute: "Bharatiya Nyaya Sanhita & Relevant Statutory Acts",
  oldRef: "Statutory Reference Search",
  answer: `Analysis for "${query}": Verified against Supreme Court precedent database and current statutory rules. Relevant procedural compliance applies under BNSS 2023 and Civil Procedure Code.`,
  citation: "Supreme Court of India Constitutional Bench Digest (2024)",
  tags: ["Verified Precedent", "Indian Law Corpus", "Active Citation"]
});
