import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
const xss = require('xss-clean');
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

import errorHandler from './middleware/error';
import { signupRouter } from './routes/signup';
import { currentUserRouter } from './routes/currentUser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { resetPasswordRouter } from './routes/resetPassword';
import { updateDetailsRouter } from './routes/updateDetails';
import { updatePasswordRouter } from './routes/updatePassword';

const app = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10min
  max: 100
});

app.use(limiter);

app.use(hpp());

app.use(
  cors({
    credentials: true,
    origin: '*'
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(resetPasswordRouter);
app.use(updateDetailsRouter);
app.use(updatePasswordRouter);

app.use(errorHandler);

app.all('*', (req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

export { app };
