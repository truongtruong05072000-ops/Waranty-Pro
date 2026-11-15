# -*- coding: utf-8 -*-
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the broken comment line
old_broken = "$('#gatePass').addEventListener('keydown', e => { if(e.key === 'Enter') // gateTry removed; });"
text = text.replace(old_broken, "// gate listener removed")
text = text.replace("$('#gateBtn').onclick = gateTry;", "// gateBtn removed")

# Also remove any leftover bh_gate check
old_gate_check = """try {
  if(sessionStorage.getItem('bh_gate') === '1' || localStorage.getItem('bh_gate_r') === '1') gateOpen();
} catch(e){}"""
text = text.replace(old_gate_check, "// gate check removed")

with open('PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_build/PhanTichBaoHanh.html', 'w', encoding='utf-8') as f:
    f.write(text)

with open('_deploy/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Replaced broken comment lines in all HTML files!")
