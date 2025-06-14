function formatLoginResponse(user) {
  return {
    id: user.id,
    email: user.email,
    token: user.token, 
    message: 'User created successfully',
  };
}

module.exports = { formatLoginResponse };
