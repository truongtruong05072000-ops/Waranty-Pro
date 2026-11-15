with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_portal_status2.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[3110:3170]))
print('Written snippet_portal_status2.txt')
