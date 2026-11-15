# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('C:/Users/nhu truong/.gemini/antigravity/brain/1642bb09-600f-467a-9926-cfa7d8c6626b/.system_generated/logs/transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line_no, line in enumerate(f):
        if 'DRT00011190AA2102924250824D00833' in line:
            print(f"Found in line {line_no}!")
            idx = line.find('DRT00011190AA2102924250824D00833')
            print(line[max(0, idx - 300):min(len(line), idx + 300)])
