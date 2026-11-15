with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_order_warranty.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[2600:2635]))
print('Written snippet_order_warranty.txt')
