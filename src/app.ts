/*
 * This file sets up the Express application, applies middleware for rate limiting,
 * and defines the route for serving map tiles.
 * It also integrates Swagger for API documentation.
 * 
 */
import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import tileController from './controllers/tile-controller';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.set('trust proxy', 1);

// Apply rate limiting to all requests
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use('/tiles', tileController);

export default app;