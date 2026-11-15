import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('baohanh_realtime_extension/injected_interceptor.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

m = re.search(r'function handleCapturedData\([^\)]*\)\s*\{([\s\S]*?)(?=\n  \/\/)', c)
if m:
    print(m.group(0))
