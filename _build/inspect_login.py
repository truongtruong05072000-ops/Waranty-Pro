import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_core.js', 'r', encoding='utf-8') as f:
    text = f.read()

for kw in ['/api/login', '/api/auth', '/api/me', 'loginForm']:
    matches = list(re.finditer(kw, text))
    print(f"{kw}: {len(matches)} matches")
    if matches:
        idx = matches[0].start()
        print(f"  Context: {text[max(0, idx-50):min(len(text), idx+150)]}")
