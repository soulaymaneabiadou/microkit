import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import asyncHandler from '../middleware/async';

/**
 * @desc Update user details
 * @route PUT /updatedetails
 * @access Private
 */
export const updateDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: any = {};
    const fields = ['name', 'email'];
    fields.forEach((field) => {
      if (req.body[field]) {
        data[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, data, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  }
);
