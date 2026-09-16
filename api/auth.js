/**
 * LADHA — Serverless Token-Based IP Authentication Infrastructure
 * Deployed as a Vercel Serverless Function at /api/auth
 * Handles cryptographic IP-bound session tokens and rate-limited brute force protection.
 */

const crypto = require('crypto');

// Master configuration
const SECRET_KEY = process.env.ADMIN_SECRET || 'ladha_nairobi_archive_254_secret_key_v1';
const VALID_PASSCODE = process.env.ADMIN_PASSCODE || '2540';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory sliding-window IP rate limiter
const rateLimitMap = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || 
         (req.socket && req.socket.remoteAddress) || 
         (req.connection && req.connection.remoteAddress) || 
         '127.0.0.1';
}

function hashIp(ip) {
  return crypto.createHash('sha256').update(ip + '_ladha_salt').digest('hex');
}

function createToken(ip) {
  const payload = {
    sub: 'store_manager',
    ipHash: hashIp(ip),
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payloadB64).digest('base64url');
  return payloadB64 + '.' + signature;
}

function verifyToken(token, currentIp) {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'TOKEN_MISSING' };
  }
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'MALFORMED_TOKEN' };
  }
  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payloadB64).digest('base64url');
  
  if (signature !== expectedSig) {
    return { valid: false, reason: 'INVALID_SIGNATURE' };
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch (e) {
    return { valid: false, reason: 'PAYLOAD_CORRUPT' };
  }

  if (Date.now() > payload.exp) {
    return { valid: false, reason: 'TOKEN_EXPIRED' };
  }

  // Strict IP-Binding verification
  const currentIpHash = hashIp(currentIp);
  if (payload.ipHash !== currentIpHash) {
    return { 
      valid: false, 
      reason: 'IP_MISMATCH', 
      message: 'Client IP does not match token generation IP. Access revoked.' 
    };
  }

  return { valid: true, payload };
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = getClientIp(req);
  const now = Date.now();

  // Rate Limiting Check
  let rateRecord = rateLimitMap.get(clientIp);
  if (!rateRecord) {
    rateRecord = { attempts: 0, lockedUntil: 0 };
    rateLimitMap.set(clientIp, rateRecord);
  }

  if (rateRecord.lockedUntil > now) {
    const remainingSecs = Math.ceil((rateRecord.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMITED',
      message: 'Security Lockout: Too many failed authentication attempts from this IP (' + clientIp + '). Try again in ' + remainingSecs + ' seconds.',
      remainingSecs,
      clientIp
    });
  }

  // Parse Body if needed
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  } else if (!body) {
    body = {};
  }

  const action = (req.query && req.query.action) || body.action || (req.method === 'GET' ? 'status' : 'login');

  // ACTION: STATUS / INSPECT
  if (action === 'status') {
    return res.status(200).json({
      success: true,
      clientIp,
      authProtocol: 'HMAC-SHA256 IP-Bound Tokens',
      attempts: rateRecord.attempts,
      maxAttempts: MAX_FAILED_ATTEMPTS
    });
  }

  // ACTION: LOGIN / ISSUE TOKEN
  if (action === 'login') {
    const passcode = (body.passcode || '').toString().trim();

    if (!passcode) {
      return res.status(400).json({ success: false, error: 'Passcode required.' });
    }

    if (passcode !== VALID_PASSCODE) {
      rateRecord.attempts += 1;
      if (rateRecord.attempts >= MAX_FAILED_ATTEMPTS) {
        rateRecord.lockedUntil = now + LOCKOUT_DURATION_MS;
        return res.status(429).json({
          success: false,
          error: 'RATE_LIMITED',
          message: 'Security Lockout: 5 failed attempts reached from IP ' + clientIp + '. Locked for 15 minutes.',
          clientIp
        });
      }
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Authentication failed. Passcode incorrect. (Attempt ' + rateRecord.attempts + '/' + MAX_FAILED_ATTEMPTS + ')',
        attemptsRemaining: MAX_FAILED_ATTEMPTS - rateRecord.attempts,
        clientIp
      });
    }

    // Passcode Valid: Reset attempts and issue IP-bound token
    rateRecord.attempts = 0;
    rateRecord.lockedUntil = 0;

    const token = createToken(clientIp);

    return res.status(200).json({
      success: true,
      token,
      clientIp,
      expiresInMs: TOKEN_TTL_MS,
      message: 'Token issued and bound to client IP.'
    });
  }

  // ACTION: VERIFY TOKEN
  if (action === 'verify') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '') || body.token || (req.query && req.query.token);

    const verification = verifyToken(token, clientIp);

    if (!verification.valid) {
      return res.status(verification.reason === 'IP_MISMATCH' ? 403 : 401).json({
        success: false,
        valid: false,
        reason: verification.reason,
        message: verification.message || 'Token is not valid.',
        clientIp
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      clientIp,
      expiresAt: verification.payload.exp
    });
  }

  return res.status(400).json({ success: false, error: 'Unknown action: ' + action });
};
