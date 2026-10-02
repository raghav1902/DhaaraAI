import sys, os, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from rag_engine import DhaaraRAGEngine

engine = DhaaraRAGEngine()

queries = [
    "What is bail?",
    "What is anticipatory bail?",
    "My cheque bounced, what can I do?",
    "Someone cheated me online, what legal action can I take?",
    "My landlord is not returning my security deposit.",
    "Police refused to register my FIR.",
    "What is the difference between IPC 420 and BNS 318?",
    "Explain Section 138 NI Act completely.",
    "What are my rights after arrest?",
    "Mera cheque bounce ho gaya hai, ab mai kya karu?"
]

print("=== STARTING DHAARAAI 10 REAL QUERIES VALIDATION ===", flush=True)

for idx, q in enumerate(queries, 1):
    print(f"\n{'='*60}\n[{idx}/10] QUERY: {q}\n{'='*60}", flush=True)
    res = engine.query(q)
    ans = res.get("answer", "")
    sources = res.get("sources", [])
    
    print(f"Sources Count: {len(sources)}", flush=True)
    for s in sources[:3]:
        st = s.get("source_type", "Statutory")
        sec = s.get("section", "")
        title = s.get("section_title") or s.get("case_name") or s.get("title", "")
        print(f"  • [{st}] {sec} - {title}", flush=True)
        
    print(f"Answer Length: {len(ans)} chars", flush=True)
    headers = [line.strip() for line in ans.split("\n") if line.strip().startswith("#")]
    print(f"Detected Headers: {headers}", flush=True)
    print("\nAnswer Excerpt:\n", ans[:400], "...\n", flush=True)

print("=== COMPLETED ALL 10 QUERIES SUCCESSFULLY ===", flush=True)
