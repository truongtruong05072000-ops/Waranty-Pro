with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_init.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[7185:7250]))
print('Written snippet_init.txt')
