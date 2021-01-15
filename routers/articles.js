const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getArticles, postArticles, deleteArticles,
} = require('../controllers/articles.js');

router.get('/articles', auth, getArticles); // возвращает все сохранённые пользователем статьи

router.post('/articles', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required(),
    image: Joi.string().required(),
  }),
}), postArticles);
// создаёт статью с переданными в теле keyword, title, text, date, source, link и image

router.delete('/articles/:articleId', auth, celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().hex().length(24),
  }),
}), deleteArticles); // удаляет сохранённую статью  по _id

module.exports = router;
