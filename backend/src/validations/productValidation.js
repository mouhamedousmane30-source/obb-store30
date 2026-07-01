const { body } = require('express-validator');

// Create product validation
exports.createProductValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom du produit est requis')
    .isLength({ max: 200 }).withMessage('Le nom ne peut pas dépasser 200 caractères'),
  body('slug')
    .trim()
    .notEmpty().withMessage('Le slug est requis')
    .matches(/^[a-z0-9-]+$/).withMessage('Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description ne peut pas dépasser 2000 caractères'),
  body('category')
    .trim()
    .notEmpty().withMessage('La catégorie est requise')
    .isIn(['maillots', 'tshirts', 'chaussures', 'parfums']).withMessage('Catégorie invalide'),
  body('prix')
    .notEmpty().withMessage('Le prix est requis')
    .isNumeric().withMessage('Le prix doit être un nombre')
    .isFloat({ min: 0 }).withMessage('Le prix ne peut pas être négatif'),
  body('ancienPrix')
    .optional()
    .isNumeric().withMessage('L\'ancien prix doit être un nombre')
    .isFloat({ min: 0 }).withMessage('Le prix ne peut pas être négatif'),
  body('stock')
    .notEmpty().withMessage('Le stock est requis')
    .isInt({ min: 0 }).withMessage('Le stock doit être un entier positif'),
  body('imagePrincipale')
    .trim()
    .notEmpty().withMessage('L\'image principale est requise')
];

// Update product validation
exports.updateProductValidation = [
  body('nom')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le nom ne peut pas dépasser 200 caractères'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description ne peut pas dépasser 2000 caractères'),
  body('category')
    .optional()
    .trim()
    .isIn(['maillots', 'tshirts', 'chaussures', 'parfums']).withMessage('Catégorie invalide'),
  body('prix')
    .optional()
    .isNumeric().withMessage('Le prix doit être un nombre')
    .isFloat({ min: 0 }).withMessage('Le prix ne peut pas être négatif'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Le stock doit être un entier positif')
];
