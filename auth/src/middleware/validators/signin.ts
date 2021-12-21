import { check } from 'express-validator';
import { validationResponse } from './response';

export const validateSignin = [
  check('email')
    .trim()
    .not()
    .isEmpty()
    .normalizeEmail()
    .withMessage('Please add a valid email')
    .bail(),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please add a password')
    .isLength({ min: 6 })
    .withMessage('Please add a password longer than 6 characters')
    .bail(),

  validationResponse
];
