# -*- coding: utf-8 -*-
import http.server
import socketserver
import json
import urllib.request
import urllib.error
import ssl
import sys
from concurrent.futures import ThreadPoolExecutor

PORT = 8787

def enrich_warranty_order(w, cookie_str, ctx):
    """Fetch detail and dealer portal claims for a single warranty order."""
    wo_id = w.get('id')
    if not wo_id:
        return
    
    headers = {
        'Accept': 'application/json',
        'Cookie': cookie_str,
        'Origin': 'https://att-serviceos.anthinhtech.vn',
        'Referer': 'https://att-serviceos.anthinhtech.vn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    # 1. Fetch work-order detail
    try:
        wo_url = f'https://att-serviceos.anthinhtech.vn/api/work-orders/{wo_id}'
        req = urllib.request.Request(wo_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=12) as res:
            dt = json.loads(res.read().decode('utf-8'))
            wo = dt.get('work_order') or dt
            if wo.get('warranty_extra'):
                w['warranty_extra'] = wo['warranty_extra']
            if wo.get('dms_warranty_code'):
                w['dms_warranty_code'] = wo['dms_warranty_code']
            if wo.get('dms_claim_code'):
                w['dms_claim_code'] = wo['dms_claim_code']
            if wo.get('dms_ro_code'):
                w['dms_ro_code'] = wo['dms_ro_code']
            if wo.get('inspection_notes'):
                w['inspection_notes'] = wo['inspection_notes']
            if wo.get('reception_check'):
                w['reception_check'] = wo['reception_check']
    except Exception:
        pass

    # 2. Fetch dealer-portal work-order claims
    try:
        dp_url = f'https://att-serviceos.anthinhtech.vn/api/dealer-portal/work-orders/{wo_id}'
        req = urllib.request.Request(dp_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=12) as res:
            dp = json.loads(res.read().decode('utf-8'))
            dp_claims = dp.get('claims') or []
            if dp_claims:
                w['dealer_claims'] = dp_claims

            # Merge dealer claims into warranty_extra
            extra = dict(w.get('warranty_extra') or {})
            kinds = w.get('warranty_kinds') or list(extra.keys()) or ['pin']
            
            for claim in dp_claims:
                w_ro = (claim.get('work_order') or '').strip()
                if w_ro and not w.get('dms_warranty_code'):
                    w['dms_warranty_code'] = w_ro
                c_num = (claim.get('number') or claim.get('claim_code') or '').strip()
                if c_num and not w.get('dms_claim_code'):
                    w['dms_claim_code'] = c_num

                matched_kind = None
                for k in kinds:
                    row = dict(extra.get(k) or {})
                    row_wcode = (row.get('warranty_code') or '').strip()
                    if (row_wcode and w_ro and row_wcode.upper() == w_ro.upper()) or len(kinds) == 1:
                        matched_kind = k
                        break
                if not matched_kind and kinds:
                    matched_kind = kinds[0]

                if matched_kind:
                    row = dict(extra.get(matched_kind) or {})
                    if not row.get('warranty_code') and w_ro:
                        row['warranty_code'] = w_ro
                    if not row.get('claim_code') and c_num:
                        row['claim_code'] = c_num
                    if not row.get('claim_amount') and claim.get('amount') is not None:
                        row['claim_amount'] = claim['amount']
                    if not row.get('claim_submitted_at') and (claim.get('submitted_at') or claim.get('created_at')):
                        row['claim_submitted_at'] = claim.get('submitted_at') or claim.get('created_at')
                    if not row.get('claim_approved_at') and claim.get('approved_at'):
                        row['claim_approved_at'] = claim['approved_at']
                    if claim.get('status') and not row.get('claim_status'):
                        row['claim_status'] = claim['status']
                    if not row.get('serial_old') and claim.get('serial_old'):
                        row['serial_old'] = claim['serial_old']
                    if not row.get('serial_new') and claim.get('serial_new'):
                        row['serial_new'] = claim['serial_new']
                    if not row.get('dien_giai') and claim.get('dien_giai'):
                        row['dien_giai'] = claim['dien_giai']
                    extra[matched_kind] = row

            w['warranty_extra'] = extra
    except Exception:
        pass


class ServiceOsProxyHandler(http.server.BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'service': 'Bao Hanh PRO ServiceOS Proxy'}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path in ['/api/sync-serviceos', '/api/sync-serviceos/']:
            try:
                content_len = int(self.headers.get('Content-Length', 0))
                post_body = self.rfile.read(content_len)
                body = json.loads(post_body.decode('utf-8'))
                username = body.get('username', '').strip()
                password = body.get('password', '')

                if not username or not password:
                    self.send_json({'success': False, 'error': 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu ServiceOS!'}, 400)
                    return

                # 1. Login to ServiceOS
                ctx = ssl.create_default_context()
                login_url = 'https://att-serviceos.anthinhtech.vn/api/auth/login'
                login_data = json.dumps({'username': username, 'password': password}).encode('utf-8')
                login_req = urllib.request.Request(login_url, data=login_data, headers={
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://att-serviceos.anthinhtech.vn',
                    'Referer': 'https://att-serviceos.anthinhtech.vn/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }, method='POST')

                try:
                    with urllib.request.urlopen(login_req, context=ctx, timeout=15) as login_res:
                        # Extract cookies
                        cookie_headers = login_res.headers.get_all('Set-Cookie', [])
                        cookie_str = '; '.join([c.split(';')[0].strip() for c in cookie_headers])
                except urllib.error.HTTPError as e:
                    err_msg = 'Tên đăng nhập hoặc mật khẩu ServiceOS không đúng!' if e.code == 401 else f'Lỗi ServiceOS (HTTP {e.code})'
                    try:
                        err_json = json.loads(e.read().decode('utf-8'))
                        if 'error' in err_json:
                            err_msg = err_json['error']
                    except Exception:
                        pass
                    self.send_json({'success': False, 'error': err_msg}, e.code if e.code == 401 else 502)
                    return

                # 2. Fetch all active work orders
                all_orders = []
                page = 1
                page_size = 200
                total_count = 0

                while page <= 25:
                    wo_url = f'https://att-serviceos.anthinhtech.vn/api/work-orders?status=active&page={page}&page_size={page_size}'
                    wo_req = urllib.request.Request(wo_url, headers={
                        'Accept': 'application/json',
                        'Cookie': cookie_str,
                        'Origin': 'https://att-serviceos.anthinhtech.vn',
                        'Referer': 'https://att-serviceos.anthinhtech.vn/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    })

                    with urllib.request.urlopen(wo_req, context=ctx, timeout=20) as wo_res:
                        wo_data = json.loads(wo_res.read().decode('utf-8'))
                        rows = wo_data.get('rows') or wo_data.get('items') or []
                        if not rows:
                            break
                        all_orders.extend(rows)
                        total_count = wo_data.get('total') or len(all_orders)
                        if len(all_orders) >= total_count or len(rows) < page_size:
                            break
                        page += 1

                # 3. Kéo chi tiết Lệnh BH & ĐXBH (Dealer Portal) cho các xe bảo hành
                warranty_orders = [
                    w for w in all_orders
                    if (w.get('warranty_kinds') and len(w['warranty_kinds']) > 0)
                    or (w.get('faults') and len(w['faults']) > 0)
                    or w.get('warranty_status')
                    or w.get('battery_serial_old')
                    or w.get('motor_serial_old')
                    or w.get('dms_warranty_code')
                ]

                if warranty_orders:
                    with ThreadPoolExecutor(max_workers=10) as executor:
                        futures = [
                            executor.submit(enrich_warranty_order, w, cookie_str, ctx)
                            for w in warranty_orders
                        ]
                        for f in futures:
                            try:
                                f.result()
                            except Exception:
                                pass

                self.send_json({
                    'success': True,
                    'count': len(all_orders),
                    'total': total_count,
                    'orders': all_orders
                })

            except Exception as e:
                self.send_json({'success': False, 'error': f'Lỗi kết nối: {str(e)}'}, 500)
        else:
            self.send_response(404)
            self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def log_message(self, format, *args):
        # Quiet log
        pass

if __name__ == '__main__':
    with socketserver.ThreadingTCPServer(('127.0.0.1', PORT), ServiceOsProxyHandler) as httpd:
        print(f"ServiceOS Proxy running on http://127.0.0.1:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
