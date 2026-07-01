const { body } = require('express-validator');

// Register validation
exports.registerValidation = [
  body('prenom')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ max: 50 }).withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('telephone')
    .optional()
    .trim()
    .isMobilePhone('any').withMessage('Numéro de téléphone invalide')
];

// Login validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Le nom d\'utilisateur ou l\'email est requis')
    .custom((value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernamePattern = /^[a-zA-Z0-9._-]{3,30}$/;
      if (emailPattern.test(value) || usernamePattern.test(value)) {
        return true;
      }
      throw new Error('Entrez un email ou un nom d\'utilisateur valide');
    }),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

// Forgot password validation
exports.forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
];

// Reset password validation
exports.resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Update password validation
exports.updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];
