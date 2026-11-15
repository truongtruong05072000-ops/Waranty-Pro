import sys, io, re, os
sys.stdout.reconfigure(encoding='utf-8')

for fname in os.listdir('_build'):
    if fname.startswith('serviceos_') and fname.endswith('.js'):
        fpath = os.path.join('_build', fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            text = f.read()
        m = list(re.finditer(r'/api/(auth|login|session|users/login)', text))
        if m:
            print(f"{fname}: {len(m)} matches for login endpoint")
            for x in m:
                print('  ', text[max(0, x.start()-30):min(len(text), x.end()+50)])
