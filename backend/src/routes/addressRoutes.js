const router = require('express').Router();
const controller = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(controller.listAddresses).post(controller.createAddress);
router.route('/:id').patch(controller.updateAddress).delete(controller.deleteAddress);

module.exports = router;
