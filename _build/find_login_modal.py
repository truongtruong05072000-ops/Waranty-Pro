import os

for root, dirs, files in os.walk('_build'):
    for f in files:
        if f.endswith('.py'):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    c = fp.read()
                    if 'Failed to fetch' in c or 'truongtnn' in c:
                        print('Found in:', p)
            except:
                pass
