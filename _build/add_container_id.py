# -*- coding: utf-8 -*-
with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = '<div style="padding:14px 18px">\n          ${renderCustomerBreakdownHtml(C.customerBreakdown)}\n        </div>'
replacement = '<div id="customerBreakdownContainer" style="padding:14px 18px">\n          ${renderCustomerBreakdownHtml(C.customerBreakdown)}\n        </div>'

assert target in c, 'target not found'
c = c.replace(target, replacement)

with open('_build/app_template2.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated customerBreakdownContainer id')
