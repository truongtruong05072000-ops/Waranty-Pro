import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('/api/work-orders${qs({')
if idx != -1:
    print(text[idx-200:idx+600])
