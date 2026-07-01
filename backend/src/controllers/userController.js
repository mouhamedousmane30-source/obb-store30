const User = require('../models/User');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;

    let query = User.find();
    
    if (role) {
      query = query.where('role').equals(role);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const total = await User.countDocuments(query.getFilter());

    query = query
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNum);

    const users = await query.exec();

    res.status(200).json({
      success: true,
      users,
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

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { prenom, nom, telephone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { prenom, nom, telephone, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add address to user
// @route   POST /api/users/address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const newAddress = {
      ...req.body,
      isDefault: user.adresses.length === 0
    };

    user.adresses.push(newAddress);
    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user address
// @route   PUT /api/users/address/:addressId
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.adresses.id(req.params.addressId);

    if (!address) {
      return next(new ErrorResponse('Adresse non trouvée', 404));
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/address/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.adresses.id(req.params.addressId);

    if (!address) {
      return next(new ErrorResponse('Adresse non trouvée', 404));
    }

    address.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('Utilisateur non trouvé', 404));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé'
    });
  } catch (error) {
    next(error);
  }
};
