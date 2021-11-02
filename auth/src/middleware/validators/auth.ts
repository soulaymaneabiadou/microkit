import { check } from 'express-validator';
import { User } from '../../models/User';
import { validationResponse } from './response';

export const validateRegister = [
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

export const validateLogin = [
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

export const validateUpdatePassword = [
  check('currentPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please add your current password')
    .bail()
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user.id).select('+password');

      if (!(await user.matchPassword(req.body.currentPassword))) {
        return Promise.reject('Incorrect Password');
      }
    })
    .bail(),

  check('newPassword')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please add the new Password')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Please add a password longer than 6 characters')
    .bail(),

  validationResponse
];

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
