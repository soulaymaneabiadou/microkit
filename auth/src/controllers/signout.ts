import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../middleware/async';

/**
 * @desc    Sign out out the currently sign in in user + clear cookies
 * @route   GET /signout
 * @access  Private
 */
export const signout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  }
);
