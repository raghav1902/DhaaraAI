import json
import os

log_path = r'C:\Users\ragha\.gemini\antigravity-ide\brain\97346f6e-cfa2-47ec-98d7-2ff5e8ba8866\.system_generated\logs\transcript_full.jsonl'
output_path = r'C:\Users\ragha\OneDrive\Desktop\DhaaraAI\landing_recovery.txt'

if not os.path.exists(log_path):
    print(f"Log path not found: {log_path}")
else:
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    found_snippets = []
    
    for line in lines:
        try:
            data = json.loads(line)
            # Check content
            content = data.get("content", "")
            if isinstance(content, str) and "export default function LandingPage" in content:
                found_snippets.append({
                    "step": data.get("step_index"),
                    "length": len(content),
                    "type": data.get("type"),
                    "content": content
                })
            
            # Check tool_calls
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                tc_args = tc.get("arguments", {})
                if isinstance(tc_args, str):
                    tc_args = json.loads(tc_args)
                
                # Check CodeContent
                code_content = tc_args.get("CodeContent", "")
                if isinstance(code_content, str) and "export default function LandingPage" in code_content:
                    found_snippets.append({
                        "step": data.get("step_index"),
                        "length": len(code_content),
                        "type": "TOOL_CALL",
                        "content": code_content
                    })
        except Exception as e:
            pass

    if found_snippets:
        found_snippets.sort(key=lambda x: x["length"], reverse=True)
        best = found_snippets[0]
        with open(output_path, 'w', encoding='utf-8') as out_f:
            out_f.write(best['content'])
        print(f"Recovered snippet of length {best['length']} to {output_path}")
    else:
        print("No LandingPage found in transcript.")
