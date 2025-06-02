const swaggerJsdoc = require('swagger-jsdoc');

const generateToken = require('../utils/generateToken');

const token = generateToken();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Virtual Learning API',
      version: '1.0.0',
      description: 'API for managing sessions and users',
    },
    servers: [
      {
        url: 'http://localhost:5000', 
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js', './src/dto/**/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

swaggerSpec.token = token;

module.exports = swaggerSpec;
