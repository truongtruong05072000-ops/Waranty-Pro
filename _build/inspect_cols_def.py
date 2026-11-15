import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_workorders.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find cols definition in workorders.js
idx = text.find("const cols =")
if idx == -1:
    idx = text.find("cols =")
if idx != -1:
    print(text[idx:idx+2500])
