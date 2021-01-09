const jwt = require('jsonwebtoken');
const BadAuthorizationError = require('../errors/bad-authorization-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  throw new BadAuthorizationError('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
