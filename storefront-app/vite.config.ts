import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STOREFRONT_DIR = path.resolve(__dirname, '../storefront');

const MIME_MAP: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.mpeg': 'audio/mpeg',
};

function serveStorefrontAssetsPlugin(): Plugin {
  const serveStatic = (reqUrl: string, res: ServerResponse, rangeHeader?: string) => {
    const cleanPath = reqUrl.split('?')[0];
    let targetPath: string | null = null;

    if (cleanPath.startsWith('/assets/') || cleanPath.startsWith('/data/')) {
      targetPath = path.join(STOREFRONT_DIR, cleanPath.slice(1));
    }

    if (!targetPath || !targetPath.startsWith(STOREFRONT_DIR) || !fs.existsSync(targetPath)) {
      return false;
    }

    const stat = fs.statSync(targetPath);
    if (!stat.isFile()) return false;

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    if (rangeHeader && (ext === '.mp4' || ext === '.webm' || ext === '.mp3')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
      fs.createReadStream(targetPath, { start, end }).pipe(res);
      return true;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(targetPath).pipe(res);
    return true;
  };

  return {
    name: 'ladha-storefront-static-bridge',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url && serveStatic(req.url, res, req.headers.range)) return;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url && serveStatic(req.url, res, req.headers.range)) return;
        next();
      });
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), serveStorefrontAssetsPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'storefront-assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion', 'lenis'],
        },
      },
    },
  },
  server: {
    port: 3002,
    proxy: {
      '/api/stores': { target: 'http://localhost:5000', changeOrigin: true },
      '/api/mpesa': { target: 'http://localhost:5000', changeOrigin: true },
      '/api/commerce': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
