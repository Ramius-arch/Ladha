const db = require('../models');
const SystemConfig = db.SystemConfig;
const asyncHandler = require('../middleware/asyncHandler');

exports.getConfigs = asyncHandler(async (req, res) => {
    const configs = await SystemConfig.findAll();
    res.status(200).json({ success: true, data: configs });
});

exports.updateConfig = asyncHandler(async (req, res) => {
    const { key, value } = req.body;
    let config = await SystemConfig.findOne({ where: { key } });
    if (config) {
        await config.update({ value });
    } else {
        config = await SystemConfig.create({ key, value });
    }
    res.status(200).json({ success: true, data: config });
});
