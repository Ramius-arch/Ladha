import os
import sys
import json
import time
import base64
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3001
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(ROOT_DIR, "assets", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class LadhaServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Connection', 'close')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
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
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'media': media_items}).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
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

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', PORT), LadhaServerHandler)
    print(f"LADHA Multithreaded Server running on http://localhost:{PORT}")
    server.serve_forever()
