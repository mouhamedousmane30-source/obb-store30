const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: [1, 'La note doit être au moins 1'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  commentaire: {
    type: String,
    required: [true, 'Le commentaire est requis'],
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ utilisateur: 1, produit: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
