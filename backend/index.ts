
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';

import userRoutes from './api/routes/exampleRoutes';
import errorHandler from './middleware/error.middleware';

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

dotenv.config()
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use(errorHandler);

// const mongoUrl = process.env.MONGODB_URL;
// if (!mongoUrl) {
//   throw new Error('MONGODB_URL is not defined');
// }
// mongoose.connect(mongoUrl)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
