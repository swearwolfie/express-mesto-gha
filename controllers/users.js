const bcrypt = require('bcryptjs'); // импортируем bcrypt для хэширования паролей
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken для создания токена
const User = require('../models/user');
/*
const { celebrate, Joi } = require('celebrate'); библиотека для валидации данных
*/
const {
  errorCode, errorDefault, errorUnfound, errorDouble, created, success,
} = require('../utils/constants');
// code - 400, default - 500, unfound - 404
// 200 - успех, 201 – успех и что-то создалось
const { JWT_SECRET } = require('../config');

module.exports.createUser = (req, res) => {
  const
    {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(created).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({ message: 'Переданы некорректные данные при создании user' });
      } if (err.code === 11000) {
        return res.status(errorDouble)
          .send({ message: 'Такой пользователь уже существует' });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(success).send({ data: user });
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

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(success).send({ data: users }))
    .catch(() => res.status(errorDefault).send({ message: 'На сервере произошла ошибка' }));
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
      return res.status(success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({
            message: 'Переданы некорректные данные для обновления профиля',
          });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(errorCode)
          .send({
            message: 'Переданы некорректные данные для обновления аватара',
          });
      }
      return res.status(errorDefault).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // дополнение для оверрайда select'а в схеме
    .orFail(() => res // метод для обработки ошибок FindBy... etc
      .status(errorUnfound)
      .send({ message: 'Пользователь не найден' })) // ошибка на ненайденный пароль
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      } return res.status(errorUnfound).send({ message: 'Пользователь не найден' }); // ошибка на несовпадение пароля
    }))
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token }); // вернём токен
    })
    .catch(() => {
      res
        .status(errorUnfound)
        .send({ message: 'Переданы неккоректные данные' });
    });
};

// users/me
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        return res
          .status(errorUnfound)
          .send({ message: 'Пользователь не найден.' });
      }
      return res.status(success).send({ data: user });
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
