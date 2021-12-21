import { signout } from '../controllers/signout';
import { protect } from '../middleware/auth';

const router = require('express').Router();

router.route('/signout').get(protect, signout);

export { router as signoutRouter };
