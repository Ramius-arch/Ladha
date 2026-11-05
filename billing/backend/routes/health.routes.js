const express = require('express');
const router = express.Router();
const db = require('../models');
const redis = require('../config/redis');

router.get('/', async (req, res) => {
  const healthStatus = {
    status: 'UP',
    timestamp: new Date(),
    services: {
      database: 'UNKNOWN',
      redis: 'UNKNOWN'
    }
  };

  // Check Database
  try {
    await db.sequelize.authenticate();
    healthStatus.services.database = 'UP';
  } catch (err) {
    healthStatus.services.database = 'DOWN';
    healthStatus.status = 'DEGRADED';
  }

  // Check Redis
  if (redis) {
    try {
      await redis.ping();
      healthStatus.services.redis = 'UP';
    } catch (err) {
      healthStatus.services.redis = 'DOWN';
      healthStatus.status = 'DEGRADED';
    }
  } else {
    healthStatus.services.redis = 'DISABLED';
  }

  const statusCode = healthStatus.status === 'UP' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

module.exports = router;
