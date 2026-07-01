const Setting = require('../models/Setting');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find().sort({ categorie: 1, key: 1 });

    // Transform into object by category
    const grouped = {};
    settings.forEach(s => {
      if (!grouped[s.categorie]) grouped[s.categorie] = {};
      grouped[s.categorie][s.key] = s.value;
    });

    res.status(200).json({
      success: true,
      settings: grouped,
      settingsList: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { value, description: `Auto-updated: ${key}` },
        { upsert: true, new: true }
      );
    }

    const settings = await Setting.find().sort({ categorie: 1, key: 1 });

    res.status(200).json({
      success: true,
      message: 'Paramètres mis à jour',
      settingsList: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public settings (no auth)
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({
      key: { $in: ['storeName', 'storeDescription', 'contactEmail', 'contactPhone', 'contactAddress', 'socialMedia', 'currency'] }
    });

    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });

    res.status(200).json({
      success: true,
      settings: result
    });
  } catch (error) {
    next(error);
  }
};
