import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import asyncHandler from '../middleware/async';

/**
 * @desc Get currently logged in user
 * @route GET /me
 * @access Private
 */
export const currentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  }
);
