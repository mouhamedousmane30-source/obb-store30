const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, produits, paymentMethod } = req.body;

    // Calculate total and validate products
    let montantTotal = 0;
    const orderProducts = [];

    for (const item of produits) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new ErrorResponse(`Produit non trouvé: ${item.productId}`, 404));
      }

      if (product.stock < item.quantite) {
        return next(new ErrorResponse(`Stock insuffisant pour ${product.nom}`, 400));
      }

      const prixTotal = product.prix * item.quantite;
      montantTotal += prixTotal;

      orderProducts.push({
        produit: product._id,
        nom: product.nom,
        image: product.imagePrincipale,
        quantite: item.quantite,
        variant: item.variant,
        taille: item.taille,
        prix: product.prix,
        prixTotal
      });

      // Update stock
      product.stock -= item.quantite;
      product.vendu += item.quantite;
      await product.save();
    }

    // Create order
    const orderData = {
      produits: orderProducts,
      montantTotal,
      adresseLivraison: shippingAddress,
      paiement: {
        methode: paymentMethod || 'cash'
      },
      statut: 'pending',
      statusHistory: [{
        statut: 'pending',
        date: new Date(),
        note: 'Commande créée'
      }]
    };

    if (req.user && req.user.id) {
      orderData.utilisateur = req.user.id;
    }

    const order = await Order.create(orderData);

    // Add order to user's orders if authenticated
    if (req.user && req.user.id) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user.id, {
        $push: { commandes: order._id }
      });
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Commande créée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, statut } = req.query;

    let query = Order.find();
    
    if (statut) {
      query = query.where('statut').equals(statut);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const total = await Order.countDocuments(query.getFilter());

    query = query
      .populate('utilisateur', 'prenom nom email telephone')
      .populate('produits.produit', 'nom image')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNum);

    const orders = await query.exec();

    res.status(200).json({
      success: true,
      orders,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ utilisateur: req.user.id })
      .populate('produits.produit', 'nom image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('utilisateur', 'prenom nom email telephone')
      .populate('produits.produit', 'nom image');

    if (!order) {
      return next(new ErrorResponse('Commande non trouvée', 404));
    }

    const isOrderOwner = order.utilisateur && order.utilisateur._id
      ? order.utilisateur._id.toString() === req.user.id
      : false;

    if (!isOrderOwner && req.user.role !== 'admin') {
      return next(new ErrorResponse('Non autorisé', 403));
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order receipt for guest or registered customer
// @route   GET /api/orders/receipt
// @access  Public
exports.getOrderReceipt = async (req, res, next) => {
  try {
    const { orderNumber, telephone, email } = req.query;

    if (!orderNumber) {
      return next(new ErrorResponse('N° de commande requis', 400));
    }

    if (!telephone && !email) {
      return next(new ErrorResponse('Téléphone ou email requis', 400));
    }

    const order = await Order.findOne({ orderNumber })
      .populate('utilisateur', 'prenom nom email telephone')
      .populate('produits.produit', 'nom image');

    if (!order) {
      return next(new ErrorResponse('Commande non trouvée', 404));
    }

    const matchesTelephone = telephone && order.adresseLivraison.telephone === telephone;
    const matchesEmail = email && order.adresseLivraison.email === email;

    if (!matchesTelephone && !matchesEmail) {
      return next(new ErrorResponse('Informations de réception invalides', 403));
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Commande non trouvée', 404));
    }

    const { statut, note } = req.body;

    if (statut) {
      order.statut = statut;
      order.statusHistory.push({
        statut,
        date: new Date(),
        note: note || `Statut mis à jour: ${statut}`
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Commande non trouvée', 404));
    }

    const isOrderOwner = order.utilisateur
      ? order.utilisateur.toString() === req.user.id
      : false;

    if (!isOrderOwner && req.user.role !== 'admin') {
      return next(new ErrorResponse('Non autorisé', 403));
    }

    // Can only cancel pending orders
    if (order.statut !== 'pending') {
      return next(new ErrorResponse('Cette commande ne peut plus être annulée', 400));
    }

    // Restore stock
    for (const item of order.produits) {
      const product = await Product.findById(item.produit);
      if (product) {
        product.stock += item.quantite;
        product.vendu -= item.quantite;
        await product.save();
      }
    }

    order.statut = 'cancelled';
    order.statusHistory.push({
      statut: 'cancelled',
      date: new Date(),
      note: 'Commande annulée par le client'
    });

    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: 'Commande annulée avec succès'
    });
  } catch (error) {
    next(error);
  }
};
