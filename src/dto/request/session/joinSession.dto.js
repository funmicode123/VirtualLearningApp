const Joi = require('joi');

const joinSessionDto = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
      'string.guid': 'Session ID must be a valid UUID v4',
      'any.required': 'Session ID is required'
    })
  }),
  body: Joi.object({
    userId: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
      'string.guid': 'User ID must be a valid UUID v4',
      'any.required': 'User ID is required'
    })
  })
}).options({ allowUnknown: false });

module.exports = joinSessionDto;