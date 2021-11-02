import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
const xss = require('xss-clean');
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

import payments from './routes/payments';

const app = express();

// app.use(express.json());
app.use((req, res, next) => {
  if (req.originalUrl.endsWith('/webhooks')) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

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
    origin: process.env.CLIENT_URL
  })
);

app.use('/', payments);

app.all('*', (req, res, next) => {
  res.send('404');
});

export { app };
