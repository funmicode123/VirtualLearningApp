const Joi = require('joi');

// Validation schema using Joi
const conversationSchema = Joi.object({
  sessionId: Joi.string().required(),
  host: Joi.string().required(),
  participants: Joi.array().items(Joi.string()).required()
});

class CreateConversationDTO {
  constructor({sessionId, host, participants }) {
    // Validate input
    const { error, value } = conversationSchema.validate({sessionId, host, participants });
    if (error) {
      throw new Error(error.details[0].message);
    }

    this.sessionId = value.sessionId;
    this.host = value.host;
    this.participants = value.participants;
  }
}

module.exports = CreateConversationDTO;
