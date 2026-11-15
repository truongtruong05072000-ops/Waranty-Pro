import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function importServiceOsClipboard')
if idx != -1:
    print('Found importServiceOsClipboard:')
    print(text[idx:idx+2500])
else:
    print('importServiceOsClipboard not found')
