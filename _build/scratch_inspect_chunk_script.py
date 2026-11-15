import sys, os, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/inspect_chunk_1azz.py', 'r', encoding='utf-8') as f:
    text = f.read()

print(text[:1500])
