import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = c.find('const customerBreakdown = {')
if idx != -1:
    print(c[idx-1800:idx+200])
