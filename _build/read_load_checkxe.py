with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function loadCheckXeOrders' in line:
        print(f'loadCheckXeOrders line {i+1}')
        with open('_build/snippet_load_checkxe.txt', 'w', encoding='utf-8') as out:
            out.write(''.join(lines[i:i+40]))
        break
