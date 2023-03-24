// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = requier('body-parser');
const path = require('path');

// создаем приложение
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// мидлвар переваривания информации
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // более юная версия - app.use(express.json())

// если в будущем понадобятся файлы фпонта из локальных папок
/* app.use(express.static(path.join(__dirname + '/public'))); */

// запуск сервера
app.listen(PORT, () => {
  console.log(`HELLO ITS ME MARIO AT PORT ${PORT}`);
})