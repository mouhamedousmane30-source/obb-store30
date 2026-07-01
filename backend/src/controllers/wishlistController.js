const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ utilisateur: req.user.id })
      .populate('produits.produit');

    if (!wishlist) {
      wishlist = await Wishlist.create({
        utilisateur: req.user.id,
        produits: []
      });
    }

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { produitId } = req.body;

    // Check if product exists
    const product = await Product.findById(produitId);
    if (!product) {
      return next(new ErrorResponse('Produit non trouvé', 404));
    }

    let wishlist = await Wishlist.findOne({ utilisateur: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        utilisateur: req.user.id,
        produits: [{ produit: produitId }]
      });
    } else {
      // Check if already in wishlist
      const exists = wishlist.produits.some(
        p => p.produit.toString() === produitId
      );

      if (exists) {
        return next(new ErrorResponse('Produit déjà dans les favoris', 400));
      }

      wishlist.produits.push({ produit: produitId });
      await wishlist.save();
    }

    // Also add to user's favoris
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { favoris: produitId }
    });

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ utilisateur: req.user.id });

    if (!wishlist) {
      return next(new ErrorResponse('Liste de favoris vide', 404));
    }

    wishlist.produits = wishlist.produits.filter(
      p => p.produit.toString() !== req.params.productId
    );

    await wishlist.save();

    // Also remove from user's favoris
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { favoris: req.params.productId }
    });

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { utilisateur: req.user.id },
      { produits: [] },
      { new: true }
    );

    // Also clear user's favoris
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      favoris: []
    });

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};
