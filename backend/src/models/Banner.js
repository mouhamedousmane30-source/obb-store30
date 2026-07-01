const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise']
  },
  lien: {
    type: String,
    default: ''
  },
  position: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
