const AppError = require('./customErrors');

exports.validateHost = (session, userId) => {
  if (!session) {
    throw new AppError('Session not found', 404);
  }
  
  if (session.host.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to modify this session', 403);
  }
};

module.exports = exports;