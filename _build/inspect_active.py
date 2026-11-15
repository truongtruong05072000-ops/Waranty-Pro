import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("status: 'active'")
while idx != -1:
    print(text[max(0, idx-100):min(len(text), idx+200)])
    print('='*50)
    idx = text.find("status: 'active'", idx+1)
