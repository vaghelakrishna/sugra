const router = require('express').Router();
const controller = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(controller.listCategories).post(protect, authorize('admin'), controller.createCategory);
router.route('/:id').get(controller.getCategory).patch(protect, authorize('admin'), controller.updateCategory).delete(protect, authorize('admin'), controller.deleteCategory);

module.exports = router;
