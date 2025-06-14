const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../utils/customErrors');

const SignupService = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError('Email already in use');

  const newUser = new User({ email, password });
  await newUser.save();

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  return {
    id: newUser.id,
    email: newUser.email,
    token
  };
};

module.exports =  SignupService ;
