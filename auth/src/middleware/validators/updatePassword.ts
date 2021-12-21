import { check } from 'express-validator';
import { User } from '../../models/User';
import { validationResponse } from './response';

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
