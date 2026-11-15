# -*- coding: utf-8 -*-
import json
import sys

transcript_path = 'C:/Users/nhu truong/.gemini/antigravity/brain/1642bb09-600f-467a-9926-cfa7d8c6626b/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'WC-N54511-26-11-05-50-0001' in line:
            obj = json.loads(line)
            content = obj.get('content', '')
            idx = content.find('"data"')
            if idx != -1:
                brace_idx = content.rfind('{', 0, idx)
                if brace_idx != -1:
                    raw = content[brace_idx:].strip()
                    try:
                        decoder = json.JSONDecoder()
                        parsed, end_idx = decoder.raw_decode(raw)
                        print('Decoded claims successfully! Count:', len(parsed.get('data', [])))
                        with open('_build/user_dealer_claims.json', 'w', encoding='utf-8') as out:
                            json.dump(parsed, out, ensure_ascii=False, indent=2)
                        print('Saved _build/user_dealer_claims.json')
                        sys.exit(0)
                    except Exception as e:
                        print('Decode error:', e)
