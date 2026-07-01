const Notification = require('../models/Notification');
const ErrorResponse = require('../middleware/errorHandler').ErrorResponse;

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isRead, type } = req.query;

    let query = Notification.find({
      $or: [
        { destinataire: req.user.id },
        { destinataire: null }
      ]
    });

    if (isRead !== undefined) {
      query = query.where('isRead').equals(isRead === 'true');
    }
    if (type) {
      query = query.where('type').equals(type);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const total = await Notification.countDocuments(query.getFilter());
    const unreadCount = await Notification.countDocuments({
      $or: [
        { destinataire: req.user.id },
        { destinataire: null }
      ],
      isRead: false
    });

    query = query
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limitNum);

    const notifications = await query.exec();

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
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

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return next(new ErrorResponse('Notification non trouvée', 404));
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { destinataire: req.user.id },
          { destinataire: null }
        ],
        isRead: false
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'Toutes les notifications marquées comme lues'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new ErrorResponse('Notification non trouvée', 404));
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification supprimée'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notification (internal)
exports.createNotification = async ({ type, title, message, lien, metadata, destinataire }) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      lien: lien || '',
      metadata: metadata || {},
      destinataire: destinataire || null
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
