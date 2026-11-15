import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('// Phân loại thanh toán (Phân loại TT)')
print(text[pos:pos+1500])
