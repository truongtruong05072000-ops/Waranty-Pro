with open('PhanTichBaoHanh.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
style_start = text.find('<style>')
style_end = text.find('</style>') + 8
print('Style tag range:', style_start, style_end, 'Length:', style_end - style_start)

# Check renderCheckXe
rc_start = text.find('function renderCheckXe()')
# Find where renderCheckXe ends (before function parseServiceOsExcel or similar)
rc_next = text.find('// Bóc tách Excel ServiceOS', rc_start)
if rc_next == -1:
    rc_next = text.find('function parseServiceOsExcel', rc_start)
print('renderCheckXe range:', rc_start, rc_next)

# Check svgChart
sc_start = text.find('function svgChart(')
sc_end = text.find('function ', sc_start + 20)
print('svgChart range:', sc_start, sc_end)
