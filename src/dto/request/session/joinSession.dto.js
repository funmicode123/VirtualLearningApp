const Joi = require('joi');

const joinSessionDto = {
  params: Joi.object({
    id: Joi.string()
      .guid({ version: ['uuidv4'] })  // ✅ Correct UUID validation
      .required()
      .messages({
        'string.guid': 'Session ID must be a valid UUID v4',
        'any.required': 'Session ID is required',
      }),
  }),
  body: Joi.object({
    email: Joi.string()
      .email()
      .max(100)
      .required()
      .messages({
        'string.email': 'Email must be a valid email address',
        'string.max': 'Email must not exceed 100 characters',
        'any.required': 'Email is required',
      }),
  }),
};

module.exports = joinSessionDto;
