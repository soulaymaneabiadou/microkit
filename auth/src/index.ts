import { config } from 'dotenv';
import { connectDB } from './config/db';
import { app } from './app';
import { UserDoc } from './models/User';

config();

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}

const start = async () => {
  const PORT = process.env.PORT;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });

    process.on('unhandledRejection', (err: Error, promise) => {
      console.log(`Unhandled Rejection: ${err.message}`);

      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(error);
  }
};

start();
