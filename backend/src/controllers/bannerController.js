const Banner = require('../models/Banner');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ 
      isActive: true,
      $or: [
        { startDate: { $lte: new Date() } },
        { startDate: null }
      ],
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: null }
      ]
    })
    .sort({ position: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/all
// @access  Private/Admin
exports.getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ position: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);

    res.status(201).json({
      success: true,
      banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findById(req.params.id);

    if (!banner) {
      return next(new ErrorResponse('Banner non trouvé', 404));
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return next(new ErrorResponse('Banner non trouvé', 404));
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner supprimé'
    });
  } catch (error) {
    next(error);
  }
};
