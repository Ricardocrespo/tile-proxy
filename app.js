/*
 * This file sets up the Express application, applies middleware for rate limiting,
 * and defines the route for serving map tiles.
 * It also integrates Swagger for API documentation.
 * 
 */
const express = require('express');
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const tileController = require('./controllers/tileController');

const app = express();
app.set('trust proxy', 1);

// Apply rate limiting to all requests
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use('/tiles', tileController);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
