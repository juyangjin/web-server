var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser('jyj1997'));
//app.js
var session = require('express-session');
app.use(session({
  secret: 'jyj1997', //암호화할 때 사용할 비밀번호
  resave: false, //새로운 요청시 세션에 변동 사항이 없어도 다시 저장할 지 설정 
  saveUninitialized: true, //세션에 저장할 내용이 없어도 저장할지 설정
  cookie:{
    httpOnly: true, //클라이언트 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
  }
}
));

app.use(express.static(path.join(__dirname, 'public')));
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler;
//
app.use(function(err, req, res, next) {
  // set locals, only providing error in 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
