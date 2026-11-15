# -*- coding: utf-8 -*-
import sys, re, os

with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("Original length:", len(html))

# 1. Remove Script 2 (the password gate check script)
# Look for Script 2 exactly
pos_s2 = html.find("sessionStorage.getItem('bh_gate')")
if pos_s2 != -1:
    tag_start = html.rfind('<script>', 0, pos_s2)
    tag_end = html.find('</script>', pos_s2) + 9
    print(f"Removing Script 2 from {tag_start} to {tag_end}")
    html = html[:tag_start] + html[tag_end:]
    print("Script 2 removed successfully!")
else:
    print("WARNING: Script 2 not found!")

# 2. Remove #gateLock HTML modal entirely
pos_gl = html.find('id="gateLock"')
if pos_gl != -1:
    div_start = html.rfind('<div', 0, pos_gl)
    # find where modal ends (before modalBookmarklet or next comment)
    next_modal = html.find('<!-- Modal Hướng Dẫn', pos_gl)
    if next_modal == -1: next_modal = html.find('<div id="modalBookmarklet"', pos_gl)
    print(f"Removing gateLock HTML from {div_start} to {next_modal}")
    html = html[:div_start] + html[next_modal:]
    print("gateLock HTML modal removed successfully!")
else:
    print("WARNING: gateLock HTML not found!")

# 3. Remove lock button in header
html = re.sub(r'<button class="header-btn"[^>]*onclick="gateOut\(\)"[^>]*>.*?</button>', '', html, flags=re.DOTALL)
print("Removed lock button from header.")

# 4. In main script: ensure appShell is shown and gate functions are disabled
html = html.replace("window.gateOut = function(){", "window.gateOut = function(){ /* Gate removed */ }; window._gateOutOld = function(){")
html = html.replace("$('#gateBtn').onclick = gateTry;", "// gateBtn removed")
html = html.replace("const GATE_SHA = '__PASS_SHA__', GATE_FB = '__PASS_FB__';", "// Gate removed")

# Also ensure body does not have class 'locked' and appShell has no display:none
html = html.replace('class="locked"', '')
html = html.replace('style="display:none"', '')

print("New length:", len(html))

# Save to all target locations
for target_path in ['PhanTichBaoHanh.html', '_build/PhanTichBaoHanh.html', '_deploy/index.html']:
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {target_path} successfully!")
