import http from 'http';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config/config';
import { attachCollaborationSocket } from './collaboration/socket';

import userRoutes from './api/routes/userRoutes';
import validationRoutes from './api/routes/validationRoutes';
import exportRoutes from './api/routes/exportRoutes'
import importRoutes from './api/routes/importRoutes'
import diagramRoutes from './api/routes/diagramRoutes';
import llmRoutes from './api/routes/llmRoutes';
import notificationRoutes from './api/routes/notificationRoutes';
import User from './models/User';
import errorHandler from './middleware/error.middleware';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app: Application = express();
const port: number = config.port;

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Devinche API',
      version: '1.0.0',
      description: 'API documentation for Devinche backend',
    },
    servers: [
      { url: `http://localhost:${port}`, description: 'Local server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./api/routes/**/*.ts', './models/**/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions as any);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users/', userRoutes);
app.use('/api/validation/', validationRoutes);
app.use('/api/import/', importRoutes)
app.use('/api/export/', exportRoutes)
app.use('/api/diagrams/', diagramRoutes);
app.use('/api/llm/', llmRoutes);
app.use('/api/notifications', notificationRoutes);

// Errors
app.use(errorHandler);


app.get("/openapi.json", (req, res) => {
  res.json(swaggerSpec);
});


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

    const httpServer = http.createServer(app);
    attachCollaborationSocket(httpServer);

    httpServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
      console.log('Collaboration socket attached at /socket.io');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

start();
