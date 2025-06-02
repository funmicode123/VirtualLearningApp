const { BadRequestError } = require('../utils/customErrors');

function validateRequest(schema) {
  return (req, res, next) => {
    // Determine which parts of the request to validate
    const validationTarget = {};
    
    if (schema.body) {
      validationTarget.body = req.body;
    }
    if (schema.params) {
      validationTarget.params = req.params;
    }
    if (schema.query) {
      validationTarget.query = req.query;
    }

    // Validate only the specified parts
    const { error } = schema.validate(validationTarget, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => {
        // Clean up the error message
        const path = detail.path.join('.');
        return `${path}: ${detail.message.replace(/"/g, "'")}`;
      }).join('; ');
      
      return next(new BadRequestError(errorMessage));
    }

    // Attach validated data to request object
    if (validationTarget.body) req.body = validationTarget.body;
    if (validationTarget.params) req.params = validationTarget.params;
    if (validationTarget.query) req.query = validationTarget.query;
    
    next();
  };
}

module.exports = validateRequest;