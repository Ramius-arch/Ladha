const redis = require('../config/redis');
const logger = require('../utlis/logger');

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    if (!redis) {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    
    try {
      const cachedResponse = await redis.get(key);
      
      if (cachedResponse) {
        logger.info(`Cache hit for ${key}`);
        res.setHeader('Content-Type', 'application/json');
        return res.send(cachedResponse);
      } else {
        logger.info(`Cache miss for ${key}`);
        res.sendResponse = res.send;
        res.send = (body) => {
          if (res.statusCode === 200) {
            redis.set(key, body, 'EX', duration);
          }
          res.sendResponse(body);
        };
        next();
      }
    } catch (err) {
      logger.error('Cache middleware error:', err);
      next();
    }
  };
};

const clearCache = async (pattern = '*') => {
  if (!redis) return;
  try {
    const keys = await redis.keys(`__express__${pattern}`);
    if (keys.length > 0) {
      await redis.del(keys);
      logger.info(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (err) {
    logger.error('Error clearing cache:', err);
  }
};

module.exports = { cacheMiddleware, clearCache };
