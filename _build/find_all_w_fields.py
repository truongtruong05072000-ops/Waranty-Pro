import sys, re
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

# find all occurrences of `w.` in columns definitions
fields = sorted(set(re.findall(r'\bw\.([a-zA-Z0-9_]+)', c)))
print('Fields accessed on w in serviceos_workorders.js:')
print(fields)
