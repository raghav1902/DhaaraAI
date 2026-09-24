import json
import os

log_path = r'C:\Users\ragha\.gemini\antigravity-ide\brain\97346f6e-cfa2-47ec-98d7-2ff5e8ba8866\.system_generated\logs\transcript_full.jsonl'
output_path = r'C:\Users\ragha\OneDrive\Desktop\DhaaraAI\landing_recovery.txt'

if not os.path.exists(log_path):
    print(f"Log path not found: {log_path}")
else:
    # We want to find the LAST time LandingPage.jsx was written in full or viewed in full
    # Or just extract all code blocks containing "export default function LandingPage"
    
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    found_snippets = []
    
    for line in lines:
        try:
            data = json.loads(line)
            content = data.get("content", "")
            if "export default function LandingPage" in content:
                # Store the content length and a snippet to analyze
                found_snippets.append({
                    "step": data.get("step_index"),
                    "length": len(content),
                    "type": data.get("type"),
                    "content": content
                })
            
            # Also check tool_calls
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                tc_args = str(tc.get("arguments", ""))
                if "export default function LandingPage" in tc_args:
                    found_snippets.append({
                        "step": data.get("step_index"),
                        "length": len(tc_args),
                        "type": "TOOL_CALL",
                        "name": tc.get("function", {}).get("name"),
                        "content": tc_args
                    })
        except:
            pass

    # Find the largest one
    if found_snippets:
        found_snippets.sort(key=lambda x: x["length"], reverse=True)
        best = found_snippets[0]
        with open(output_path, 'w', encoding='utf-8') as out_f:
            out_f.write(f"Best match length: {best['length']} at step {best['step']} of type {best['type']}\n")
            out_f.write(best['content'])
        print(f"Recovered snippet of length {best['length']} to {output_path}")
    else:
        print("No LandingPage found in transcript.")
