import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ErrorResponse from '../utils/errorResponse';

interface IError extends mongoose.Error {
  code?: number;
  statusCode?: number;
  errors?: { [key: string]: Error };
}

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: any = { ...err };
  error.message = err.message;
  console.log(err.stack);

  if (err.name === 'CastError') {
    const message = `Resource Not Found`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message: any = Object.values(err.errors).map(
      (val: Error) => val.message
    );
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    errors: [],
    data: null,
    message: error.message || 'Server Error'
  });
};

export default errorHandler;
