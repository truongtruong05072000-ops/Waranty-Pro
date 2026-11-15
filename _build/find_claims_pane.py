import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('/* ==================== 4. CLAIMS PANE ==================== */')
if idx != -1:
    print(content[idx:idx+2500])
else:
    idx2 = content.find('id="claimsContent"')
    print(content[idx2-200:idx2+600])
