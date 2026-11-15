import subprocess, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

res = subprocess.run([r"C:\Users\nhu truong\Downloads\node-v24.21.0-win-x64\node.exe", '_build/test_node_card.js'], capture_output=True, text=True, encoding='utf-8')
print(res.stdout)
