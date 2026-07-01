const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['order', 'stock', 'customer', 'payment', 'review', 'system'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Le message est requis']
  },
  lien: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  },
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null = tous les admins
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
