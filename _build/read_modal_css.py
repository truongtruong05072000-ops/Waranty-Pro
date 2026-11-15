with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_modal_css.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[870:915]))
print('Written snippet_modal_css.txt')
