var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var users = require('./../model/m_users.js');
var passport = require('passport');

// route middleware that will happen on every request
router.use(function(req, res, next) {
	for (var i in req.validationErrors(true)) {
		if (typeof(req.validationErrors(true)[i].value) != "undefined") {
			req.flash('form', {
				field: req.validationErrors(true)[i]
			});
		}
	}
	next();
});


router.get('/', function(req, res) {
	var a = users.currentUserRole.isAdmin(req);
	res.render('index', {
		title: 'Iting'
	});
});

router.route('/maps/areas')
	.get(function(req, res) {
		ob = {};
		ob.name = "asd";
		res.send(ob);
	})
	.post(passport.authenticate('local', {
		failureRedirect: '/login'
	}), function(req, res) {
		users.session(req, res);
	});

module.exports = router;