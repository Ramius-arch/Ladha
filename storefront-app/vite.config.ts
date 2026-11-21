import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'node:crypto';
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
      // Local-dev-only /api/auth bridge mirroring root api/auth.mjs HttpOnly cookie contract
      const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
      const usingDefaultPasscode = envPasscode.length === 0;
      const devPasscode = usingDefaultPasscode ? 'Ladha@Nbo#2026!' : envPasscode;
      const envSecret = (process.env.ADMIN_SECRET || '').trim();
      const usingDefaultSecret = envSecret.length < 32;
      const devSecret = usingDefaultSecret ? crypto.randomBytes(32).toString('hex') : envSecret;
      const devRecoveryKey = (process.env.ADMIN_RECOVERY_KEY || '').trim();
      const hasRecoveryKey = devRecoveryKey.length >= 12;
      const COOKIE_NAME = 'ladha_admin_session';
      const SHORT_TTL = 2 * 60 * 60;
      const EXTENDED_TTL = 8 * 60 * 60;
      const LOCKOUT_MS = 15 * 60 * 1000;
      const devAttempts = new Map<string, { count: number; lockedUntil: number }>();

      const sendJson = (res: ServerResponse, status: number, body: Record<string, unknown>, extraHeaders: Record<string, string> = {}) => {
        res.writeHead(status, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          ...extraHeaders,
        });
        res.end(JSON.stringify(body));
      };

      const ctEqual = (a: string, b: string) =>
        crypto.timingSafeEqual(
          crypto.createHash('sha256').update(a).digest(),
          crypto.createHash('sha256').update(b).digest()
        );

      const parseCookies = (header?: string) => {
        const out: Record<string, string> = {};
        if (!header) return out;
        for (const p of header.split(';')) {
          const i = p.indexOf('=');
          if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
        }
        return out;
      };

      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const cleanUrl = (req.url || '').split('?')[0];
        if (cleanUrl === '/api/auth') {
          const ip = req.socket.remoteAddress || '127.0.0.1';
          const ipHash = crypto.createHmac('sha256', devSecret).update(`ip:${ip}`).digest('hex');

          if (req.method === 'GET') {
            const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
            if (!token || !token.includes('.')) {
              sendJson(res, 401, { authenticated: false, configured: true, hasRecoveryKey, reason: 'NO_SESSION' });
              return;
            }
            const [payloadB64, sig] = token.split('.');
            const expectedSig = crypto.createHmac('sha256', devSecret).update(payloadB64).digest('base64url');
            if (!ctEqual(sig, expectedSig)) {
              sendJson(res, 401, { authenticated: false, configured: true, hasRecoveryKey, reason: 'INVALID_SIGNATURE' });
              return;
            }
            try {
              const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
              if (Date.now() > payload.exp || !ctEqual(payload.ipHash || '', ipHash)) {
                sendJson(res, 401, { authenticated: false, configured: true, hasRecoveryKey, reason: 'EXPIRED' });
                return;
              }
              sendJson(res, 200, {
                authenticated: true,
                configured: true,
                role: 'controller',
                expiresAt: payload.exp,
                recoveryMode: Boolean(payload.recoveryMode),
                usingDefaultPasscode,
                usingDefaultSecret,
              });
            } catch {
              sendJson(res, 401, { authenticated: false, configured: true, hasRecoveryKey, reason: 'CORRUPT' });
            }
            return;
          }

          if (req.method === 'DELETE') {
            sendJson(res, 200, { authenticated: false }, {
              'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`,
            });
            return;
          }

          if (req.method === 'POST') {
            const chunks: Buffer[] = [];
            req.on('data', (c) => chunks.push(Buffer.from(c)));
            req.on('end', () => {
              const now = Date.now();
              const rec = devAttempts.get(ipHash) || { count: 0, lockedUntil: 0 };
              if (rec.lockedUntil > now) {
                const retrySecs = Math.max(1, Math.ceil((rec.lockedUntil - now) / 1000));
                sendJson(res, 429, {
                  authenticated: false,
                  locked: true,
                  retryAfterSeconds: retrySecs,
                  remainingAttempts: 0,
                  error: `Too many failed attempts. Terminal locked for ${Math.ceil(retrySecs / 60)} minute(s).`,
                });
                return;
              }
              let passcode = '';
              let mode: 'passcode' | 'recovery' = 'passcode';
              let rememberMe = false;
              try {
                const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                passcode = typeof parsed.passcode === 'string' ? parsed.passcode.trim() : '';
                mode = parsed.mode === 'recovery' ? 'recovery' : 'passcode';
                rememberMe = Boolean(parsed.rememberMe);
              } catch {
                sendJson(res, 400, { authenticated: false, error: 'Invalid JSON.' });
                return;
              }

              if (!passcode) {
                sendJson(res, 400, { authenticated: false, error: 'Passphrase is required.' });
                return;
              }

              let matched = false;
              if (mode === 'recovery') {
                if (!hasRecoveryKey) {
                  sendJson(res, 400, {
                    authenticated: false,
                    error: 'No backup recovery key is configured. Reset ADMIN_PASSCODE via Vercel Dashboard.',
                  });
                  return;
                }
                matched = ctEqual(passcode, devRecoveryKey);
              } else {
                matched = ctEqual(passcode, devPasscode);
              }

              if (!matched) {
                rec.count += 1;
                if (rec.count >= 5) rec.lockedUntil = now + LOCKOUT_MS;
                devAttempts.set(ipHash, rec);
                const remaining = Math.max(0, 5 - rec.count);
                sendJson(res, rec.count >= 5 ? 429 : 401, {
                  authenticated: false,
                  locked: rec.count >= 5,
                  retryAfterSeconds: rec.count >= 5 ? Math.floor(LOCKOUT_MS / 1000) : undefined,
                  remainingAttempts: remaining,
                  error: rec.count >= 5
                    ? 'Maximum failed attempts exceeded. Locked for 15 minutes.'
                    : `Invalid admin passphrase. ${remaining} attempt(s) remaining before 15-min lockout.`,
                });
                return;
              }
              devAttempts.delete(ipHash);
              const ttl = mode === 'recovery' ? 30 * 60 : rememberMe ? EXTENDED_TTL : SHORT_TTL;
              const exp = now + ttl * 1000;
              const payloadB64 = Buffer.from(
                JSON.stringify({ sub: 'ladha_controller', ipHash, iat: now, exp, recoveryMode: mode === 'recovery' })
              ).toString('base64url');
              const sig = crypto.createHmac('sha256', devSecret).update(payloadB64).digest('base64url');
              sendJson(
                res,
                200,
                {
                  authenticated: true,
                  configured: true,
                  role: 'controller',
                  expiresAt: exp,
                  recoveryMode: mode === 'recovery',
                  usingDefaultPasscode,
                  usingDefaultSecret,
                },
                { 'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(`${payloadB64}.${sig}`)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${ttl}` }
              );
            });
            return;
          }
        }

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
