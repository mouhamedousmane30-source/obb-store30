require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const adminUser = {
  prenom: 'Admin',
  nom: 'OBB STORE',
  email: 'adminobbstore@obbstore.com',
  username: 'adminobbstore',
  password: 'admin30',
  telephone: '+221 77 123 45 67',
  role: 'admin',
  avatar: ''
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Administrateur existe déjà');
      process.exit(0);
    }

    // Create admin user
    const user = await User.create(adminUser);
    console.log('Administrateur créé avec succès');
    console.log('Email:', adminUser.email);
    console.log('Mot de passe:', adminUser.password);

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seedAdmin();
