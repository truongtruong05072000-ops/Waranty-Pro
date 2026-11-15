# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_dollar = text.find('const $ = s => document.querySelector(s);')
print("Position of const $:", pos_dollar)
print(text[pos_dollar-200:pos_dollar+50])
