const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const adminController = require('../controllers/adminController');

router.use(protect, authorize('admin'));
router.get('/orders', controller.listAdminOrders);
router.patch('/orders/:id/status', controller.updateOrderStatus);
router.get('/reviews', reviewController.listAdminReviews);
router.patch('/reviews/:id/status', reviewController.updateReviewStatus);
router.get('/dashboard', adminController.dashboard);
router.get('/products', adminController.listProducts);
router.get('/categories', adminController.listCategories);
router.get('/inventory', adminController.listInventory);
router.patch('/inventory/:id', adminController.adjustStock);

module.exports = router;
