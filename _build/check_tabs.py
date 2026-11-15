import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
tabs = re.findall(r'<div class="tab-pane[^"]*" id="([^"]+)"', content)
print("Tabs found:", tabs)

nav_tabs = re.findall(r'data-tab="([^"]+)"', content)
print("Nav tabs found:", nav_tabs)
