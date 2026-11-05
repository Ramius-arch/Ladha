// Middleware to check if the user is an admin
const Customer = require('../models/Customer');

const isAdmin = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.user.id);
    if (customer && customer.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admins only' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

module.exports = { isAdmin };
