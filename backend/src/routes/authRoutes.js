const router = require('express').Router();
const controller = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/google', controller.googleLogin);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.post('/logout', controller.logout);
router.get('/me', protect, controller.me);

module.exports = router;
