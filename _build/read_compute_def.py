with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_compute_def.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[6060:6085]))
print('Written snippet_compute_def.txt')
