var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var _ = require('underscore');
var users = require('./../model/m_users.js');
var restaurantes = require('./../model/m_restaurantes.js');
var Restaurante = require('./../model/restaurante.js');
var passport = require('passport');
// route middleware that will happen on every request


router.get('/', function(req, res) {
	var a = users.currentUserRole.isAdmin(req);
	if (req.query && req.query["srch-term"]) {
		Restaurante.Search(req.query["srch-term"], req, res);
	} else {
		res.render('index', {
			title: 'Iting'
		});
	}

});

router.route('/login')
	.get(function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/')
		} else {
			res.render('users/users_login', {
				title: 'Iting'
			})
		}
	})
	.post(passport.authenticate('local', {
		failureRedirect: '/login'
	}), function(req, res) {
		users.session(req, res);
	})

router.route('/register')
	.get(function(req, res) {
		users.ShowCreateUser(req, res);
	})
	.post(function(req, res) {
		users.CreateUser(req, res);
	})

router.route('/profile')
	.get(function(req, res) {
		users.ShowEditUser(req, res);
	})
	.post(function(req, res) {
		users.EditUser(req, res);
	})

router.route('/logout')
	.get(function(req, res) {
		req.logOut();
		res.redirect("/");
	});


router.route("/restaurant/:MongoId")
	.get(function(req, res) {
		Restaurante.Restaurante(req, res);
	});


module.exports = router;