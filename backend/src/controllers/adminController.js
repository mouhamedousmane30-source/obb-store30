const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $match: { statut: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$montantTotal' } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
      statut: { $ne: 'cancelled' }
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.montantTotal, 0);

    const pendingOrders = await Order.countDocuments({ statut: 'pending' });
    const averageCart = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const lowStockProducts = await Product.countDocuments({ isActive: true, stock: { $lte: 5, $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ isActive: true, stock: 0 });
    const totalCustomers = await User.countDocuments({ role: { $in: ['customer', 'client'] } });

    const recentUsers = await User.find()
      .select('prenom nom email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOrders = await Order.find()
      .populate('utilisateur', 'prenom nom email')
      .sort({ createdAt: -1 })
      .limit(5);

    const bestProducts = await Product.find({ isActive: true })
      .sort({ vendu: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers, totalOrders, totalProducts, totalCustomers,
        totalRevenue, monthlyRevenue, monthlyOrders: monthlyOrders.length,
        pendingOrders, averageCart, lowStockProducts, outOfStockProducts,
        totalRevenueFormatted: formatCurrency(totalRevenue),
        monthlyRevenueFormatted: formatCurrency(monthlyRevenue),
        averageCartFormatted: formatCurrency(averageCart)
      },
      recentUsers, recentOrders, bestProducts,
      lowStockProductsList: await Product.find({ isActive: true, stock: { $lte: 5 } }).sort({ stock: 1 }).limit(10)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent orders
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private/Admin
exports.getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find()
      .populate('utilisateur', 'prenom nom email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      orders: orders.map(o => ({
        id: o._id, _id: o._id, orderNumber: o.orderNumber,
        customer: o.utilisateur ? `${o.utilisateur.prenom} ${o.utilisateur.nom}` : 'Client inconnu',
        email: o.utilisateur?.email || '',
        product: o.produits?.[0]?.nom || 'Produits divers',
        amount: formatCurrency(o.montantTotal), montantTotal: o.montantTotal,
        deliveryStatus: o.statut, paymentStatus: o.paiement?.statut || 'pending',
        date: o.createdAt?.toISOString?.()?.split('T')[0] || '',
        time: o.createdAt?.toLocaleTimeString?.('fr-FR') || '', createdAt: o.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best selling products
// @route   GET /api/admin/dashboard/best-products
// @access  Private/Admin
exports.getBestProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const products = await Product.find({ isActive: true }).sort({ vendu: -1 }).limit(limit);

    res.status(200).json({
      success: true,
      products: products.map(p => ({
        id: p._id, _id: p._id, name: p.nom, category: p.category,
        sales: p.vendu || 0, stock: p.stock,
        revenue: formatCurrency((p.prix || 0) * (p.vendu || 0)),
        revenueAmount: (p.prix || 0) * (p.vendu || 0)
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly sales data
// @route   GET /api/admin/dashboard/monthly-sales
// @access  Private/Admin
exports.getMonthlySales = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31) }, statut: { $ne: 'cancelled' } } },
      { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$montantTotal' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const result = months.map((month, i) => {
      const found = monthlySales.find(m => m._id === i + 1);
      return { month, revenue: found?.revenue || 0, orders: found?.orders || 0 };
    });

    res.status(200).json({ success: true, monthlySales: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category sales data
// @route   GET /api/admin/dashboard/category-sales
// @access  Private/Admin
exports.getCategorySales = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    const categoryStats = {};
    products.forEach(product => {
      const cat = product.category || 'autres';
      if (!categoryStats[cat]) categoryStats[cat] = { name: cat, sales: 0, revenue: 0, count: 0 };
      categoryStats[cat].sales += product.vendu || 0;
      categoryStats[cat].revenue += (product.prix || 0) * (product.vendu || 0);
      categoryStats[cat].count += 1;
    });
    res.status(200).json({ success: true, categories: Object.values(categoryStats) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await Order.find({ createdAt: { $gte: startDate }, statut: { $ne: 'cancelled' } }).sort({ createdAt: 1 });
    const salesByDate = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!salesByDate[date]) salesByDate[date] = 0;
      salesByDate[date] += order.montantTotal;
    });

    res.status(200).json({ success: true, salesData: Object.keys(salesByDate).map(date => ({ date, revenue: salesByDate[date] })) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category analytics
// @route   GET /api/admin/analytics/categories
// @access  Private/Admin
exports.getCategoryAnalytics = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    const categoryStats = {};
    products.forEach(product => {
      if (!categoryStats[product.category]) categoryStats[product.category] = { category: product.category, count: 0, revenue: 0 };
      categoryStats[product.category].count += 1;
      categoryStats[product.category].revenue += product.prix * product.vendu;
    });
    res.status(200).json({ success: true, categoryData: Object.values(categoryStats) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory
// @route   GET /api/admin/inventory
// @access  Private/Admin
exports.getInventory = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).select('nom slug category stock prix imagePrincipale').sort({ stock: 1 });
    res.status(200).json({
      success: true,
      inventory: products.map(p => ({
        id: p._id, _id: p._id, product: p.nom, nom: p.nom, sku: p.slug, slug: p.slug,
        category: p.category, available: p.stock, stock: p.stock, price: p.prix, image: p.imagePrincipale, reserved: 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, category, sort, isActive } = req.query;
    let query = Product.find();

    if (search) query = query.find({ $or: [{ nom: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }] });
    if (category) query = query.where('category').equals(category);
    if (isActive !== undefined) query = query.where('isActive').equals(isActive === 'true');

    let sortObj = { createdAt: -1 };
    if (sort === 'name') sortObj = { nom: 1 };
    else if (sort === 'price-asc') sortObj = { prix: 1 };
    else if (sort === 'price-desc') sortObj = { prix: -1 };
    else if (sort === 'stock') sortObj = { stock: 1 };
    query = query.sort(sortObj);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const total = await Product.countDocuments(query.getFilter());
    query = query.skip(startIndex).limit(limitNum);
    const products = await query.exec();

    res.status(200).json({ success: true, products, total, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
exports.getAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorResponse('Produit non trouvé', 404));
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product active status
// @route   PUT /api/admin/products/:id/toggle
// @access  Private/Admin
exports.toggleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorResponse('Produit non trouvé', 404));
    product.isActive = !product.isActive;
    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return next(new ErrorResponse('Utilisateur non trouvé', 404));
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary (for sidebar badge)
// @route   GET /api/admin/dashboard/summary
// @access  Private/Admin
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const pendingOrders = await Order.countDocuments({ statut: 'pending' });
    const lowStockCount = await Product.countDocuments({ isActive: true, stock: { $lte: 5 } });
    const unreadNotifications = await Notification.countDocuments({ isRead: false });
    res.status(200).json({ success: true, stats: { pendingOrders, lowStockCount, unreadNotifications } });
  } catch (error) {
    next(error);
  }
};
