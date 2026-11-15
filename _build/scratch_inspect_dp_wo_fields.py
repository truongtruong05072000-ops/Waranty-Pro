import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/serviceos_wodetail.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('DP_WO_FIELDS')
print(text[pos-100:pos+1200])
