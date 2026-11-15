# -*- coding: utf-8 -*-
import sys, re

with open('_build/worker_backup.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("Original length:", len(html))

# Find start of Password Gate Modal
gate_start = html.find('<!-- Password Gate Modal -->')
assert gate_start != -1, "gate_start not found"

# Find end of the gate script (the </script> right before SheetJS)
sheetjs_pos = html.find('/*! xlsx.js')
assert sheetjs_pos != -1, "SheetJS not found"

gate_end = html.rfind('</script>', gate_start, sheetjs_pos) + 9
assert gate_end > gate_start, "gate_end invalid"

print(f"Removing gate block from {gate_start} to {gate_end} (length: {gate_end - gate_start})")
html = html[:gate_start] + '<!-- Password Gate Removed -->\n' + html[gate_end:]

# Remove lock button in header
html = re.sub(r'<button class="header-btn"[^>]*onclick="gateOut\(\)"[^>]*>.*?</button>', '', html, flags=re.DOTALL)

# In main script: ensure no errors if gate functions exist
html = html.replace('gateTry();', '// gateTry removed;')
html = html.replace("window.gateOut = function(){", "window.gateOut = function(){ /* Gate removed */ }; window._gateOutOld = function(){")

# Ensure appShell has no display:none and body has no 'locked' class
html = html.replace('class="locked"', '')
html = html.replace('id="appShell" style="display:none"', 'id="appShell"')

print("New length:", len(html))

# Verify scripts in new html
import re
scripts = [m.start() for m in re.finditer(r'<script', html)]
print("Total script tags in result:", len(scripts))
for idx, p in enumerate(scripts):
    print(f"Script {idx+1}: {html[p:p+70]}...")

# Write to all 3 files
for p in ['PhanTichBaoHanh.html', '_build/PhanTichBaoHanh.html', '_deploy/index.html']:
    with open(p, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully written to {p}!")
