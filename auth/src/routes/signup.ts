import { signup } from '../controllers/signup';
import { validateSignup } from '../middleware/validators/signup';

const router = require('express').Router();

router.route('/signup').post(validateSignup, signup);

export { router as signupRouter };
