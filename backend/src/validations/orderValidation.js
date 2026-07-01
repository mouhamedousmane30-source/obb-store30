const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// Create order validation
exports.createOrderValidation = [
  body('shippingAddress.prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est requis'),
  body('shippingAddress.nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis'),
  body('shippingAddress.telephone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis'),
  body('shippingAddress.adresse')
    .trim()
    .notEmpty().withMessage('L\'adresse est requise'),
  body('shippingAddress.ville')
    .trim()
    .notEmpty().withMessage('La ville est requise'),
  body('produits')
    .isArray({ min: 1 }).withMessage('Au moins un produit est requis'),
  body('produits.*.productId')
    .notEmpty().withMessage('L\'ID du produit est requis'),
  body('produits.*.quantite')
    .isInt({ min: 1 }).withMessage('La quantité doit être au moins 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse(errors.array().map((err) => err.msg).join(', '), 400));
    }
    next();
  }
];

// Update order validation
exports.updateOrderValidation = [
  body('statut')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Statut invalide')
];
