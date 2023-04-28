const User = require('../models/user');
/*
const bcrypt = require('bcryptjs'); // импортируем bcrypt для хэширования паролей
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken для создания токена
const { celebrate, Joi } = require('celebrate'); библиотека для валидации данных
*/
const {
  errorCode,
  errorDefault,
  errorUnfound,
} = require('../utils/constants');
// code - 400, default - 500, unfound - 404
// 200 - успех, 201 – успех и что-то создалось

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({ message: 'Переданы некорректные данные при создании user' });
      }
      return res.status(errorDefault).send({ message: 'Что-то пошло не так' });
    });
};

/*
exports.createUser = (req, res) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send(err));
};
*/

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(errorCode)
          .send({ message: 'Передан некорректный id' });
      }
      return res.status(errorDefault).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(errorDefault).send({ message: 'Что-то пошло не так' }));
};

module.exports.changeUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({ message: 'Переданы некорректные данные для обновления профиля' });
      }
      return res.status(errorDefault).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.changeAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({ message: 'Переданы некорректные данные для обновления аватара' });
      }
      return res.status(errorDefault).send({ message: 'Что-то пошло не так' });
    });
};
