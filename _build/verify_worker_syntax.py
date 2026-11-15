import subprocess, sys

node_exe = r"C:\Users\nhu truong\Downloads\node-v24.21.0-win-x64\node.exe"

files = [
    'worker.js',
    '_deploy/worker.js',
    '_deploy/functions/api/sync-serviceos.js'
]

all_ok = True
for f in files:
    res = subprocess.run([node_exe, '--check', f], capture_output=True, text=True)
    if res.returncode == 0:
        print(f"[OK] {f} syntax is VALID!")
    else:
        print(f"[ERROR] {f} syntax error:")
        print(res.stderr)
        all_ok = False

if all_ok:
    print("ALL WORKER FILES PASSED NODE SYNTAX CHECK!")
else:
    sys.exit(1)
