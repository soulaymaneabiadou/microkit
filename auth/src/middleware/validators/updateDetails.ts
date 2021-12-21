import { check } from 'express-validator';
import { validationResponse } from './response';

export const validateUpdateDetails = [
  check('name')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please add a name')
    .bail(),

  check('email')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please add an email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please add a valid email')
    .bail(),

  validationResponse
];
