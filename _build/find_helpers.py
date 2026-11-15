import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/renderCheckXe_full.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
matches = re.findall(r'function (setCheckXe\w+|resetCheckXe\w+|openEditNoteModal)\(', code)
print("Filter / helper functions in renderCheckXe:", matches)
