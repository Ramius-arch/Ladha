const express = require('express');
const router = express.Router();
const configController = require('../controllers/ConfigController');

router.get('/', configController.getConfigs);
router.post('/', configController.updateConfig);

module.exports = router;
