const router = require('express').Router();
const controller = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', controller.getWishlist);
router.post('/items', controller.addItem);
router.delete('/items/:id', controller.deleteItem);

module.exports = router;
