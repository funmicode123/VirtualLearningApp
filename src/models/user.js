const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },  
  // name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
  
});

module.exports = mongoose.model('User', userSchema);
