import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('table-compact')
if idx == -1:
    idx = text.find('wo-grid')
if idx != -1:
    print('Found wo-grid:')
    print(text[idx-200:idx+800])
else:
    print('wo-grid not found')
