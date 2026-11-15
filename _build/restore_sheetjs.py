# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_strict = text.find("'use strict';")
print("Position of 'use strict':", pos_strict)
s_tag = text.rfind('<script', 0, pos_strict)
print("Script tag before 'use strict':", text[s_tag:s_tag+50])

# Add <!--SHEETJS--> right before this script tag
text = text[:s_tag] + '<!--SHEETJS-->\n\n' + text[s_tag:]

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Restored <!--SHEETJS--> right before main script!")
