import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = c.find('window.parseDealerPortalJson =')
if idx != -1:
    print(c[idx+2000:idx+4000])
