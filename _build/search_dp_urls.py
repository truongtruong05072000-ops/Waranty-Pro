import sys, re, os
sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith(('.js', '.html', '.json', '.txt')):
            fpath = os.path.join(root, f)
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                    text = fp.read()
                    for m in re.finditer(r'dealer-portal\.vinfast\.com[^\s"\'<>]*', text):
                        print(f"{fpath}: {m.group(0)}")
            except:
                pass
