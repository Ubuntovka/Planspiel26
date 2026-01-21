import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config/config';

import userRoutes from './api/routes/userRoutes';
import validationRoutes from './api/routes/validationRoutes';
import User from './models/User';
import errorHandler from './middleware/error.middleware';

const app: Application = express();
const port: number = config.port;


// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users/', userRoutes);
app.use('/api/validation/', validationRoutes);

// Errors
app.use(errorHandler);

// Connect to Mongo and start server
async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    try {
      await User.syncIndexes();
      console.log('User indexes synchronized');
    } catch (idxErr) {
      console.warn('Failed to synchronize User indexes:', idxErr);
    }

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

start();
