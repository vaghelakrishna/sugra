const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const adminController = require('../controllers/adminController');

router.use(protect, authorize('admin'));

// Orders
router.get('/orders', controller.listAdminOrders);
router.patch('/orders/:id/status', controller.updateOrderStatus);

// Reviews
router.get('/reviews', reviewController.listAdminReviews);
router.post('/reviews', reviewController.createAdminReview);
router.patch('/reviews/:id/status', reviewController.updateReviewStatus);
router.delete('/reviews/:id', reviewController.deleteReview);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Products & Inventory
router.get('/products', adminController.listProducts);
router.post('/products/bulk-import', adminController.bulkImportProducts);
router.get('/categories', adminController.listCategories);
router.get('/inventory', adminController.listInventory);
router.post('/inventory/bulk-import', adminController.bulkImportInventory);
router.patch('/inventory/:id', adminController.adjustStock);

module.exports = router;
