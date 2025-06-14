const { BadRequestError } = require('../utils/customErrors');

function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => {
        const path = detail.path.join('.');
        return `${path}: ${detail.message.replace(/"/g, "'")}`;
      }).join('; ');

      return next(new BadRequestError(errorMessage));
    }

    req.body = value;
    next();
  };
}

module.exports = validateRequest;
