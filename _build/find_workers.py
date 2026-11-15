import os

target_dir = os.path.abspath('.')
patterns = [b'addEventListener', b'export default', b'fragrant-heart']

for root, dirs, files in os.walk(target_dir):
    for f in files:
        if f.endswith(('.js', '.ts', '.py', '.bat', '.txt', '.json')):
            p = os.path.join(root, f)
            try:
                with open(p, 'rb') as fp:
                    content = fp.read()
                    matches = [pat for pat in patterns if pat in content]
                    if matches:
                        print(p, 'matches:', [m.decode('ascii') for m in matches])
            except Exception as e:
                pass
