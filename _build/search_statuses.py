import sys, io, re
sys.stdout.reconfigure(encoding='utf-8')

for fpath in ['_build/serviceos_core.js', '_build/serviceos_workorders.js']:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    for kw in ['chờ kiểm tra', 'đã hoàn thành', 'nghiệm thu', 'hoàn thành']:
        matches = [m.start() for m in re.finditer(kw, text, re.I)]
        print(fpath, kw, len(matches))
        for idx in matches[:2]:
            print('  ', text[max(0, idx-50):min(len(text), idx+100)])
