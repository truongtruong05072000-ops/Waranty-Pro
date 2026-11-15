import json

transcript_path = r'C:\Users\nhu truong\.gemini\antigravity\brain\1642bb09-600f-467a-9926-cfa7d8c6626b\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '59TA-11162' in line:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                print(f"Found at step {data.get('step_index')}, length: {len(content)}")
                with open('_build/serviceos_raw_user_input.json', 'w', encoding='utf-8') as out:
                    out.write(content)
                print("Written to _build/serviceos_raw_user_input.json")
                break
