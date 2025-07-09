const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tile Proxy API',
      version: '1.0.0',
      description: 'API for secure, cached MapTiler tile proxy with POE proximity filtering'
    }
  },
  apis: ['./controllers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
