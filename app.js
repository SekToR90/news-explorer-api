require('dotenv').config();
const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routers/users.js');
const articlesRouter = require('./routers/articles.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/newsdb', {
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
}); //удалить после проверки

app.use(cors());
app.use('/', usersRouter, articlesRouter);
app.use('*', (req, res) => {
    res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
        message: statusCode === 500
            ? 'На сервере произошла ошибка'
            : message,
    });
});

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
});