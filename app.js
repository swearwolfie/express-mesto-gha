// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const {
  errorUnfound,
} = require('./utils/constants');
const { createUser, login } = require('./controllers/users');
// const path = require('path');
/*
const { celebrate, Joi } = require('celebrate'); библиотека для валидации данных
*/

// создаем приложение
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true,
});

// запросы только с нашего сайта
app.use(cors({ origin: 'http://localhost:3000' }));

// мидлвар переваривания информации
app.use(express.json());
// Use Helmet!
app.use(helmet());

// если в будущем понадобятся файлы фронта из локальных папок
/* app.use(express.static(path.join(__dirname + '/public'))); */

// доп мидлвар, который задает айди для создания карточки
app.use((req, res, next) => {
  req.user = {
    _id: '642c97f752a0f2ec09557f35', //  _id созданного пользователя Kate Bishop
  };

  next();
});

app.post('/signup', createUser);
app.post('/signin', login);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((res) => {
  res.status(errorUnfound).render({
    message: 'Такого адреса не существует',
  });
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`HELLO ITS ME MARIO AT PORT ${PORT}`);
});

// user
/* {
  'name': 'Kate Bishop',
  'about': 'trainwreck',
  'avatar': 'https://i.pinimg.com/originals/a9/2f/2a/a92f2ad25e937f17308344dd667fe967.png',
  '_id': '642c97f752a0f2ec09557f35',
  '__v': 0

name
"Clint Barton"
about
"dad bod"
avatar
"https://64.media.tumblr.com/540b5b72ea4ce34e0d9440d93617c615/tumblr_in…"
__v
0
} */
