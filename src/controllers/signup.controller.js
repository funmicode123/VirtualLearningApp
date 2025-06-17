const SignupService = require('../services/signup.service');
const { formatSignupResponse } = require('../dto/response/userResponse/signup.response');

const signup = async (req, res, next) => {
  try {
    const user = await SignupService(req.body, req.file);
    const response = formatSignupResponse(user);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {signup} ;
