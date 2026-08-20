const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '../../uploads/products');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, done) => done(null, uploadDirectory),
  filename: (_req, file, done) => {
    const extension = path.extname(file.originalname).toLowerCase();
    done(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const acceptedTypes = /^(image|video)\//;
const fileFilter = (_req, file, done) => {
  if (acceptedTypes.test(file.mimetype) || /\.(glb|gltf|usdz)$/i.test(file.originalname)) return done(null, true);
  done(new Error('Only image, video, or 3D model files are supported.'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 25 * 1024 * 1024, files: 12 } });
