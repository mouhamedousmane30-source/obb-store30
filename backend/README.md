# OBB STORE Backend API

Backend API pour la plateforme e-commerce OBB STORE développée avec la stack MERN.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- Cloudinary
- dotenv
- cors
- cookie-parser
- express-validator
- nodemailer
- Stripe
- helmet
- express-rate-limit
- express-mongo-sanitize
- xss-clean
- hpp
- compression

## Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd backend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
Créer un fichier `.env` dans le dossier racine avec les variables suivantes:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/obb-store

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
COOKIE_EXPIRE=30

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend URL
CLIENT_URL=http://localhost:5173
```

4. Démarrer MongoDB
```bash
# Si MongoDB est installé localement
mongod

# Ou utiliser MongoDB Atlas
# Mettre à jour MONGO_URI dans .env
```

5. Lancer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Seed de la base de données

Pour remplir la base de données avec des données initiales:

```bash
# Seed complet (catégories, produits, admin)
npm run seed

# Seed individuel
npm run seed:categories
npm run seed:products
npm run seed:admin
```

## Structure du projet

```
backend/
│
├── src/
│   ├── config/
│   │   └── database.js          # Configuration MongoDB
│   ├── controllers/
│   │   ├── adminController.js   # Contrôleur admin (stats, analytics)
│   │   ├── authController.js    # Contrôleur authentification
│   │   ├── bannerController.js  # Contrôleur bannières
│   │   ├── cartController.js    # Contrôleur panier
│   │   ├── categoryController.js # Contrôleur catégories
│   │   ├── couponController.js  # Contrôleur coupons
│   │   ├── newsletterController.js # Contrôleur newsletter
│   │   ├── orderController.js   # Contrôleur commandes
│   │   ├── productController.js # Contrôleur produits
│   │   ├── reviewController.js  # Contrôleur avis
│   │   ├── userController.js    # Contrôleur utilisateurs
│   │   └── wishlistController.js # Contrôleur favoris
│   ├── middleware/
│   │   ├── auth.js              # Middleware authentification
│   │   ├── errorHandler.js      # Middleware gestion erreurs
│   │   └── upload.js            # Middleware upload Cloudinary
│   ├── models/
│   │   ├── Banner.js            # Modèle bannière
│   │   ├── Cart.js              # Modèle panier
│   │   ├── Category.js          # Modèle catégorie
│   │   ├── Coupon.js            # Modèle coupon
│   │   ├── Newsletter.js        # Modèle newsletter
│   │   ├── Order.js             # Modèle commande
│   │   ├── Product.js           # Modèle produit
│   │   ├── Review.js            # Modèle avis
│   │   ├── User.js              # Modèle utilisateur
│   │   └── Wishlist.js          # Modèle favoris
│   ├── routes/
│   │   ├── admin.js             # Routes admin
│   │   ├── auth.js              # Routes authentification
│   │   ├── banners.js           # Routes bannières
│   │   ├── cart.js              # Routes panier
│   │   ├── categories.js        # Routes catégories
│   │   ├── coupons.js           # Routes coupons
│   │   ├── newsletter.js        # Routes newsletter
│   │   ├── orders.js            # Routes commandes
│   │   ├── products.js          # Routes produits
│   │   ├── reviews.js           # Routes avis
│   │   ├── users.js             # Routes utilisateurs
│   │   └── wishlist.js          # Routes favoris
│   ├── seed/
│   │   ├── admin.js             # Seed administrateur
│   │   ├── categories.js        # Seed catégories
│   │   ├── index.js             # Seed complet
│   │   └── products.js          # Seed produits
│   ├── services/
│   │   └── email.js             # Service email
│   ├── utils/
│   ├── validations/
│   │   ├── authValidation.js    # Validations auth
│   │   ├── orderValidation.js   # Validations commandes
│   │   └── productValidation.js # Validations produits
│   ├── uploads/
│   ├── app.js                   # Configuration Express
│   └── server.js                # Point d'entrée
├── .env                         # Variables d'environnement
├── package.json                 # Dépendances
└── README.md                    # Documentation
```

## API Routes

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Obtenir utilisateur connecté
- `POST /api/auth/forgot-password` - Mot de passe oublié
- `PUT /api/auth/reset-password/:resetToken` - Réinitialiser mot de passe
- `PUT /api/auth/updatedetails` - Mettre à jour profil
- `PUT /api/auth/updatepassword` - Changer mot de passe

### Utilisateurs

- `GET /api/users` - Liste utilisateurs (admin)
- `GET /api/users/:id` - Détail utilisateur (admin)
- `PUT /api/users/profile` - Mettre à jour profil
- `POST /api/users/address` - Ajouter adresse
- `PUT /api/users/address/:addressId` - Modifier adresse
- `DELETE /api/users/address/:addressId` - Supprimer adresse
- `DELETE /api/users/:id` - Supprimer utilisateur (admin)

### Produits

- `GET /api/products` - Liste produits (avec filtres, pagination, tri)
- `GET /api/products/:slug` - Détail produit
- `GET /api/products/popular/list` - Produits populaires
- `GET /api/products/new/list` - Nouveaux produits
- `GET /api/products/:slug/similar` - Produits similaires
- `POST /api/products` - Créer produit (admin)
- `PUT /api/products/:id` - Modifier produit (admin)
- `DELETE /api/products/:id` - Supprimer produit (admin)

**Filtres produits:**
- `cat` - Catégorie (maillots, tshirts, chaussures, parfums)
- `search` - Recherche texte
- `sort` - Tri (popular, newest, price-asc, price-desc)
- `minPrice` - Prix minimum
- `maxPrice` - Prix maximum
- `page` - Page (défaut: 1)
- `limit` - Limite par page (défaut: 12)

### Catégories

- `GET /api/categories` - Liste catégories
- `GET /api/categories/:slug` - Détail catégorie
- `POST /api/categories` - Créer catégorie (admin)
- `PUT /api/categories/:id` - Modifier catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer catégorie (admin)

### Commandes

- `POST /api/orders` - Créer commande
- `GET /api/orders` - Liste commandes (admin)
- `GET /api/orders/my-orders` - Mes commandes
- `GET /api/orders/:id` - Détail commande
- `PUT /api/orders/:id` - Modifier commande (admin)
- `PUT /api/orders/:id/cancel` - Annuler commande

### Avis

- `GET /api/reviews/product/:productId` - Avis d'un produit
- `POST /api/reviews` - Créer avis
- `PUT /api/reviews/:id` - Modifier avis
- `DELETE /api/reviews/:id` - Supprimer avis
- `GET /api/reviews` - Tous les avis (admin)

### Coupons

- `GET /api/coupons` - Liste coupons (admin)
- `POST /api/coupons` - Créer coupon (admin)
- `PUT /api/coupons/:id` - Modifier coupon (admin)
- `DELETE /api/coupons/:id` - Supprimer coupon (admin)
- `POST /api/coupons/validate` - Valider coupon

### Favoris (Wishlist)

- `GET /api/wishlist` - Liste favoris
- `POST /api/wishlist` - Ajouter aux favoris
- `DELETE /api/wishlist/:productId` - Supprimer des favoris
- `DELETE /api/wishlist` - Vider favoris

### Panier (Cart)

- `GET /api/cart` - Voir panier
- `POST /api/cart` - Ajouter au panier
- `PUT /api/cart/:productId` - Modifier quantité
- `DELETE /api/cart/:productId` - Supprimer du panier
- `DELETE /api/cart` - Vider panier

### Bannières

- `GET /api/banners` - Liste bannières actives
- `GET /api/banners/all` - Toutes bannières (admin)
- `POST /api/banners` - Créer bannière (admin)
- `PUT /api/banners/:id` - Modifier bannière (admin)
- `DELETE /api/banners/:id` - Supprimer bannière (admin)

### Newsletter

- `POST /api/newsletter` - S'abonner
- `DELETE /api/newsletter/:email` - Se désabonner
- `GET /api/newsletter` - Liste abonnés (admin)

### Admin Dashboard

- `GET /api/admin/stats` - Statistiques globales
- `GET /api/admin/analytics/sales` - Analytics ventes
- `GET /api/admin/analytics/categories` - Analytics catégories

## Sécurité

- JWT Authentication avec cookies httpOnly
- bcryptjs pour le hashage des mots de passe
- Helmet pour les headers HTTP sécurisés
- Rate limiting (100 requêtes / 15 minutes)
- Sanitization MongoDB (NoSQL injection)
- XSS protection
- CORS configuré
- Compression gzip

## Rôles

- **admin** - Accès complet à toutes les fonctionnalités
- **manager** - Accès limité (à implémenter)
- **customer** - Utilisateur standard
- **client** - Utilisateur standard (alias)

## Upload d'images

Les images sont uploadées automatiquement sur Cloudinary via Multer.

- Formats acceptés: JPEG, PNG, WebP
- Taille maximale: 5MB
- Transformation automatique: redimensionnement et qualité auto

## Email

Les emails sont envoyés via Nodemailer (configurable avec Gmail ou autre SMTP).

## Stripe

L'intégration Stripe est prête pour les paiements (clés à configurer dans .env).

## Déploiement

### MongoDB Atlas
1. Créer un cluster sur MongoDB Atlas
2. Obtenir la connection string
3. Mettre à jour `MONGO_URI` dans .env

### Cloudinary
1. Créer un compte Cloudinary
2. Obtenir les credentials
3. Mettre à jour les variables CLOUDINARY dans .env

### Production
1. Définir `NODE_ENV=production`
2. Utiliser un JWT_SECRET fort
3. Configurer un SMTP réel pour les emails
4. Utiliser les clés Stripe de production

## Support

Pour toute question ou problème, contactez l'équipe OBB STORE.
