const router = require('express').Router();
const controller = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/products/:productId/reviews', controller.listProductReviews);
router.post('/products/:productId/reviews', protect, controller.createReview);
module.exports = router;
