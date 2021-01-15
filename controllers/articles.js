const Articles = require('../models/article');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getArticles = (req, res, next) => {
  Articles.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.postArticles = (req, res, next) => Articles
  .create({ owner: req.user._id, ...req.body })
  .then((articles) => res.status(200).send(articles))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные в методы создания карточки'));
    }
    return next(err);
  });

module.exports.deleteArticles = (req, res, next) => {
  const { articleId } = req.params;

  Articles.findById(articleId)
    .select('+owner')
    .then((articles) => {
      if (!articles) {
        return next(new NotFoundError('Карточка не найдена'));
      } if (articles.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Невозможно удалить чужую карточку'));
      }
      return Articles.findByIdAndRemove(articleId)
        .orFail()
        .then(() => res.send({ data: articles }))
        .catch((err) => next(err));
    });
};
