const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a buffer or local file path to Cloudinary
 * @param {string|Buffer} fileInput - Local file path or base64 / buffer string
 * @param {object} options - Custom Cloudinary options
 * @returns {Promise<object>} - Upload result
 */
async function uploadToCloudinary(fileInput, options = {}) {
  const defaultOptions = {
    folder: 'sugra/products',
    resource_type: 'auto',
    ...options,
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileInput, defaultOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

/**
 * Upload a stream / buffer from Multer memoryStorage
 */
function uploadStreamToCloudinary(fileBuffer, options = {}) {
  const defaultOptions = {
    folder: 'sugra/products',
    resource_type: 'auto',
    ...options,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    uploadStream.end(fileBuffer);
  });
}

const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadStreamToCloudinary,
  isConfigured,
};

