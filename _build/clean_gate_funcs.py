# -*- coding: utf-8 -*-
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace gate functions cleanly
old_gate_func = """function gateOpen(){
  $('#gateLock').hidden = true;
  $('#appShell').style.display = '';
  document.body.classList.remove('locked');
  checkUrlImport();
}"""

new_gate_func = """function gateOpen(){
  checkUrlImport();
}"""

text = text.replace(old_gate_func, new_gate_func)

# Also ensure gateTry is harmless
text = text.replace("async function gateTry(){", "async function gateTry(){ return; // Gate removed\n")

for p in ['PhanTichBaoHanh.html', '_build/PhanTichBaoHanh.html', '_deploy/index.html']:
    with open(p, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Cleaned gate functions in {p}!")
