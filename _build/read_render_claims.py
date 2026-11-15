with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('_build/snippet_render_claims.txt', 'w', encoding='utf-8') as out:
    out.write(''.join(lines[6620:6710]))
print('Written snippet_render_claims.txt')
