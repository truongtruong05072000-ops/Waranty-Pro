import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/update_template_with_checkxe.py', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('importServiceOsClipboard')
if idx != -1:
    print(text[idx-50:idx+1500])
