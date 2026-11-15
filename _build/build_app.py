# -*- coding: utf-8 -*-
import io, hashlib, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))

def djb2(s):
    h = 5381
    for ch in s:
        h = ((h * 33) + ord(ch)) & 0xFFFFFFFF
    return format(h, 'x')

PASS = 'n54511'
sha = hashlib.sha256(PASS.encode('utf-8')).hexdigest()
fb = djb2(PASS)

tpl = io.open(os.path.join(BASE, 'app_template2.html'), encoding='utf-8').read()
lib = io.open(os.path.join(BASE, 'xlsx.full.min.js'), encoding='utf-8').read()

assert '<!--SHEETJS-->' in tpl, 'marker missing'
assert '__PASS_SHA__' in tpl and '__PASS_FB__' in tpl, 'pass placeholders missing'

out = tpl.replace('<!--SHEETJS-->', '<script>\n' + lib + '\n</script>')
out = out.replace('__PASS_SHA__', sha).replace('__PASS_FB__', fb)

assert '__PASS_SHA__' not in out and '__PASS_FB__' not in out, 'pass replace failed'
assert out.count('<script>') == 3, 'script count: %d' % out.count('<script>')

dst = os.path.join(BASE, 'PhanTichBaoHanh.html')
io.open(dst, 'w', encoding='utf-8').write(out)

res = []
res.append('BUILD OK')
res.append('sha256(%s)=%s' % (PASS, sha))
res.append('djb2(%s)=%s' % (PASS, fb))
res.append('template=%d lib=%d out=%d' % (len(tpl), len(lib), len(out)))
res.append('placeholders_left=%d' % (out.count('__PASS_')))
io.open(os.path.join(BASE, '_build_result.txt'), 'w', encoding='utf-8').write('\n'.join(res))
print('DONE')
