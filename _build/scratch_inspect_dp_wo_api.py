import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('/api/dealer-portal/work-orders/')
while pos != -1:
    print(f"--- MATCH AT {pos} ---")
    print(text[max(0, pos-200):min(len(text), pos+600)])
    pos = text.find('/api/dealer-portal/work-orders/', pos+1)
