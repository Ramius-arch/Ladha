import os
import re

# 1. Patch storefront/server.py
server_py_path = os.path.join(os.path.dirname(__file__), '..', 'storefront', 'server.py')
with open(server_py_path, 'r', encoding='utf-8') as f:
    server_py = f.read()

# Update end_headers to include CSP
old_end_headers = """    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Connection', 'close')
        super().end_headers()"""

new_end_headers = """    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; font-src 'self' https://fonts.gstatic.com https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; connect-src 'self' http://localhost:5000 http://localhost:3001 https: ws: wss:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:;")
        self.send_header('Connection', 'close')
        super().end_headers()"""

# Update do_GET to include clean URLs and silence .well-known
old_do_get = """    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        client_ip = self.get_client_ip()"""

new_do_get = """    def do_GET(self):
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
            parsed = urllib.parse.urlparse(self.path)"""

if old_end_headers in server_py:
    server_py = server_py.replace(old_end_headers, new_end_headers, 1)
    print("Patched end_headers in server.py")

if old_do_get in server_py:
    server_py = server_py.replace(old_do_get, new_do_get, 1)
    print("Patched do_GET in server.py")

with open(server_py_path, 'w', encoding='utf-8', newline='') as f:
    f.write(server_py)

print("storefront/server.py patch complete.")
