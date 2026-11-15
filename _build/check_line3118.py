# -*- coding: utf-8 -*-
with open('_build/temp_main_test.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(3110, min(len(lines), 3145)):
    print(f"{i+1}: {lines[i]}", end='')
