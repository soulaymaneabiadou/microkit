import { updatePassword } from '../controllers/updatePassword';
import { protect } from '../middleware/auth';
import { validateUpdatePassword } from '../middleware/validators/updatePassword';

const router = require('express').Router();

router
  .route('/updatepassword')
  .put(protect, validateUpdatePassword, updatePassword);

export { router as updatePasswordRouter };
