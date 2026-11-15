import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

m = re.search(r'async function pageWoList\([^\)]*\)\s*\{([\s\S]*?)(?=\nfunction |\nasync function )', c)
if m:
    print(m.group(0)[:3000])
