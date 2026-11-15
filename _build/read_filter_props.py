with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_filter_props.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[6570:6630]))
print('Written snippet_filter_props.txt')
