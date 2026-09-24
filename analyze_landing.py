import json
import os

log_path = r'C:\Users\ragha\.gemini\antigravity-ide\brain\97346f6e-cfa2-47ec-98d7-2ff5e8ba8866\.system_generated\logs\transcript_full.jsonl'
output_path = r'C:\Users\ragha\OneDrive\Desktop\DhaaraAI\landing_history.txt'

if not os.path.exists(log_path):
    print(f"Log path not found: {log_path}")
else:
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    events = []
    
    for line in lines:
        try:
            data = json.loads(line)
            
            # Check tool_calls
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                tc_args = tc.get("arguments", {})
                if isinstance(tc_args, str):
                    tc_args = json.loads(tc_args)
                
                func_name = tc.get("function", {}).get("name", "")
                
                # if LandingPage.jsx is in arguments
                args_str = json.dumps(tc_args)
                if "LandingPage.jsx" in args_str:
                    events.append({
                        "step": data.get("step_index"),
                        "tool": func_name,
                        "args": tc_args
                    })
        except Exception as e:
            pass

    with open(output_path, 'w', encoding='utf-8') as out_f:
        for e in events:
            out_f.write(f"Step {e['step']}: {e['tool']}\n")
            # don't write full args to save space, just keys and string lengths
            summary = {k: (len(str(v)) if isinstance(v, str) else v) for k, v in e['args'].items()}
            out_f.write(f"  Args: {json.dumps(summary)}\n\n")
            
    print(f"History written to {output_path}")
