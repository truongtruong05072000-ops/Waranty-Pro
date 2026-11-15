with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const isWarrantyPayment =' in line:
        print(f'isWarrantyPayment line {i+1}')
        with open('_build/snippet_norm_warranty_chk.txt', 'w', encoding='utf-8') as out:
            out.write(''.join(lines[i-5:i+30]))
        break
