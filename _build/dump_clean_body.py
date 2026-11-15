with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
body_html = text[148707:293026]
clean_body = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', 'BASE64_LOGO_URL', body_html)

with open('_build/main_body_markup.html', 'w', encoding='utf-8') as out:
    out.write(clean_body)

print('Saved clean body markup to _build/main_body_markup.html, length:', len(clean_body))
