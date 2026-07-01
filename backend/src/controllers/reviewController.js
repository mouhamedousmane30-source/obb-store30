const Review = require('../models/Review');
const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ 
      produit: req.params.productId,
      isApproved: true 
    })
      .populate('utilisateur', 'prenom nom avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { produit, note, commentaire } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      utilisateur: req.user.id,
      produit
    });

    if (existingReview) {
      return next(new ErrorResponse('Vous avez déjà noté ce produit', 400));
    }

    const review = await Review.create({
      utilisateur: req.user.id,
      produit,
      note,
      commentaire,
      isVerified: true // Auto-verify for now
    });

    // Update product rating
    const product = await Product.findById(produit);
    if (product) {
      const reviews = await Review.find({ produit, isApproved: true });
      const avgRating = reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length;
      product.note = avgRating;
      product.nombreAvis = reviews.length;
      await product.save();
    }

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse('Avis non trouvé', 404));
    }

    // Check ownership
    if (review.utilisateur.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Non autorisé', 403));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse('Avis non trouvé', 404));
    }

    // Check ownership
    if (review.utilisateur.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Non autorisé', 403));
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Avis supprimé'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('utilisateur', 'prenom nom email')
      .populate('produit', 'nom')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};
