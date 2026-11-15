import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('window.parseDealerPortalJson = function')
if idx != -1:
    print(content[idx:idx+3500])
