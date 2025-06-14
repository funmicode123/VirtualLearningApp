const { loginUser } = require('../services/login.service');
const loginRequestDto = require('../dto/request/user/login.dto');

const login = async (req, res, next) => {
  try {
    const { error } = loginRequestDto.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
