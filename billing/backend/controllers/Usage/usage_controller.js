const { ErrorHandler } = require('../../utlis/errorHandler');
const db = require('../../models'); // Import models from the centralized index.js
const { clearCache } = require('../../middleware/cacheHandler');
const UsageLog = db.UsageLog;
const Customer = db.Customer;
const Plan = db.Plan;

exports.UsageController = {
    async getAllUsage(req, res) {
        try {
            const usageLogs = await UsageLog.findAll({
                include: [
                    { model: Customer, attributes: ['name', 'email'] },
                    { model: Plan, attributes: ['name'] }
                ]
            });
            return res.status(200).json(usageLogs);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch usage logs' });
        }
    },

    async getUsageById(req, res) {
        try {
            const { id } = req.params;
            const usageLog = await UsageLog.findByPk(parseInt(id), {
                include: [
                    { model: Customer, attributes: ['name', 'email'] },
                    { model: Plan, attributes: ['name'] }
                ]
            });
            if (!usageLog) {
                return res.status(404).json({ error: 'Usage log not found' });
            }
            return res.status(200).json(usageLog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch usage log details' });
        }
    },

    async createUsage(req, res) {
        try {
            const { customerId, planId, usageType, duration } = req.body;
            if (!customerId || !planId || !usageType || !duration) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const newUsage = await UsageLog.create({
                customerId,
                planId,
                usageType,
                duration,
                timestamp: new Date(),
            });
            clearCache('/api/reports*');
            return res.status(201).json(newUsage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create usage log' });
        }
    },

    async updateUsage(req, res) {
        try {
            const { id } = req.params;
            const [updatedRows] = await UsageLog.update(req.body, {
                where: { id: parseInt(id) }
            });
            if (updatedRows === 0) {
                return res.status(404).json({ error: 'Usage log not found or no changes made' });
            }
            const updatedUsage = await UsageLog.findByPk(parseInt(id));
            clearCache('/api/reports*');
            return res.status(200).json(updatedUsage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update usage log' });
        }
    },

    async deleteUsage(req, res) {
        try {
            const { id } = req.params;
            const deletedRows = await UsageLog.destroy({
                where: { id: parseInt(id) }
            });
            if (deletedRows === 0) {
                return res.status(404).json({ error: 'Usage log not found' });
            }
            clearCache('/api/reports*');
            return res.status(204).send(); // No content for successful deletion
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete usage log' });
        }
    },

    async getUsageByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const customerUsage = await UsageLog.findAll({
                where: { customerId: parseInt(customerId) },
                include: [
                    { model: Customer, attributes: ['name', 'email'] },
                    { model: Plan, attributes: ['name'] }
                ]
            });
            return res.status(200).json(customerUsage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch usage logs by customer' });
        }
    },

    async getCallUsage(req, res) {
        try {
            const callUsage = await UsageLog.findAll({
                where: { usageType: 'call' },
                include: [
                    { model: Customer, attributes: ['name', 'email'] },
                    { model: Plan, attributes: ['name'] }
                ]
            });
            return res.status(200).json(callUsage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch call usage logs' });
        }
    },

    async getSMSUsage(req, res) {
        try {
            const smsUsage = await UsageLog.findAll({
                where: { usageType: 'sms' },
                include: [
                    { model: Customer, attributes: ['name', 'email'] },
                    { model: Plan, attributes: ['name'] }
                ]
            });
            return res.status(200).json(smsUsage);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch SMS usage logs' });
        }
    },
};
