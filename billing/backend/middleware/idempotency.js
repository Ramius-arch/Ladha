/**
 * RFC-Compliant Idempotency Middleware (Stripe / IETF Standard)
 * Prevents duplicate transactions, double billing, and double stock reservations on network retries.
 */

const crypto = require('crypto');
const db = require('../models');
const IdempotencyRecord = db.IdempotencyRecord;

function idempotency(scope = 'commerce') {
  return async (req, res, next) => {
    // Only apply to state-mutating requests (POST, PUT, PATCH, DELETE)
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const key = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];
    if (!key || typeof key !== 'string' || !key.trim()) {
      // No idempotency key provided - proceed normally
      return next();
    }

    const cleanedKey = String(key).trim();
    const payloadStr = JSON.stringify(req.body || {});
    const requestHash = crypto.createHash('sha256').update(payloadStr).digest('hex');

    try {
      const existing = await IdempotencyRecord.findOne({ where: { key: cleanedKey } });

      if (existing) {
        // Case 1: Concurrent request still processing
        if (existing.status === 'processing') {
          return res.status(409).json({
            success: false,
            error: 'Concurrent mutation in progress with this Idempotency-Key. Please retry in a moment.'
          });
        }

        // Case 2: Payload mismatch with existing key
        if (existing.requestHash && existing.requestHash !== requestHash) {
          return res.status(422).json({
            success: false,
            error: 'Idempotency key re-used with a different request payload. Use a new key for different parameters.'
          });
        }

        // Case 3: Completed response replay
        if (existing.status === 'completed') {
          res.setHeader('X-Idempotency-Replayed', 'true');
          res.setHeader('X-Idempotency-Key', cleanedKey);
          let parsedBody;
          try {
            parsedBody = JSON.parse(existing.responseBody);
          } catch (e) {
            parsedBody = existing.responseBody;
          }
          return res.status(existing.responseStatus || 200).json(parsedBody);
        }
      }

      // Record new in-flight mutation
      const record = await IdempotencyRecord.create({
        key: cleanedKey,
        scope,
        requestHash,
        status: 'processing',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      // Hook into response completion to capture status & response body
      const originalJson = res.json.bind(res);
      const originalSend = res.send.bind(res);

      res.json = (body) => {
        res.setHeader('X-Idempotency-Key', cleanedKey);
        record.responseStatus = res.statusCode;
        record.responseBody = typeof body === 'string' ? body : JSON.stringify(body);
        record.status = (res.statusCode >= 200 && res.statusCode < 400) ? 'completed' : 'failed';
        record.save().catch(err => console.warn('[Idempotency] Save error:', err.message));
        return originalJson(body);
      };

      res.send = (body) => {
        res.setHeader('X-Idempotency-Key', cleanedKey);
        record.responseStatus = res.statusCode;
        record.responseBody = typeof body === 'string' ? body : JSON.stringify(body);
        record.status = (res.statusCode >= 200 && res.statusCode < 400) ? 'completed' : 'failed';
        record.save().catch(err => console.warn('[Idempotency] Save error:', err.message));
        return originalSend(body);
      };

      return next();

    } catch (err) {
      console.warn('[Idempotency] Middleware fallback error:', err.message);
      // Fallback: don't block user if DB record lookup failed
      return next();
    }
  };
}

module.exports = idempotency;
