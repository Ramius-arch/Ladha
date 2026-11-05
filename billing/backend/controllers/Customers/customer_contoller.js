const { ErrorResponse } = require('../../middleware/errorHandler');
const asyncHandler = require('../../middleware/asyncHandler');
const db = require('../../models');
const { clearCache } = require('../../middleware/cacheHandler');
const Customer = db.Customer;
const Plan = db.Plan;

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res, next) => {
  const { page = 1, pageSize = 10, search, sortBy = 'id', sortOrder = 'asc' } = req.query;
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  const whereClause = {};
  if (search) {
    whereClause[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.like]: `%${search}%` } },
      { email: { [db.Sequelize.Op.like]: `%${search}%` } },
      { phone_number: { [db.Sequelize.Op.like]: `%${search}%` } },
      { address: { [db.Sequelize.Op.like]: `%${search}%` } },
    ];
  }

  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows } = await Customer.findAndCountAll({
    where: whereClause,
    order: orderClause,
    limit: limit,
    offset: offset,
    include: [{
      model: Plan,
      attributes: ['name', 'price']
    }]
  });

  res.status(200).json({
    success: true,
    totalItems: count,
    customers: rows,
    currentPage: parseInt(page, 10),
    totalPages: Math.ceil(count / limit)
  });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByPk(req.params.id, {
    include: [{
      model: Plan,
      attributes: ['name', 'price']
    }]
  });

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res, next) => {
  const customerData = { ...req.body };
  delete customerData.id; // Remove id to let database auto-increment
  
  const customer = await Customer.create(customerData);
  clearCache('/api/reports*');
  res.status(201).json({
    success: true,
    data: customer
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findByPk(req.params.id);

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  await customer.update(req.body);

  // Re-fetch to get any updated fields
  customer = await Customer.findByPk(req.params.id);
  clearCache('/api/reports*');

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByPk(req.params.id);

  if (!customer) {
    return next(new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404));
  }

  await customer.destroy();
  clearCache('/api/reports*');

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

