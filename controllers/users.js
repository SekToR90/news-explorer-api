const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const BadAuthorizationError = require('../errors/bad-authorization-err');
const BadRequestError = require('../errors/bad-request-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

// ------!
module.exports.createUser = (reg, res, next) => { // контроллер для регистрации
  const { email, password } = reg.body;

  if (!email || !password) { // проверка на валидность введенных данных
    throw new BadRequestError('Невалидные данные');
  }

  User.findOne({ email })
    // если введены валидные данные, проверяем, есть ли в базе пользователь с таким емейлом
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }

      bcrypt.hash(password, 10)
        // если пользователя нет, хешируем пароль и добавляем нового пользователя
        .then((hash) => User.create({ ...reg.body, password: hash })
          .then(({ _id }) => res.status(200).send({ _id }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              return next(new BadRequestError('Переданы некорректные данные в методы создания пользователя'));
            }
            return next(err);
          }));
    })
    .catch(next);
};

module.exports.login = (reg, res, next) => {
  const { email, password } = reg.body;

  if (!email || !password) { // проверка на валидность введенных данных
    throw new BadRequestError('Невалидные данные');
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadAuthorizationError('Неправильные почта или пароль');
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
              { expiresIn: '7d' });
            return res.send({
              token,
            });
          }
          throw new BadAuthorizationError('Неправильные почта или пароль');
        });
    })
    .catch(next);
};
// -------
