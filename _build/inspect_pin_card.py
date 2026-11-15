import sys, io
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("kinds.push('pin')")
if idx != -1:
    print(text[idx-200:idx+1500])
