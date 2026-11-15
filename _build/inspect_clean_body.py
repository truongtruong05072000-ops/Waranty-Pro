with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Replace the huge base64 with a placeholder to inspect the HTML
clean_html = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', 'DATA_URL_PLACEHOLDER', text)
body_idx = clean_html.find('<body')
script_idx = clean_html.find('<script')

print('Clean HTML between <body> and first <script>:')
html_body = clean_html[body_idx:script_idx]
print('Length of clean HTML body:', len(html_body))

with open('_build/clean_body.html', 'w', encoding='utf-8') as out:
    out.write(html_body)

print('Written to _build/clean_body.html')
