import { check } from 'express-validator';
import { validationResponse } from './response';

export const validateResetPassword = [
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please add a password')
    .isLength({ min: 6 })
    .withMessage('Please add a strong password')
    .bail(),

  validationResponse
];
