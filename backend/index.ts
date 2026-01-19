import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config/config';

import exampleRoutes from './api/routes/exampleRoutes';
import userRoutes from './api/routes/userRoutes';
import errorHandler from './middleware/error.middleware';

const app: Application = express();
const port: number = config.port;


// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', exampleRoutes);
app.use('/api/users/', userRoutes);

// Errors
app.use(errorHandler);

// Connect to Mongo and start server
async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

start();
