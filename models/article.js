const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  }, // ключевое слово, по которому ищутся статьи
  title: {
    type: String,
    required: true,
  }, // заголовок статьи
  text: {
    type: String,
    required: true,
  }, // текст статьи
  date: {
    type: String,
    required: true,
  }, // дата статьи
  source: {
    type: String,
    required: true,
  }, // источник статьи
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Введите URL картинки',
    },
  }, // ссылка на статью
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Введите URL картинки',
    },
  }, // ссылка на иллюстрацию к статье
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  }, // _id пользователя, сохранившего статью
});

const articleModel = mongoose.model('article', articleSchema);

module.exports = articleModel;
