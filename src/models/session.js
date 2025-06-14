const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  topic: {
    type: String,
    required: true
  },
  host: {
    type: String,
    ref: 'User',
    required: true
  },
  attendeeList: {
    type: [String],
    lowercase: true,
    trim: true,
    validate: {
      validator: emails => emails.every(email => /^\S+@\S+\.\S+$/.test(email)),
      message: props => `Invalid emails found: ${props.value}`
    },
    default: []
  },

  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
