var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var locationRouter = require('./routes/locationRouter');
var ticketRouter = require('./routes/ticketRouter');
var tripRouter = require('./routes/tripRouter')
var cardRouter=require('./routes/cardRouter')
var uploadRouter=require('./routes/uploadRouter')
//connect to db
const mongoose = require('mongoose');
const Locations = require('./models/locations');

const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => { console.log(err); })

var app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307,'https://' + req.hostname + ':' + app.get('secPort') + req.url)
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/locations', locationRouter);
app.use('/tickets', ticketRouter);
app.use('/trips', tripRouter);
app.use('/cards', cardRouter);
app.use('/imageUpload',uploadRouter)
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
