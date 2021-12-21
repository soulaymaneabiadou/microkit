import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import asyncHandler from '../middleware/async';
import sendTokenResponse from '../utils/sendTokenResponse';

/**
 * @desc Sign up a user
 * @route POST /signup
 * @access Public
 */
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password
    });

    sendTokenResponse(user, 200, res);
  }
);
