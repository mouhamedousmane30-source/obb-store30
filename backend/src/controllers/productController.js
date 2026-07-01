const Product = require('../models/Product');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;
const { deleteImage } = require('../middleware/upload');

const slugify = require('slugify');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { cat, search, sort, minPrice, maxPrice, page = 1, limit = 12, format } = req.query;

    // Build query
    let query = Product.find({ isActive: true });

    // Category filter
    if (cat) {
      query = query.where('category').equals(cat);
    }

    // Search filter
    if (search) {
      query = query.find({
        $or: [
          { nom: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query = query.where('prix');
      if (minPrice) query = query.gte(minPrice);
      if (maxPrice) query = query.lte(maxPrice);
    }

    // Sorting
    let sortObj = {};
    switch (sort) {
      case 'price-asc':
        sortObj = { prix: 1 };
        break;
      case 'price-desc':
        sortObj = { prix: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'popular':
      default:
        sortObj = { isPopular: -1, vendu: -1 };
    }
    query = query.sort(sortObj);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const total = await Product.countDocuments(query.getFilter());
    
    query = query.skip(startIndex).limit(limitNum);

    const products = await query.exec();

    res.status(200).json({
      success: true,
      products,
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

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });

    if (!product) {
      return next(new ErrorResponse('Produit non trouvé', 404));
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular products
// @route   GET /api/products/popular/list
// @access  Public
exports.getPopularProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const products = await Product.find({ isActive: true, isPopular: true })
      .sort({ vendu: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new products
// @route   GET /api/products/new/list
// @access  Public
exports.getNewProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const products = await Product.find({ isActive: true, isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar products
// @route   GET /api/products/:slug/similar
// @access  Public
exports.getSimilarProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return next(new ErrorResponse('Produit non trouvé', 404));
    }

    const limit = parseInt(req.query.limit) || 3;
    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
      .sort({ isPopular: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

const getFileUrl = (file, req) => {
  if (!file) return null;
  if (file.path && /^https?:\/\//.test(file.path)) {
    return file.path;
  }

  if (file.filename) {
    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  }

  return file.path;
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    // Require at least one uploaded image for product creation
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('L’upload d’image est requis pour créer un produit', 400));
    }

    const images = req.files.map((file) => getFileUrl(file, req));
    req.body.images = images;
    req.body.imagePrincipale = images[0];

    // Parse boolean fields from multipart form data
    req.body.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    req.body.isNewArrival = req.body.isNewArrival === undefined
      ? true
      : req.body.isNewArrival === 'true' || req.body.isNewArrival === true;

    // Génération automatique du slug
    if (req.body.nom) {
      req.body.slug = slugify(req.body.nom, {
        lower: true,
        strict: true
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Produit non trouvé', 404));
    }

    // Nouvelles images
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => getFileUrl(file, req));
      req.body.images = images;
      req.body.imagePrincipale = images[0];
    }

    req.body.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    if (req.body.isNewArrival !== undefined) {
      req.body.isNewArrival = req.body.isNewArrival === 'true' || req.body.isNewArrival === true;
    }

    // Régénération du slug si le nom change
    if (req.body.nom) {
      req.body.slug = slugify(req.body.nom, {
        lower: true,
        strict: true
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Produit non trouvé', 404));
    }

    if (product.images && product.images.length) {
      for (const image of product.images) {
        try {
          const publicId = image.split('/').pop().split('.')[0];
          await deleteImage(`obb-store/${publicId}`);
        } catch (err) {
          console.error(err);
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Produit supprimé'
    });

  } catch (error) {
    next(error);
  }
};