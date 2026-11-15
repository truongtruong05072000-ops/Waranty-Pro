import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('// Tra cứu tự động từ bộ nhớ đề xuất Dealer Portal')
print(text[pos:pos+700])
