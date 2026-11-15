import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("id: 'foreman_note'")
if idx != -1:
    print(text[idx-500:idx+1000])
