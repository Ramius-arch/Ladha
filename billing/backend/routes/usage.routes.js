const express = require('express');
const router = express.Router();
const { UsageController } = require('../controllers/Usage/usage_controller.js');

// Authentication middleware
const auth = require('../middleware/auth.js');

router.get('/', UsageController.getAllUsage);
router.post('/', UsageController.createUsage);
router.put('/:id', UsageController.updateUsage);
router.delete('/:id', UsageController.deleteUsage);

// Additional routes for filtering usage logs
router.get('/customer/:customerId', UsageController.getUsageByCustomer);
router.get('/type/call', UsageController.getCallUsage);
router.get('/type/sms', UsageController.getSMSUsage);

module.exports = router;
