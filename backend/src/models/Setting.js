const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'La clé est requise'],
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  categorie: {
    type: String,
    enum: ['general', 'contact', 'payment', 'shipping', 'security', 'notifications', 'seo', 'social'],
    default: 'general'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
