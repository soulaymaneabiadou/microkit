import { signin } from '../controllers/signin';
import { validateSignin } from '../middleware/validators/signin';

const router = require('express').Router();

router.route('/signin').post(validateSignin, signin);

export { router as signinRouter };
