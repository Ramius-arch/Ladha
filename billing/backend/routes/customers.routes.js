// backend/routes/customers.routes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/Customers/customer_contoller');

// Middleware for authentication and authorization
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminMiddleware');

const validate = require('../middleware/validate');
const { customerSchema } = require('../middleware/schemas/customer.schema');

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', validate(customerSchema), customerController.createCustomer);
router.put('/:id', validate(customerSchema), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Route for getting own profile
router.get('/me', async (req, res) => {
  try {
    const customer = await customerController.getCustomerById(1);
    res.status(200).json({
      status: 'success',
      data: customer,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Route for updating own profile
router.put('/me/update-profile', async (req, res) => {
  try {
    const updatedCustomer = await customerController.updateCustomer(1, req.body);
    res.status(200).json({
      status: 'success',
      data: updatedCustomer,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
