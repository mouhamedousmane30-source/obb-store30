const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
      maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
    },

    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      enum: ['maillots', 'tshirts', 'chaussures', 'parfums'],
    },

    sousCategorie: {
      type: String,
      default: '',
    },

    marque: {
      type: String,
      default: 'OBB STORE',
    },

    prix: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },

    ancienPrix: {
      type: Number,
      default: 0,
      min: [0, 'Le prix ne peut pas être négatif'],
    },

    reduction: {
      type: Number,
      default: 0,
      min: [0, 'La réduction ne peut pas être négative'],
      max: [100, 'La réduction ne peut pas dépasser 100%'],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Le stock ne peut pas être négatif'],
    },

    tailles: [
      {
        type: String,
      },
    ],

    couleurs: [
      {
        nom: String,
        code: String,
        image: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    imagePrincipale: {
      type: String,
      required: [true, "L'image principale est requise"],
    },

    gallery: [
      {
        type: String,
      },
    ],

    variants: {
      label: String,
      options: [String],
    },

    note: {
      type: Number,
      default: 0,
      min: [0, 'La note ne peut pas être négative'],
      max: [5, 'La note ne peut pas dépasser 5'],
    },

    nombreAvis: {
      type: Number,
      default: 0,
    },

    vendu: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    promoEndDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index de recherche
productSchema.index({ nom: 'text', description: 'text' });
productSchema.index({ category: 1, prix: 1 });

// Virtual pour compatibilité frontend
productSchema.virtual('subtitle').get(function () {
  const categoryMap = {
    maillots: 'Maillots',
    tshirts: 'T-shirts',
    chaussures: 'Chaussures',
    parfums: 'Parfums',
  };

  return categoryMap[this.category] || this.category;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;