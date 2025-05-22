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
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  attendeeList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {timestamps: Date}); 

module.exports = mongoose.model('Session', sessionSchema);
