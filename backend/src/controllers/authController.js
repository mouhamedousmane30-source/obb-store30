const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const sendEmail = require('../services/email');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { prenom, nom, email, password, telephone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('Cet email est déjà utilisé', 400));
    }

    // Create user
    const user = await User.create({
      prenom,
      nom,
      email,
      password,
      telephone
    });

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(201).cookie('token', token, options).json({
      success: true,
      message: 'Inscription réussie',
      user: {
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        avatar: user.avatar,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Validate input
    const loginField = email || username;
    if (!loginField || !password) {
      return next(new ErrorResponse('Veuillez fournir nom d\'utilisateur/email et mot de passe', 400));
    }

    // Check for user by email or username
    const user = await User.findOne({
      $or: [
        { email: loginField },
        { username: loginField }
      ]
    }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Identifiants invalides', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Identifiants invalides', 401));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    const cookieExpireDays = req.body.rememberMe ? Number(process.env.COOKIE_EXPIRE) : 1;

    // Set cookie
    const options = {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200).cookie('token', token, options).json({
      success: true,
      message: 'Connexion réussie',
      user: {
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        username: user.username,
        telephone: user.telephone,
        avatar: user.avatar,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Public-friendly
exports.getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        user: null
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(200).json({
        success: true,
        user: null
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        avatar: user.avatar,
        role: user.role,
        adresses: user.adresses,
        favoris: user.favoris,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Aucun utilisateur avec cet email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      Vous avez reçu cet email car vous avez demandé la réinitialisation de votre mot de passe.
      Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe:
      ${resetUrl}
      
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation du mot de passe - OBB STORE',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Email de réinitialisation envoyé'
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse('Email non envoyé', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Token invalide ou expiré', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      prenom: req.body.prenom,
      nom: req.body.nom,
      email: req.body.email,
      telephone: req.body.telephone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Mot de passe actuel incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour',
      token
    });
  } catch (error) {
    next(error);
  }
};
