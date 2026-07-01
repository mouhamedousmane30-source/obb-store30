const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ utilisateur: req.user.id })
      .populate('produits.produit');

    if (!cart) {
      cart = await Cart.create({
        utilisateur: req.user.id,
        produits: []
      });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantite, variant, taille } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse('Produit non trouvé', 404));
    }

    // Check stock
    if (product.stock < quantite) {
      return next(new ErrorResponse('Stock insuffisant', 400));
    }

    let cart = await Cart.findOne({ utilisateur: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        utilisateur: req.user.id,
        produits: [{
          produit: productId,
          slug: product.slug,
          nom: product.nom,
          image: product.imagePrincipale,
          prix: product.prix,
          variant,
          taille,
          quantite
        }]
      });
    } else {
      // Check if product already in cart with same variant
      const existingItem = cart.produits.find(
        p => p.produit.toString() === productId && 
             p.variant === variant && 
             p.taille === taille
      );

      if (existingItem) {
        existingItem.quantite += quantite;
      } else {
        cart.produits.push({
          produit: productId,
          slug: product.slug,
          nom: product.nom,
          image: product.imagePrincipale,
          prix: product.prix,
          variant,
          taille,
          quantite
        });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantite, variant, taille } = req.body;

    let cart = await Cart.findOne({ utilisateur: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Panier vide', 404));
    }

    const item = cart.produits.find(
      p => p.produit.toString() === req.params.productId &&
           p.variant === variant &&
           p.taille === taille
    );

    if (!item) {
      return next(new ErrorResponse('Produit non trouvé dans le panier', 404));
    }

    // Check stock
    const product = await Product.findById(req.params.productId);
    if (product && product.stock < quantite) {
      return next(new ErrorResponse('Stock insuffisant', 400));
    }

    if (quantite <= 0) {
      cart.produits = cart.produits.filter(
        p => !(p.produit.toString() === req.params.productId &&
              p.variant === variant &&
              p.taille === taille)
      );
    } else {
      item.quantite = quantite;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { variant, taille } = req.query;

    let cart = await Cart.findOne({ utilisateur: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Panier vide', 404));
    }

    cart.produits = cart.produits.filter(
      p => !(p.produit.toString() === req.params.productId &&
            p.variant === variant &&
            p.taille === taille)
    );

    await cart.save();

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { utilisateur: req.user.id },
      { produits: [] },
      { new: true }
    );

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};
