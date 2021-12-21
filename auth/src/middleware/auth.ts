import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from './async';
import { User } from '../models/User';
import ErrorResponse from '../utils/errorResponse';

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ErrorResponse('Unauthorized', 401));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as jwt.JwtPayload;

      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      return next(new ErrorResponse('Unauthorized', 401));
    }
  }
);
