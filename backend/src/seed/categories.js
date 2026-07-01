require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  {
    nom: 'Maillots',
    slug: 'maillots',
    image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/maillots-category.jpg',
    hoverImage: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/maillots-category-hover.jpg',
    description: 'Maillots de football officiels et éditions limitées',
    isActive: true
  },
  {
    nom: 'T-shirts',
    slug: 'tshirts',
    image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/tshirts-category.jpg',
    hoverImage: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/tshirts-category-hover.jpg',
    description: 'T-shirts premium en coton bio et designs exclusifs',
    isActive: true
  },
  {
    nom: 'Chaussures',
    slug: 'chaussures',
    image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/chaussures-category.jpg',
    hoverImage: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/chaussures-category-hover.jpg',
    description: 'Sneakers urbaines et chaussures de sport',
    isActive: true
  },
  {
    nom: 'Parfums',
    slug: 'parfums',
    image: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/obb-store/parfums-category.jpg',
    description: 'Parfums luxueux et fragrances exclusives',
    isActive: true
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    // Clear existing categories
    await Category.deleteMany();
    console.log('Catégories existantes supprimées');

    // Insert categories
    await Category.insertMany(categories);
    console.log('Catégories insérées avec succès');

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seedCategories();
