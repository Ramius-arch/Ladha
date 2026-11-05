import os
import sys
import json
import time
import base64
import hashlib
import hmac
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3001
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(ROOT_DIR, "assets", "uploads")
DATA_DIR = os.path.join(ROOT_DIR, "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

def read_json_data(filepath, fallback):
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[API] Error reading {filepath}: {e}")
            return fallback
    return fallback

def write_json_data(filepath, data):
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"[API] Error writing {filepath}: {e}")
        return False

AUTH_SECRET = "ladha_nairobi_archive_254_secret_key_v1"
VALID_PASSCODE = "2540"
RATE_LIMIT_MAP = {} # ip -> {'attempts': int, 'lockedUntil': float}

def hash_ip(ip):
    return hashlib.sha256(f"{ip}_ladha_salt".encode()).hexdigest()

def make_token(ip):
    payload = {
        'sub': 'store_manager',
        'ipHash': hash_ip(ip),
        'iat': int(time.time() * 1000),
        'exp': int((time.time() + 8 * 3600) * 1000)
    }
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    sig = hmac.new(AUTH_SECRET.encode(), payload_b64.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).decode().rstrip('=')
    return f"{payload_b64}.{sig_b64}"

def verify_token(token, ip):
    if not token or '.' not in token:
        return False, 'MALFORMED'
    parts = token.split('.')
    if len(parts) != 2:
        return False, 'MALFORMED'
    payload_b64, sig_b64 = parts
    pad = '=' * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 else ''
    pad_s = '=' * (4 - len(sig_b64) % 4) if len(sig_b64) % 4 else ''
    sig_check = hmac.new(AUTH_SECRET.encode(), payload_b64.encode(), hashlib.sha256).digest()
    sig_check_b64 = base64.urlsafe_b64encode(sig_check).decode().rstrip('=')
    if sig_b64 != sig_check_b64:
        return False, 'INVALID_SIG'
    try:
        data = json.loads(base64.urlsafe_b64decode(payload_b64 + pad).decode())
    except:
        return False, 'DECODE_ERROR'
    if time.time() * 1000 > data.get('exp', 0):
        return False, 'EXPIRED'
    if data.get('ipHash') != hash_ip(ip):
        return False, 'IP_MISMATCH'
    return True, data

class LadhaServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def get_client_ip(self):
        forwarded = self.headers.get('x-forwarded-for')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return self.headers.get('x-real-ip', self.client_address[0])

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; font-src 'self' https://fonts.gstatic.com https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; connect-src 'self' http://localhost:5000 http://localhost:3001 https: ws: wss:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:;")
        self.send_header('Connection', 'close')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        client_ip = self.get_client_ip()

        # Handle Chrome DevTools internal probe
        if parsed.path.startswith('/.well-known'):
            self.send_response(204)
            self.end_headers()
            return

        # Clean URL rewrites (e.g. /checkout -> /checkout.html, /shop -> /shop.html)
        clean_routes = {
            '/checkout': '/checkout.html',
            '/shop': '/shop.html',
            '/admin': '/admin.html',
            '/about': '/about.html',
            '/legal': '/legal.html',
            '/product': '/product.html'
        }
        if parsed.path in clean_routes:
            self.path = clean_routes[parsed.path] + (f"?{parsed.query}" if parsed.query else "")
            parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/api/auth':
            query = urllib.parse.parse_qs(parsed.query)
            action = query.get('action', ['status'])[0]

            if action == 'status':
                rec = RATE_LIMIT_MAP.get(client_ip, {'attempts': 0, 'lockedUntil': 0})
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': True,
                    'clientIp': client_ip,
                    'authProtocol': 'HMAC-SHA256 IP-Bound Tokens',
                    'attempts': rec['attempts'],
                    'maxAttempts': 5
                }).encode('utf-8'))
                return

            if action == 'verify':
                auth_h = self.headers.get('Authorization', '')
                token = auth_h.replace('Bearer ', '').strip() or query.get('token', [''])[0]
                ok, res = verify_token(token, client_ip)
                status_code = 200 if ok else (403 if res == 'IP_MISMATCH' else 401)
                self.send_response(status_code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'success': ok,
                    'valid': ok,
                    'reason': res if not ok else None,
                    'clientIp': client_ip
                }).encode('utf-8'))
                return

        if self.path == '/api/media':
            media_items = []
            categories = {
                'products': 'PRODUCTS',
                'lookbook': 'LOOKBOOK',
                'feed': 'FEED',
                'videos': 'VIDEOS',
                'uploads': 'UPLOADS'
            }
            valid_exts = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mov'}
            assets_root = os.path.join(ROOT_DIR, 'assets')
            if os.path.exists(assets_root):
                for folder, cat_label in categories.items():
                    target_dir = os.path.join(assets_root, folder)
                    if os.path.exists(target_dir):
                        for f in os.listdir(target_dir):
                            ext = os.path.splitext(f)[1].lower()
                            if ext in valid_exts:
                                full_path = os.path.join(target_dir, f)
                                if os.path.isfile(full_path):
                                    size_bytes = os.path.getsize(full_path)
                                    is_video = ext in {'.mp4', '.webm', '.mov'}
                                    media_items.append({
                                        'name': f,
                                        'path': f'assets/{folder}/{f}',
                                        'category': cat_label,
                                        'folder': folder,
                                        'extension': ext.replace('.', '').upper(),
                                        'size': size_bytes,
                                        'isVideo': is_video
                                    })
        if parsed.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'status': 'ok',
                'service': 'ladha-storefront-api',
                'version': '1.0.0',
                'clientIp': client_ip
            }).encode('utf-8'))
            return

        if parsed.path == '/api/products':
            products = read_json_data(PRODUCTS_FILE, [])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'products': products, 'total': len(products)}).encode('utf-8'))
            return

        if parsed.path.startswith('/api/products/'):
            product_id = parsed.path.replace('/api/products/', '').strip('/')
            products = read_json_data(PRODUCTS_FILE, [])
            prod = next((p for p in products if p.get('id') == product_id), None)
            if prod:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'product': prod}).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Product not found', 'id': product_id}).encode('utf-8'))
            return

        if parsed.path == '/api/orders':
            orders = read_json_data(ORDERS_FILE, [])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'orders': orders, 'total': len(orders)}).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
        client_ip = self.get_client_ip()
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == '/api/auth':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body) if body else {}
                action = payload.get('action', 'login')

                now = time.time()
                rec = RATE_LIMIT_MAP.setdefault(client_ip, {'attempts': 0, 'lockedUntil': 0})

                if rec['lockedUntil'] > now:
                    rem = int(rec['lockedUntil'] - now)
                    self.send_response(429)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': False,
                        'error': 'RATE_LIMITED',
                        'message': f"IP {client_ip} locked out. Retry in {rem}s",
                        'clientIp': client_ip
                    }).encode('utf-8'))
                    return

                if action == 'login':
                    passcode = str(payload.get('passcode', '')).strip()
                    if passcode != VALID_PASSCODE:
                        rec['attempts'] += 1
                        if rec['attempts'] >= 5:
                            rec['lockedUntil'] = now + 900
                            self.send_response(429)
                            self.send_header('Content-Type', 'application/json')
                            self.end_headers()
                            self.wfile.write(json.dumps({
                                'success': False,
                                'error': 'RATE_LIMITED',
                                'message': f"5 failed attempts. IP {client_ip} locked for 15 minutes.",
                                'clientIp': client_ip
                            }).encode('utf-8'))
                            return

                        self.send_response(401)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            'success': False,
                            'error': 'INVALID_CREDENTIALS',
                            'message': f"Passcode incorrect. Attempt {rec['attempts']}/5",
                            'clientIp': client_ip
                        }).encode('utf-8'))
                        return

                    rec['attempts'] = 0
                    rec['lockedUntil'] = 0
                    token = make_token(client_ip)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'token': token,
                        'clientIp': client_ip,
                        'message': 'Token issued and bound to client IP.'
                    }).encode('utf-8'))
                    return

                if action == 'verify':
                    token = payload.get('token', '')
                    ok, res = verify_token(token, client_ip)
                    status_code = 200 if ok else (403 if res == 'IP_MISMATCH' else 401)
                    self.send_response(status_code)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': ok,
                        'valid': ok,
                        'reason': res if not ok else None,
                        'clientIp': client_ip
                    }).encode('utf-8'))
                    return

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
                return

        if self.path == '/api/upload':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body)
                raw_filename = payload.get('filename', 'upload.bin')
                data_uri = payload.get('data', '')

                if ',' in data_uri:
                    b64_data = data_uri.split(',', 1)[1]
                else:
                    b64_data = data_uri

                file_bytes = base64.b64decode(b64_data)
                
                clean_name = os.path.basename(raw_filename).replace(' ', '_')
                timestamp = int(time.time() * 1000)
                safe_name = f"{timestamp}_{clean_name}"
                dest_path = os.path.join(UPLOAD_DIR, safe_name)

                with open(dest_path, 'wb') as f:
                    f.write(file_bytes)

                rel_url = f"assets/uploads/{safe_name}"
                ext = os.path.splitext(clean_name)[1].lower()
                is_video = ext in {'.mp4', '.webm', '.mov'}

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                resp = {
                    'success': True,
                    'url': rel_url,
                    'filename': safe_name,
                    'originalName': clean_name,
                    'size': len(file_bytes),
                    'isVideo': is_video
                }
                self.wfile.write(json.dumps(resp).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
                return

        if parsed.path.startswith('/api/products/') and parsed.path.endswith('/stock'):
            try:
                parts = parsed.path.strip('/').split('/')
                product_id = parts[2]
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body) if body else {}

                new_stock = payload.get('inStock', False)
                reason = payload.get('reason', 'ORDER_RESERVED')

                products = read_json_data(PRODUCTS_FILE, [])
                target = None
                for p in products:
                    if p.get('id') == product_id:
                        p['inStock'] = new_stock
                        p['stockReason'] = reason
                        p['lastStockUpdate'] = time.time()
                        target = p
                        break

                if target:
                    write_json_data(PRODUCTS_FILE, products)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'product': target,
                        'message': f"Product {product_id} stock set to {new_stock} ({reason})"
                    }).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'error': 'Product not found'}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
                return

        if parsed.path == '/api/orders':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                new_order = json.loads(body) if body else {}

                if not new_order.get('id'):
                    new_order['id'] = f"LADHA-ORD-{int(time.time())}"

                orders = read_json_data(ORDERS_FILE, [])
                orders.insert(0, new_order)
                write_json_data(ORDERS_FILE, orders)

                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'order': new_order}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', PORT), LadhaServerHandler)
    print(f"LADHA Multithreaded Server running on http://localhost:{PORT}")
    server.serve_forever()
