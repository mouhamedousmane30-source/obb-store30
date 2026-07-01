const Newsletter = require('../models/Newsletter');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return next(new ErrorResponse('Cet email est déjà abonné', 400));
      } else {
        // Reactivate
        existing.isActive = true;
        existing.subscribedAt = new Date();
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Abonnement réactivé'
        });
      }
    }

    const newsletter = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: 'Abonnement réussi',
      newsletter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   DELETE /api/newsletter/:email
// @access  Public
exports.unsubscribe = async (req, res, next) => {
  try {
    const newsletter = await Newsletter.findOne({ email: req.params.email });

    if (!newsletter) {
      return next(new ErrorResponse('Email non trouvé', 404));
    }

    newsletter.isActive = false;
    await newsletter.save();

    res.status(200).json({
      success: true,
      message: 'Désabonnement réussi'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter
// @access  Private/Admin
exports.getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      subscribers
    });
  } catch (error) {
    next(error);
  }
};
