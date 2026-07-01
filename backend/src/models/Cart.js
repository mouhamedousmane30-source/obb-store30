const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  produits: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    slug: String,
    nom: String,
    image: String,
    prix: {
      type: Number,
      required: true
    },
    variant: String,
    taille: String,
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1'],
      default: 1
    }
  }],
  montantTotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', function(next) {
  this.montantTotal = this.produits.reduce((total, item) => {
    return total + (item.prix * item.quantite);
  }, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
