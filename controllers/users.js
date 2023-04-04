const User = require('../models/user');
const { error_code, error_default, error_unfound } = require('../utils/constants');
// code - 400, default - 500, unfound - 404

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar } )
  .then(user => res.status(201).send(user)) // 200 - успех, 201 – успех и что-то создалось
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(error_code).send({ message: 'Переданы некорректные данные при создании user'})
    }
    return res.status(error_default).send({ message: 'Что-то пошло не так'})
  })
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (user === null) {
      return res.status(error_unfound).send({ message: 'Пользователь по указанному _id не найден.' })
    }
    return res.status(200).send({ data: user })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(error_code).send({ message: 'Передан некорректный id'})
    }
    return res.status(error_default).send({ message: 'Что-то пошло не так'})
  })
};

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.status(200).send({ data: users }))
  .catch(() => {
    return res.status(error_default).send({ message: 'Что-то пошло не так'})
  })
};