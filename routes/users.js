var express = require('express');
var router = express.Router();
var _ = require('underscore');
var users = require('./../model/m_users.js');
var User = require('./../model/user.js');
var restaurantes = require('./../model/m_restaurantes.js');
var Restaurante = require('./../model/restaurante.js');
var roleHelper = require('./../helpers/roleHelper.js');
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
		if (roleHelper.isAuthenticated(req)) {
			res.redirect('/')
		} else {
			res.render('users/users_login', {
				title: 'Iting'
			})
		}
	})
	.post(function(req,res){
		User.Login(req,res)
	})

router.route('/register')
	.get(function(req, res) {
		users.ShowCreateUser(req, res);
		if (roleHelper.isAuthenticated(req)) {
			res.redirect('/')
		} else {
			res.render('users/users_login', {
				title: 'Iting'
			})
		}
	})
	.post(function(req, res) {
		if (roleHelper.isAuthenticated(req)) {
			res.redirect('/')
		} else {
			User.Create(req,res)
		}
	})

router.route('/profile')
	.get(function(req, res) {
		User.GetProfile(req,res);
	})
	.post(function(req, res) {
		users.EditUser(req, res);
	})

router.route('/logout')
	.get(function(req, res) {
		User.Logout(req,res);
	});


router.route("/restaurant/:MongoId")
	.get(function(req, res) {
		Restaurante.RestauranteById(req, res);
	});


module.exports = router;