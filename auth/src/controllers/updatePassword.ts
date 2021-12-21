import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import sendTokenResponse from '../utils/sendTokenResponse';

/**
 * @desc Update password
 * @route POST /updatepassword
 * @access Private
 */
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Incorrect Password', 401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
  }
);
