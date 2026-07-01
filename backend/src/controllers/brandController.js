const Brand = require('../models/Brand');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const slugify = require('slugify');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ nom: 1 });

    res.status(200).json({
      success: true,
      brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all brands (admin)
// @route   GET /api/brands/all
// @access  Private/Admin
exports.getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ nom: 1 });

    res.status(200).json({
      success: true,
      brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = async (req, res, next) => {
  try {
    if (req.body.nom) {
      req.body.slug = slugify(req.body.nom, { lower: true, strict: true });
    }

    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res, next) => {
  try {
    let brand = await Brand.findById(req.params.id);

    if (!brand) {
      return next(new ErrorResponse('Marque non trouvée', 404));
    }

    if (req.body.nom) {
      req.body.slug = slugify(req.body.nom, { lower: true, strict: true });
    }

    brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return next(new ErrorResponse('Marque non trouvée', 404));
    }

    await brand.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Marque supprimée'
    });
  } catch (error) {
    next(error);
  }
};
