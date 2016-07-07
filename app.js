/**
 * Express app for serving web
 * -
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

// set process env from .env
// require('dotenv').config();

var express   = require('express'),
    path      = require('path'),
    http      = require('http'),
    morgan    = require('morgan');

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'public'));
app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'public/assets')));

/************************************
 * Route
 ************************************/

app.get('/', function(req, res) {
  return res.render('landing');
});

app.get('/brand', function(req, res) {
  return res.render('brand');
});

app.get('/influencer', function(req, res) {
  return res.render('influencer');
});

app.get('/compotest', function(req, res) {
  return res.render('compotest');
});


/************************************
 * Start server
 ************************************/
http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Express server listening to port ' + (process.env.PORT || 8080));
});
