const router = require('express').Router();
const controller = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', controller.createOrder);
router.get('/', controller.listMyOrders);
router.get('/:id', controller.getMyOrder);

module.exports = router;
