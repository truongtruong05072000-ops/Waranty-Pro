import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
url = "https://att-serviceos.anthinhtech.vn/api/auth/login"

req = urllib.request.Request(
    url,
    data=json.dumps({"username": "test_ping_user", "password": "wrong_password_123"}).encode('utf-8'),
    headers={
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://att-serviceos.anthinhtech.vn",
        "Referer": "https://att-serviceos.anthinhtech.vn/"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print("Status:", response.status)
        print("Body:", response.read().decode('utf-8'))
        print("Headers:", response.headers.items())
except urllib.error.HTTPError as e:
    print("HTTP Error Status:", e.code)
    print("Response Error Body:", e.read().decode('utf-8'))
    print("Response Headers:")
    for k, v in e.headers.items():
        print(f"  {k}: {v}")
except Exception as e:
    print("Other Error:", type(e), e)
