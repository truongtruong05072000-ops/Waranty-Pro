# -*- coding: utf-8 -*-
with open('_build/temp_main_test.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Total lines in temp_main_test.js:", len(lines))
print("Last 30 lines:")
for l in lines[-30:]:
    print(l, end='')
