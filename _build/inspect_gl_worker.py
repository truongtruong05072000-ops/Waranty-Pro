# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('_build/worker_backup.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_rem = text.find('id="gateRemember"')
print(text[pos_rem:pos_rem+400])
