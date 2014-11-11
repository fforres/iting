var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var publics = require('./../../model/m_restaurantes.js');
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
		/*
		req.assert("email", "required")
			.notEmpty();
		*/
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
		publics.ShowRestauranteList(req, res);
	});

router.route('/deleted')
	.get(function(req, res) {
		publics.ShowRestauranteListDeleted(req, res);
	});

router.route("/new")
	.get(function(req, res) {
		publics.ShowCreateRestaurante(req, res);
	})
	.post(function(req, res) {

		publics.CreateRestaurante(req, res);
	});



router.route("/edit")
	.get(function(req, res) {
		publics.ShowEditRestaurante(req, res);
	})
	.post(function(req, res) {

		publics.CreateRestaurante(req, res);
	});

router.route("/edit/:MongoId/photo")
	.get(function(req, res) {
		publics.ShowEditRestaurantePhoto(req, res);
	})
	.post(function(req, res) {
		if (req.validationErrors()) {
			publics.ShowEditRestaurantePhoto(req, res);
		} else {
			console.log(2);
			publics.EditRestaurantePhoto(req, res);
		}
	});

router.route("/edit/:MongoId")
	.get(function(req, res) {
		publics.ShowEditRestaurante(req, res);
	})
	.post(function(req, res) {
		if (req.validationErrors()) {
			console.log(req.validationErrors());
			publics.ShowEditRestaurante(req, res);
		} else {
			console.log(2);
			publics.EditRestaurante(req, res);
		}
	});


router.route("/:MongoId")
	.get(function(req, res) {
		publics.ShowPerfilRestaurante(req, res);
	});



router.route("/delete/:MongoId")
	.get(function(req, res) {
		publics.ShowDeleteRestaurante(req, res);
	})
	.post(function(req, res) {
		publics.DeleteRestaurante(req, res);
	});


router.route("/undelete/:MongoId")
	.get(function(req, res) {
		publics.ShowUnDeleteRestaurante(req, res);
	})
	.post(function(req, res) {
		publics.UnDeleteRestaurante(req, res);
	});


router.route('*')
	.get(function(req, res) {
		publics.ShowRestauranteList(req, res);
	});

module.exports = router;