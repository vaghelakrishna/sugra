const router = require('express').Router();
const controller = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, authorize('admin'), upload.array('media', 12), controller.uploadMedia);
router.route('/').get(controller.listProducts).post(protect, authorize('admin'), controller.createProduct);
router.route('/:id').get(controller.getProduct).patch(protect, authorize('admin'), controller.updateProduct).delete(protect, authorize('admin'), controller.deleteProduct);

module.exports = router;
