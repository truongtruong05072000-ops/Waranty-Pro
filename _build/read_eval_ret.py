with open('_build/app_template2.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function evaluateClaimReturnStatus' in line:
        print(f'evaluateClaimReturnStatus line {i+1}')
        with open('_build/snippet_eval_ret.txt', 'w', encoding='utf-8') as out:
            out.write(''.join(lines[i:i+60]))
        break
