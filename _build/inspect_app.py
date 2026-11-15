import re

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

body_start = text.find('<body')
body_text = text[body_start:]
ids = re.findall(r'id=["\']([a-zA-Z0-9_\-]+)["\']', body_text)
unique_ids = list(dict.fromkeys(ids))
for i, x in enumerate(unique_ids[40:]):
    print(f"  {i+41}. {x}")
