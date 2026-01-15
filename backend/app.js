import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';

dotenv.config();

import routes from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import './src/config/database.js';

const app = express();


//  Middlewares
 
app.use(cors());
app.use(express.json());

// Logger middleware
// Logs every incoming request and response

app.use(
  pinoHttp({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  })
);

// Health check route
// Used to verify server status

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// API routes
app.use('/api', routes);

app.use(errorHandler);

export default app;