# -*- coding: utf-8 -*-
import sys, re

# 1. Update _build/app_template2.html
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the lock button in header
old_lock_btn = """      <button class="header-btn" onclick="gateOut()" title="Khoá phiên làm việc">
        <span>🔒</span> Thoát
      </button>"""
if old_lock_btn in html:
    html = html.replace(old_lock_btn, '')
    print("Removed lock/gateOut button from header!")
else:
    # try regex
    html = re.sub(r'<button class="header-btn"[^>]*onclick="gateOut\(\)"[^>]*>.*?</button>', '', html, flags=re.DOTALL)
    print("Cleaned gateOut button via regex!")

# Remove #gateLock HTML modal entirely
gate_modal_pattern = re.compile(r'<!-- Password Gate Modal -->\s*<div id="gateLock".*?</div>\s*</div>\s*</div>', re.DOTALL)
if gate_modal_pattern.search(html):
    html = gate_modal_pattern.sub('<!-- Password Gate Removed -->', html)
    print("Removed #gateLock HTML modal entirely!")
else:
    # try finding id="gateLock"
    p1 = html.find('id="gateLock"')
    if p1 != -1:
        # find the outer closing div
        p0 = html.rfind('<div', 0, p1)
        p2 = html.find('<!-- Modal Hướng Dẫn', p1)
        if p2 == -1: p2 = html.find('<div id="modalBookmarklet"', p1)
        if p2 != -1:
            html = html[:p0] + html[p2:]
            print("Removed gateLock via positional search!")

# Remove Script 2 (the inline gate check script)
inline_gate_script = re.compile(r'<script>\s*\(function\(\)\{\s*let ok = false;.*?document\.body\.classList\.add\(\'locked\'\);\s*\}\s*\}\)\(\);\s*</script>', re.DOTALL)
if inline_gate_script.search(html):
    html = inline_gate_script.sub('<!-- Gate Check Script Removed -->', html)
    print("Removed inline gate check script (Script 2)!")
else:
    # search manually
    pos_gate_s = html.find("sessionStorage.getItem('bh_gate')")
    if pos_gate_s != -1:
        s_tag = html.rfind('<script>', 0, pos_gate_s)
        e_tag = html.find('</script>', pos_gate_s) + 9
        if s_tag != -1 and e_tag != -1 and e_tag - s_tag < 1500:
            html = html[:s_tag] + '<!-- Gate Script Removed -->' + html[e_tag:]
            print("Removed inline gate check script via text search!")

# Remove gate functions and gate listeners from main app script
html = re.sub(r'const GATE_SHA = [^;]*;.*?function gateOpen\(\)\{.*?\}', '// Gate removed\nfunction gateOpen(){}', html, flags=re.DOTALL)
html = html.replace("window.gateOut = function(){", "window.gateOut = function(){ /* Gate removed */ }; window._gateOutOld = function(){")
html = html.replace("$('#gateBtn').onclick = gateTry;", "// gateBtn removed")
html = html.replace("$('#gatePass').addEventListener('keydown', e => { if(e.key === 'Enter') gateTry(); });", "// gatePass listener removed")
html = html.replace("const GATE_SHA = '__PASS_SHA__', GATE_FB = '__PASS_FB__';", "// PASS REMOVED")

# Ensure #appShell is always visible
html = html.replace('id="appShell" style="display:none"', 'id="appShell"')
html = html.replace('class="locked"', '')

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated app_template2.html without password gate!")

# 2. Update _build/build_and_deploy.py to compile without password requirements
with open('_build/build_and_deploy.py', 'r', encoding='utf-8') as f:
    bcode = f.read()

# Update script count assertion to 2 (SheetJS + Main app)
bcode = bcode.replace("assert '__PASS_SHA__' in tpl and '__PASS_FB__' in tpl, 'pass placeholders missing'", "# pass placeholders removed")
bcode = bcode.replace("assert '__PASS_SHA__' not in out and '__PASS_FB__' not in out, 'pass replace failed'", "# pass check removed")
bcode = bcode.replace("assert out.count('<script>') == 3, f'script count: {out.count(\"<script>\")}'", "assert out.count('<script>') == 2, f'script count: {out.count(\"<script>\")}'")

with open('_build/build_and_deploy.py', 'w', encoding='utf-8') as f:
    f.write(bcode)
print("Updated build_and_deploy.py for 2 scripts (SheetJS + Main app)!")
