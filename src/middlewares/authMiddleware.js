const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { AppError } = require('../utils/customErrors');

const userCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; 

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cachedUser = userCache.get(userId);
    const now = Date.now();

    if (cachedUser && cachedUser.expiresAt > now) {
      req.user = cachedUser.data;
    } else {
      const user = await User.findOne({ id: userId });
      if (!user) return next(new AppError('User not found', 404));

      userCache.set(userId, {
        data: user,
        expiresAt: now + CACHE_TTL_MS
      });

      req.user = user;
    }

    next();
  } catch (err) {
    console.error('❌ JWT error:', err.message);
    next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = auth;
