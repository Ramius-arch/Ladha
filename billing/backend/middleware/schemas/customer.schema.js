const Joi = require('joi');

const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    email: Joi.string().email().allow(null, ''),
    address: Joi.string().required(),
    planId: Joi.number().integer().required(),
    status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
});

module.exports = {
    customerSchema,
};
