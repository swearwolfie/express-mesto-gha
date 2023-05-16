const Card = require('../models/card');
const {
  errorCode,
  errorDefault,
  errorUnfound,
  errorForbidden,
  created,
  success,
} = require('../utils/constants');
// code - 400, default - 500, unfound - 404, forbidden - 403

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(created).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(success).send({ data: cards }))
    .catch(() => res.status(errorDefault).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Карточка по указанному _id не найдена.' });
      }
      if (card.owner.toString() !== req.user._id) {
        return res
          .status(errorForbidden)
          .send({ message: 'Нельзя удалить чужую карточку' });
      }
      return res.status(success).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(errorCode)
          .send({ message: 'Передан некорректный id' });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавит _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Карточка по указанному _id не найдена.' });
      }
      return res.status(success).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(errorCode)
          .send({ message: 'Передан некорректный id' });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // уберет _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Карточка по указанному _id не найдена.' });
      }
      return res.status(success).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(errorCode)
          .send({ message: 'Передан некорректный id' });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
    });
};
