const router = require('express').Router();
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  logout,
  updatePassword
} from '../controllers/auth';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateUpdateDetails,
  validateUpdatePassword,
  validateResetPassword
} from '../middleware/validators/auth';
import { protect } from '../middleware/auth';

router.route('/register').post(validateRegister, register);
router.route('/login').post(validateLogin, login);
router.route('/logout').get(protect, logout);
router.route('/forgotpassword').post(validateForgotPassword, forgotPassword);
router
  .route('/resetpassword/:resettoken')
  .put(validateResetPassword, resetPassword);

router.route('/me').get(protect, getMe);

router
  .route('/updatedetails')
  .put(protect, validateUpdateDetails, updateDetails);

router
  .route('/updatepassword')
  .put(protect, validateUpdatePassword, updatePassword);

export default router;
