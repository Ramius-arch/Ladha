/**
 * LADHA — Hardened Vercel Serverless Admin Authentication (/api/auth)
 *
 * Security properties:
 * - Fail-closed in production: requires ADMIN_PASSCODE (>= 8 chars) and ADMIN_SECRET (>= 32 chars).
 * - Constant-time verification via SHA-256 + crypto.timingSafeEqual (immune to timing attacks).
 * - Issues HMAC-SHA256 signed HttpOnly, Secure, SameSite=Strict session cookies (immune to XSS token theft & CSRF).
 * - Strict same-origin validation on state-changing requests (POST/DELETE).
 * - Per-IP sliding-window brute-force lockout (5 attempts -> 15-minute cooldown).
 */

import crypto from 'node:crypto';

const COOKIE_NAME = 'ladha_admin_session';
const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// Per-instance brute-force limiter (use Vercel WAF rate-limiting in production for global edge enforcement)
const failedAttempts = new Map();

function isProduction() {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}

function getAuthConfig() {
  const passcode = (process.env.ADMIN_PASSCODE || '').trim();
  const secret = (process.env.ADMIN_SECRET || '').trim();

  if (!passcode || !secret) {
    return {
      configured: false,
      reason: 'ADMIN_PASSCODE and ADMIN_SECRET environment variables must be set in Vercel Project Settings.',
    };
  }
  if (isProduction() && (passcode.length < 8 || secret.length < 32)) {
    return {
      configured: false,
      reason: 'Production requires ADMIN_PASSCODE (>= 8 chars) and ADMIN_SECRET (>= 32 chars).',
    };
  }
  return { configured: true, passcode, secret };
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      ...extraHeaders,
    },
  });
}

function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

function hmacHex(secret, value) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function constantTimeEquals(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function isSameOrigin(request) {
  const host = request.headers.get('host');
  if (!host) return false;
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return false;
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(val);
  }
  return out;
}

function signSession(secret, ipHash) {
  const now = Date.now();
  const exp = now + TOKEN_TTL_SECONDS * 1000;
  const payload = { sub: 'ladha_controller', ipHash, iat: now, exp };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return { token: `${payloadB64}.${sig}`, exp };
}

function verifySession(token, secret, currentIpHash) {
  if (!token || typeof token !== 'string') return { valid: false, reason: 'NO_SESSION' };
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0 || dotIdx === token.length - 1) return { valid: false, reason: 'MALFORMED' };

  const payloadB64 = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

  const sigBuf = Buffer.from(sig, 'utf8');
  const expBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, reason: 'INVALID_SIGNATURE' };
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'CORRUPT_PAYLOAD' };
  }

  if (!payload || typeof payload.exp !== 'number' || Date.now() > payload.exp) {
    return { valid: false, reason: 'EXPIRED' };
  }

  if (!constantTimeEquals(payload.ipHash || '', currentIpHash)) {
    return { valid: false, reason: 'IP_MISMATCH' };
  }

  return { valid: true, exp: payload.exp, role: 'controller' };
}

function buildCookieHeader(value, maxAgeSeconds, isSecure) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isSecure) parts.push('Secure');
  return parts.join('; ');
}

function isHttpsRequest(request) {
  const proto = request.headers.get('x-forwarded-proto');
  if (proto) return proto === 'https';
  try {
    return new URL(request.url).protocol === 'https:';
  } catch {
    return isProduction();
  }
}

export async function GET(request) {
  try {
    const cfg = getAuthConfig();
    if (!cfg.configured) {
      return jsonResponse({ authenticated: false, configured: false, error: cfg.reason }, 503);
    }

    const cookies = parseCookies(request.headers.get('cookie'));
    const token = cookies[COOKIE_NAME];
    const ipHash = hmacHex(cfg.secret, `ip:${getClientIp(request)}`);
    const result = verifySession(token, cfg.secret, ipHash);

    if (!result.valid) {
      return jsonResponse({ authenticated: false, configured: true, reason: result.reason }, 401);
    }

    return jsonResponse({
      authenticated: true,
      configured: true,
      role: result.role,
      expiresAt: result.exp,
    });
  } catch (err) {
    console.error('[api/auth GET] error:', err);
    return jsonResponse({ authenticated: false, error: 'Internal authentication error.' }, 500);
  }
}

export async function POST(request) {
  try {
    if (!isSameOrigin(request)) {
      return jsonResponse({ authenticated: false, error: 'Cross-origin request rejected.' }, 403);
    }

    const cfg = getAuthConfig();
    if (!cfg.configured) {
      return jsonResponse({ authenticated: false, configured: false, error: cfg.reason }, 503);
    }

    const ipHash = hmacHex(cfg.secret, `ip:${getClientIp(request)}`);
    const now = Date.now();
    const record = failedAttempts.get(ipHash) || { count: 0, lockedUntil: 0 };

    if (record.lockedUntil > now) {
      const retrySecs = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
      const retryMins = Math.ceil(retrySecs / 60);
      return jsonResponse(
        {
          authenticated: false,
          locked: true,
          error: `Too many failed attempts. Terminal locked for ${retryMins} minute(s).`,
        },
        429,
        { 'Retry-After': String(retrySecs) }
      );
    }

    let body = {};
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ authenticated: false, error: 'Invalid JSON request body.' }, 400);
    }

    const submitted = typeof body.passcode === 'string' ? body.passcode.trim() : '';
    if (!submitted) {
      return jsonResponse({ authenticated: false, error: 'Passcode is required.' }, 400);
    }

    if (!constantTimeEquals(submitted, cfg.passcode)) {
      record.count += 1;
      if (record.count >= MAX_FAILED_ATTEMPTS) {
        record.lockedUntil = now + LOCKOUT_MS;
        failedAttempts.set(ipHash, record);
        return jsonResponse(
          {
            authenticated: false,
            locked: true,
            error: 'Maximum failed attempts exceeded. Locked for 15 minutes.',
          },
          429,
          { 'Retry-After': String(Math.floor(LOCKOUT_MS / 1000)) }
        );
      }

      failedAttempts.set(ipHash, record);
      const remaining = MAX_FAILED_ATTEMPTS - record.count;
      return jsonResponse(
        {
          authenticated: false,
          error: `Invalid admin credentials. ${remaining} attempt(s) remaining before lockout.`,
        },
        401
      );
    }

    failedAttempts.delete(ipHash);
    const { token, exp } = signSession(cfg.secret, ipHash);
    const cookieHeader = buildCookieHeader(token, TOKEN_TTL_SECONDS, isHttpsRequest(request));

    return jsonResponse(
      {
        authenticated: true,
        configured: true,
        role: 'controller',
        expiresAt: exp,
      },
      200,
      { 'Set-Cookie': cookieHeader }
    );
  } catch (err) {
    console.error('[api/auth POST] error:', err);
    return jsonResponse({ authenticated: false, error: 'Authentication verification failed.' }, 500);
  }
}

export async function DELETE(request) {
  try {
    if (!isSameOrigin(request)) {
      return jsonResponse({ authenticated: false, error: 'Cross-origin request rejected.' }, 403);
    }

    const clearCookie = buildCookieHeader('', 0, isHttpsRequest(request));
    return jsonResponse({ authenticated: false }, 200, { 'Set-Cookie': clearCookie });
  } catch (err) {
    console.error('[api/auth DELETE] error:', err);
    return jsonResponse({ authenticated: false, error: 'Logout failed.' }, 500);
  }
}
