import { check } from 'express-validator';
import { User } from '../../models/User';
import { validationResponse } from './response';

export const validateSignup = [
  check('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Please add a name')
    .bail(),

  check('email')
    .trim()
    .not()
    .isEmpty()
    .normalizeEmail()
    .withMessage('Please add a valid email')
    .bail()
    .custom((value) => {
      return User.findOne({ email: value }).then((user: any) => {
        if (user) {
          return Promise.reject('Email already exists');
        }
      });
    }),

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
