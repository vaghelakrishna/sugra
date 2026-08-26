const multer = require('multer');

// Store files in memory buffer for instant stream upload to Cloudinary
const storage = multer.memoryStorage();

const acceptedTypes = /^(image|video)\//;
const fileFilter = (_req, file, done) => {
  if (acceptedTypes.test(file.mimetype) || /\.(glb|gltf|usdz)$/i.test(file.originalname)) {
    return done(null, true);
  }
  done(new Error('Only image, video, or 3D model files are supported.'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024, files: 12 },
});
