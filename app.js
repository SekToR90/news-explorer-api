require('dotenv').config();
const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000, NODE_ENV, URL_DB } = process.env;
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routers/users.js');
const articlesRouter = require('./routers/articles.js');
const NotFoundError = require('./errors/not-found-err');
const { statusError } = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(NODE_ENV === 'production' ? URL_DB : 'mongodb://localhost:27017/newsdb',
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); // удалить после проверки

app.use(cors());
app.use('/', usersRouter, articlesRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(statusError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
