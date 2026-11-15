with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<style>([\s\S]*?)</style>', text)
if m:
    with open('_build/current_styles.css', 'w', encoding='utf-8') as out:
        out.write(m.group(1))
    print('Saved current_styles.css, length:', len(m.group(1)))
