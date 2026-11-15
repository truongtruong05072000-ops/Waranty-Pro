with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

no_scripts = re.sub(r'<script[\s\S]*?</script>', '', text)
no_styles = re.sub(r'<style[\s\S]*?</style>', '', no_scripts)
clean_markup = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', 'BASE64', no_styles)

for line_no, line in enumerate(clean_markup.splitlines()):
    l = line.strip()
    if ('//' in l or 'function(' in l or 'var ' in l or 'const ' in l) and not l.startswith('<!--'):
        print(f"Line {line_no}:", l[:80].encode('ascii', errors='replace').decode('ascii'))
