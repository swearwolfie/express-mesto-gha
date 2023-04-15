// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// создаем приложение
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');
/* {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
} */

// мидлвар переваривания информации
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // более юная версия - app.use(express.json())

// если в будущем понадобятся файлы фронта из локальных папок
/* app.use(express.static(path.join(__dirname + '/public'))); */

// доп мидлвар, который задает айди для создания карточки
app.use((req, res, next) => {
  req.user = {
    _id: '642c97f752a0f2ec09557f35' //  _id созданного пользователя Kate Bishop
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// запуск сервера
app.listen(PORT, () => {
  console.log(`HELLO ITS ME MARIO AT PORT ${PORT}`);
})

// user
/* {
  "name": "Kate Bishop",
  "about": "trainwreck",
  "avatar": "https://i.pinimg.com/originals/a9/2f/2a/a92f2ad25e937f17308344dd667fe967.png",
  "_id": "642c97f752a0f2ec09557f35",
  "__v": 0
} */