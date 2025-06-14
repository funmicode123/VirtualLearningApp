const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError, NotFoundError } = require('../utils/customErrors');

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.NODE_ENV === 'development' ? '1h' : '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token
  };
};

module.exports = { loginUser };
