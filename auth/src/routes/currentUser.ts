import { currentUser } from '../controllers/currentUser';
import { protect } from '../middleware/auth';

const router = require('express').Router();

router.route('/me').get(protect, currentUser);

export { router as currentUserRouter };
