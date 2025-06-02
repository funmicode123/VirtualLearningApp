const mongoose = require('mongoose');
const { stringify } = require('uuid');
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
  attendeeList: [{
    type: String,
    ref: 'User'
  }],
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
