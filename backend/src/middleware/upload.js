const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const ErrorResponse = require('./errorHandler').ErrorResponse;

const cloudinaryName = process.env.CLOUDINARY_NAME;
const cloudinaryKey = process.env.CLOUDINARY_KEY;
const cloudinarySecret = process.env.CLOUDINARY_SECRET;
const isMissingCloudinaryConfig = [cloudinaryName, cloudinaryKey, cloudinarySecret].some(
  (value) => !value || value.includes('your-')
);

if (isMissingCloudinaryConfig) {
  console.error(
    'Missing or invalid Cloudinary configuration. Using local upload storage instead. Configure CLOUDINARY_NAME, CLOUDINARY_KEY, and CLOUDINARY_SECRET in backend/.env for Cloudinary uploads.'
  );
}

if (!isMissingCloudinaryConfig) {
  cloudinary.config({
    cloud_name: cloudinaryName,
    api_key: cloudinaryKey,
    api_secret: cloudinarySecret,
  });
}

if (isMissingCloudinaryConfig) {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Configure storage
const storage = isMissingCloudinaryConfig
  ? multer.diskStorage({
      destination: path.join(__dirname, '..', 'uploads'),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = path
          .basename(file.originalname, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${name}-${uniqueSuffix}${ext}`);
      }
    })
  : new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'obb-store',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 1000, crop: 'limit' },
          { quality: 'auto' }
        ]
      }
    });

// Multer upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

    if (extname && mimetype) {
      return cb(null, true);
    }

    cb(new ErrorResponse('Type de fichier non supporté. Utilisez JPEG, PNG ou WebP', 400));
  }
});

// Upload single image
const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple images
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Upload named fields (e.g. { name: 'image', maxCount: 1 })
const uploadFields = (fields) => upload.fields(fields);

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  deleteImage,
};
