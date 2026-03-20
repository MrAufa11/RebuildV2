const { Setting } = require('../models');

const SettingController = {
    async getAllPublic(req, res) {
        try {
            const settings = await Setting.findAll();
            // Transform to object { key: value } for easier frontend consumption
            const config = {};
            settings.forEach(s => {
                config[s.key] = s.value;
            });
            return res.status(200).json(config);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching settings', error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = req.body; // Expecting { key: value, key2: value2 }
            const keys = Object.keys(updates);

            for (const key of keys) {
                // Upsert logic
                const [setting, created] = await Setting.findOrCreate({
                    where: { key },
                    defaults: { value: updates[key] }
                });
                if (!created) {
                    await setting.update({ value: updates[key] });
                }
            }
            return res.status(200).json({ message: 'Settings updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error updating settings', error: error.message });
        }
    }
};

module.exports = SettingController;
