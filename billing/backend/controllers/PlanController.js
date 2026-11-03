const { ErrorHandler } = require('../utlis/errorHandler');
const db = require('../models'); // Import models from the centralized index.js
const Plan = db.Plan;

async function getPlans(req, res) {
  try {
    const plans = await Plan.findAll();
    return res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch plans' });
  }
}

module.exports = {
  getPlans,
};
