with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = list(re.finditer(r'<script[\s>]', text))
for i, s in enumerate(scripts):
    print(f"Script {i}: start={s.start()}, snippet={text[s.start():s.start()+80].strip()}")

body_idx = text.find('<body')
print('Body idx:', body_idx)
