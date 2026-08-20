const router = require('express').Router();
const controller = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/create', controller.createPayment);
router.post('/verify', controller.verifyPayment);

module.exports = router;
