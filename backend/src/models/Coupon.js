const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Le code est requis'],
    unique: true,
    uppercase: true,
    trim: true
  },
  reduction: {
    type: Number,
    required: true,
    min: [0, 'La réduction ne peut pas être négative']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxReduction: {
    type: Number,
    default: null
  },
  expiration: {
    type: Date,
    required: [true, 'La date d\'expiration est requise']
  },
  nombreUtilisations: {
    type: Number,
    default: 0
  },
  maxUtilisations: {
    type: Number,
    default: null
  },
  utilisateursUtilises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  if (!this.isActive) return false;
  if (this.expiration < now) return false;
  if (this.maxUtilisations && this.nombreUtilisations >= this.maxUtilisations) return false;
  return true;
};

module.exports = mongoose.model('Coupon', couponSchema);
