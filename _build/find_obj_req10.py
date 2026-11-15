# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('C:/Users/nhu truong/.gemini/antigravity/brain/1642bb09-600f-467a-9926-cfa7d8c6626b/.system_generated/logs/transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if '79NA-14793' in line and '"diagnosis"' in line:
            idx = line.find('79NA-14793')
            start = line.rfind('{"id"', 0, idx)
            end = line.find('}', idx)
            print("Object slice:")
            print(line[start:end+1])
            break
