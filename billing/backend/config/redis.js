const Redis = require('ioredis');
const logger = require('../utlis/logger');

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
  
  redis.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
  });
} else {
  logger.warning('REDIS_URL not found. Caching will be disabled.');
}

module.exports = redis;
