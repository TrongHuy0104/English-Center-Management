const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
  .route('/:id/getUserProfile')
  .get(userController.getRoleUser) // Ensure this method exists or rename it appropriately
  .patch(userController.updateUserProfile); // This should match the method name in the controller

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.patch('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getRoleUser);


router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
