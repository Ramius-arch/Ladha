const express = require('express');
const router = express.Router();
const planController = require('../controllers/PlanController');

router.get('/', planController.getPlans);

module.exports = router;
