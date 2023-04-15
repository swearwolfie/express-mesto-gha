const Card = require('../models/card');
const { error_code, error_default, error_unfound } = require('../utils/constants');
// code - 400, default - 500, unfound - 404

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id
  Card.create({ name, link, owner })
  .then((card => res.status(201).send(card)))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(error_code).send({ message: 'Переданы некорректные данные при создании карточки'})
    }
    return res.status(error_default).send({ message: 'Что-то пошло не так'})
  })
};

module.exports.getCards = (req, res) => {
  Card.find({})
  .then(cards => res.status(200).send({ data: cards }))
  .catch(() => {
    return res.status(error_default).send({ message: 'Что-то пошло не так'})
  })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (card === null) {
      return res.status(error_unfound).send({ message: 'Карточка по указанному _id не найдена.' })
    }
    return res.status(200).send({ data: card })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(error_code).send({ message: 'Передан некорректный id'})
    }
    return res.status(error_default).send({ message: 'Что-то пошло не так'})
  })
}