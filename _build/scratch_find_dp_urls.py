import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root: continue
    for f in files:
        if f.endswith(('.js', '.html', '.json', '.py')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                    matches = re.findall(r'dealer-portal\.vinfast\.com[^\s\'\"\`<>]*', content)
                    if matches:
                        print(f"{p}: {set(matches)}")
            except Exception as e:
                pass
