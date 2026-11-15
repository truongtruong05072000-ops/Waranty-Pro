import os

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith(('.js', '.html', '.py', '.txt')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    c = fp.read()
                    if 'Failed to fetch' in c or 'serviceos-sync' in c or 'serviceOsLogin' in c:
                        print('Found in:', p)
            except:
                pass
