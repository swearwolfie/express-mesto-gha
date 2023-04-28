// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
/*
const { celebrate, Joi } = require('celebrate'); библиотека для валидации данных
*/

// создаем приложение
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// мидлвар переваривания информации
app.use(express.json());

// если в будущем понадобятся файлы фронта из локальных папок
/* app.use(express.static(path.join(__dirname + '/public'))); */

// доп мидлвар, который задает айди для создания карточки
app.use((req, res, next) => {
  req.user = {
    _id: '642c97f752a0f2ec09557f35', //  _id созданного пользователя Kate Bishop
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

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
} */
