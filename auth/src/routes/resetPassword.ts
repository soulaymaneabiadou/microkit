import { resetPassword } from '../controllers/resetPassword';
import { validateResetPassword } from '../middleware/validators/resetPassword';

const router = require('express').Router();

router
  .route('/resetpassword/:resettoken')
  .put(validateResetPassword, resetPassword);

export { router as resetPasswordRouter };
