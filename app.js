// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
const PORT = 3000;

// создаем приложение
const app = express();


// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// при гет-запросе экспресс выполняет колбэк привета
app.get('get', (req, res) => {
  res.send('hello');
})

// запуск сервера
app.listen(PORT, () => {
  console.log(`HELLO ITS ME MARIO AT PORT ${PORT}`);
})