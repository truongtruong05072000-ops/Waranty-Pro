import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function woGridBody')
if idx != -1:
    print('Found woGridBody:')
    print(text[idx:idx+1500])
