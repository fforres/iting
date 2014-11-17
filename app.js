var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var expressFlash = require('express-flash');
var express = require('express');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var compress = require('compression');
var roleHelper = require('./helpers/roleHelper');


// SETTINGS
var settings = require('./settings/settings');

// DEFINICION DE RUTAS
var adminRestaurantes = require('./routes/admins/restaurantes');
var admin = require('./routes/admin');
var users = require('./routes/users');
var tests = require('./routes/tests');
var api = require('./routes/api');

global.API_URL = "http://fforres.koding.io:3002/api";
global.APP_URL = "http://fforres.koding.io:3001";

var app = express();


// passport Config

require('./settings/passport')(app, passport);
// view engine setup
app
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'jade')
	.use(favicon())
	.use(logger('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded())
	.use(expressValidator())
	.use(compress())
	.use(expressFlash())
	.use(cookieParser())
	.use(session({
		secret: settings.CookieSecret,
		store: new MongoStore({
			db: settings.Mongo.Db,
			collection: settings.Mongo.SessionCollection
		})
	}))
	.use(passport.initialize())
	.use(passport.session())
	.use(express.static(path.join(__dirname, 'public')))
	.use(function(req, res, next) {
		roleHelper.setTopBarLoggedIn(req, res, next, app);
	})
	.use(function(req, res, next) {
		roleHelper.setTopBarRol(req, res, next, app);
	})
	.use('/admins/', admin)
	.use('/api/', api)
	.use('/tests/', tests)
	.use('/', users)
	.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});



/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: "err.message",
		error: {}
	});
});


module.exports = app;