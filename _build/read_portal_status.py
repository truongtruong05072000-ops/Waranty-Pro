with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_portal_status.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[2790:2830]))
print('Written snippet_portal_status.txt')
