const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  produits: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    nom: String,
    image: String,
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1']
    },
    variant: String,
    taille: String,
    couleur: String,
    prix: {
      type: Number,
      required: true
    },
    prixTotal: {
      type: Number,
      required: true
    }
  }],
  montantTotal: {
    type: Number,
    required: true,
    min: [0, 'Le montant total ne peut pas être négatif']
  },
  adresseLivraison: {
    prenom: {
      type: String,
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    telephone: {
      type: String,
      required: true
    },
    email: String,
    adresse: {
      type: String,
      required: true
    },
    ville: {
      type: String,
      required: true
    },
    pays: {
      type: String,
      default: 'Sénégal'
    }
  },
  paiement: {
    methode: {
      type: String,
      enum: ['stripe', 'wave', 'orange', 'cash', 'carte'],
      default: 'cash'
    },
    statut: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  statut: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    statut: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  coupon: {
    code: String,
    reduction: Number
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate order number before validation so required field is populated
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
