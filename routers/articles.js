const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
    getArticles, postArticles, deleteArticles,
} = require('../controllers/articles.js');

router.get('/articles', auth, getArticles); //возвращает все сохранённые пользователем статьи

router.post('/articles', auth, celebrate({
    body: Joi.object().keys({
        keyword: Joi.string().required(),
        title: Joi.string().required(),
        text: Joi.string().required(),
        date: Joi.string().required(),
        source: Joi.string().required(),
        link: Joi.string().required().pattern(/^https?:\/\/(www\.)?[\w\-\/\.a-z#?]{1,}/i),
        image: Joi.string().required().pattern(/^https?:\/\/(www\.)?[\w\-\/\.a-z#?]{1,}/i),
    }),
}), postArticles); //создаёт статью с переданными в теле keyword, title, text, date, source, link и image

router.delete('/articles/:articleId', auth, celebrate({
    params: Joi.object().keys({
        articleId: Joi.string().required().alphanum().length(24),
    }),
}), deleteArticles); //удаляет сохранённую статью  по _id

module.exports = router;