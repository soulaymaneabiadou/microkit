import { updateDetails } from '../controllers/updateDetails';
import { protect } from '../middleware/auth';
import { validateUpdateDetails } from '../middleware/validators/updateDetails';

const router = require('express').Router();

router
  .route('/updatedetails')
  .put(protect, validateUpdateDetails, updateDetails);

export { router as updateDetailsRouter };
