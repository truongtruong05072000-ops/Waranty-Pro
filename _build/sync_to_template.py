# -*- coding: utf-8 -*-
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the first script block (SheetJS) with <!--SHEETJS-->
idx1 = text.find('<script>')
idx2 = text.find('</script>', idx1)

if idx1 != -1 and idx2 != -1:
    tpl = text[:idx1] + '<!--SHEETJS-->' + text[idx2 + 9:]
    with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
        f.write(tpl)
    print('Updated _build/app_template2.html successfully! Length:', len(tpl))
else:
    print('Script tags not found')
