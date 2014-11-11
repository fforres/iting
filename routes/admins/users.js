var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var users = require('./../../model/m_users.js');

// route middleware that will happen on every request
router.use(function(req, res, next) {
	if (req.method == "POST") {
		req.assert("nombre", "required")
			.notEmpty();
		req.assert("direccion", "required")
			.notEmpty();
		req.assert("comuna", "required")
			.notEmpty();
		req.assert("tipo", "required")
			.notEmpty();
		req.assert("web", "required")
			.notEmpty();
		req.assert("email", "required")
			.notEmpty();
		req.assert("telefono", "required")
			.notEmpty();

		req.sanitize("nombre")
			.trim();
		req.sanitize("direccion")
			.trim();
		req.sanitize("comuna")
			.trim();
		req.sanitize("tipo")
			.trim();
		req.sanitize("web")
			.trim();
		req.sanitize("email")
			.trim();
		req.sanitize("telefono")
			.trim();
	}

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
		users.ShowUsersList(req, res);
	});


router.route('/all')
	.get(function(req, res) {
		users.ShowUsersList(req, res);
	});



router.route('/edit/:MongoId/asignaralocal')
	.get(function(req, res) {
		users.ShowEditUser_AsignarALocal(req, res);
	})
	.post(function(req, res) {
		users.UpdateUser_AsignarALocal(req, res);
	});

router.route('/edit/:MongoId/roles')
	.get(function(req, res) {
		users.ShowEditUser_Roles(req, res);
	})
	.post(function(req, res) {
		users.UpdateUser_Roles(req, res, req.params.MongoId);
	});



module.exports = router;