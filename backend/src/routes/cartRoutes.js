const router = require('express').Router();
const controller = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', controller.getCart);
router.post('/items', controller.addItem);
router.patch('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);
router.delete('/', controller.clearCart);

module.exports = router;
