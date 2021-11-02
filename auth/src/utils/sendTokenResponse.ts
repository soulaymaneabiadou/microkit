import { Response } from 'express';
import { UserDoc } from '../models/User';

const sendTokenResponse = (
  user: UserDoc,
  statusCode: number,
  res: Response
) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  });
};

export default sendTokenResponse;
