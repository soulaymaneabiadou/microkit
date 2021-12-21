import { check } from 'express-validator';
import { User } from '../../models/User';
import { validationResponse } from './response';

export const validateForgotPassword = [
  check('email')
    .trim()
    .not()
    .isEmpty()
    .normalizeEmail()
    .withMessage('Please add your email address')
    .bail()
    .custom((value) => {
      return User.findOne({ email: value }).then((user: any) => {
        if (!user) {
          return Promise.reject('Invalid Email');
        }
      });
    }),

  validationResponse
];
