import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

interface Errors {
  [key: string]: string;
}

export const validationResponse = (
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let data: Errors = {};

    errors.array().forEach((error) => {
      data[`${error.param}`] = error.msg;
    });

    return res.status(422).json({
      success: false,
      errors: data,
      message: 'Invalid information',
      data: null
    });
  }

  next();
};
