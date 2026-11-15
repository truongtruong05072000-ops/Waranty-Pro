with open(r'_build\serviceos_wodetail.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = set(re.findall(r'(/api/[a-zA-Z0-9_\-\/]+)', text))
print('APIs in wodetail.js:', matches)
