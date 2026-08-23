const router = require('express').Router();
const controller = require('../controllers/reviewController');

router.get('/products/:productId/reviews', controller.listProductReviews);
router.post('/products/:productId/reviews', controller.createReview);

module.exports = router;
