var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var User = require('./models/user');
var path=require('path');

mongoose.connect('mongodb://Admin:abc123.....@ds013956.mlab.com:13956/packbooks', { server: { reconnectTries: Number.MAX_VALUE } });
var routes = require('./routes/index');
var users = require('./routes/users');
var libros = require('./routes/libros');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/libros', libros);


app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){console.log('Server started on port '+app.get('port'));});