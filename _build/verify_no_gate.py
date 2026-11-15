# -*- coding: utf-8 -*-
with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function gateOpen()')
print(text[pos-200:pos+300])
