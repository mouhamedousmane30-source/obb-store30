const Coupon = require('../models/Coupon');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res, next) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return next(new ErrorResponse('Coupon non trouvé', 404));
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return next(new ErrorResponse('Coupon non trouvé', 404));
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coupon supprimé'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, montantTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return next(new ErrorResponse('Coupon invalide', 400));
    }

    if (!coupon.isValid()) {
      return next(new ErrorResponse('Ce coupon a expiré ou n\'est plus valide', 400));
    }

    // Check if user already used this coupon
    if (coupon.utilisateursUtilises.includes(req.user.id)) {
      return next(new ErrorResponse('Vous avez déjà utilisé ce coupon', 400));
    }

    // Check minimum amount
    if (montantTotal < coupon.minAmount) {
      return next(new ErrorResponse(`Montant minimum requis: ${coupon.minAmount} FCFA`, 400));
    }

    // Calculate discount
    let reduction = 0;
    if (coupon.type === 'percentage') {
      reduction = (montantTotal * coupon.reduction) / 100;
    } else {
      reduction = coupon.reduction;
    }

    // Check max reduction
    if (coupon.maxReduction && reduction > coupon.maxReduction) {
      reduction = coupon.maxReduction;
    }

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        reduction,
        type: coupon.type
      }
    });
  } catch (error) {
    next(error);
  }
};
