import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

m = re.search(r'function handleDealerPortalRealtimeClaims\([^\)]*\)\s*\{([\s\S]*?)(?=\nfunction |\nwindow\.|\nconst |\nlet )', c)
if m:
    print(m.group(0)[:2500])
