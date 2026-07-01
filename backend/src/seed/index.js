require('dotenv').config();
const mongoose = require('mongoose');

const seedCategories = require('./categories');
const seedProducts = require('./products');
const seedAdmin = require('./admin');

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    console.log('\n--- Début du seed complet ---\n');

    // Seed categories
    console.log('Seed des catégories...');
    await seedCategories();

    // Seed products
    console.log('\nSeed des produits...');
    await seedProducts();

    // Seed admin
    console.log('\nSeed de l\'administrateur...');
    await seedAdmin();

    console.log('\n--- Seed complet terminé avec succès ---\n');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seedAll();
