
const createError = require('http-errors');
const session = require('express-session');
const flash = require('express-flash');
const express = require('express');
const port = process.env.PORT || 3000;
const logger = require('morgan');
const path = require('path');
const cookieParser =require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: '123@123abc',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
);
app.use(flash());
app.get('/', function (req, res, next) {
  res.render('index', { title: 'User Form' });
});
app.post('/user_form', function (req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let sql = `INSERT INTO users (name, email, message) VALUES ("${name}", "${email}", "${message}")`
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log('Row has been updated');
    req.flash('success', 'Data stored!');
    res.redirect('/');
  })
});

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, function () {
  console.log('Node server is running on port : 3000')
});
module.exports = app;
