import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import sendTokenResponse from '../utils/sendTokenResponse';

/**
 * @desc Sign in a user
 * @route POST /signin
 * @access Public
 */
export const signin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please add an email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  }
);
