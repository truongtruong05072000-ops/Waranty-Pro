with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_switch.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[5580:5640]))
print('Written snippet_switch.txt')
