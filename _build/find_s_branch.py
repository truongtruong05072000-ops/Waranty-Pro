import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_shell.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

for m in re.finditer(r'S\.branch\b', c):
    start = max(0, m.start() - 100)
    end = min(len(c), m.end() + 100)
    print(c[start:end])
    print('-'*50)
