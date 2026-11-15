with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_has_bang.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[2915:2950]))
print('Written snippet_has_bang.txt')
