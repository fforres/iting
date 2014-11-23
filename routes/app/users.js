var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var User = require('./../../model/user.js');

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



router.route('/')
	.get(function(req, res) {
		User.GetUsersPorRestaurant(req, res);
	});




module.exports = router;