import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { User, UserDoc } from '../models/User';
import asyncHandler from '../middleware/async';
import sendEmail from '../utils/sendEmail';
import ErrorResponse from '../utils/errorResponse';
import sendTokenResponse from '../utils/sendTokenResponse';

interface IRequest extends Request {
  user: UserDoc;
}

/**
 * @desc Register a user as a manager & create their tenant(organization)
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(
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

/**
 * @desc Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(
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

/**
 * @desc    Log out the currently logged in user + clear cookies
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(
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

/**
 * @desc Get currently logged in user along side thier organization details
 * @route POST /api/v1/auth/me
 * @access Private
 */
export const getMe = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

/**
 * @desc Update user details
 * @route PUT /api/v1/auth/updatedetails
 * @access Private
 */
export const updateDetails = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
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

/**
 * @desc Update password
 * @route POST /api/v1/auth/updatepassword
 * @access Private
 */
export const updatePassword = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Incorrect Password', 401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

/**
 * @desc Forgot Password
 * @route POST /api/v1/auth/forgotpassword
 * @access Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse('Invalid Email', 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/auth/resetpassword/${resetToken}`;

    const message = `Reset password, URL: ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Email has been sent'
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  }
);

/**
 * @desc Reset Password
 * @route PUT /api/v1/auth/resetpassword/:resettoken
 * @access Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid reset token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  }
);
