var _global = require('./global');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
//app.set('view engine', 'jade');

app.engine('html', require('./htmlEngine'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var users = require('./routes/users');
app.use('/api/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    var errorStatus = (err.status) ? err.status : 500;
//    console.log( 'Path:' + req.path + '  Error: ' + errorStatus + ' - ' + err.stack );
//    res.status( errorStatus );
//    res.render('error/' + errorStatus + '.html');
//  });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var errorStatus = (err.status) ? err.status : 500;
  console.log( 'Path:' + req.path + '  Error: ' + errorStatus + ' - ' + err.stack );
  res.status(errorStatus);
  res.render('error/' + errorStatus + '.html');
});


module.exports = app;
