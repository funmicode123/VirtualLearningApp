const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../utils/customErrors');
const { upsertStreamUser } = require('../config/stream');

const SignupService = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError('Email already in use');

  const newUser = new User({ email, password });
  await newUser.save();

  try {
    await upsertStreamUser({
    id: newUser.id,
    email: newUser.email,
    image: newUser.profilePic || "",
  });
  console.log(`User upsert in the stream: ${email}`)
  }
  catch (error) {
    throw new Error(`Unable to create stream user: ${error.message}`)
  }

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
