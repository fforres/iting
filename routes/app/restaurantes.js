var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var publics = require('./../../model/m_restaurantes.js');
var Restaurante = require('./../../model/restaurante.js');
var User = require('./../../model/user.js');
var passport = require('passport');
var users = require('./../../model/m_users.js');

// route middleware that will happen on every request


router.use(function(req, res, next) {
	next();
});


router.route('/')
	.get(function(req, res) {
		//publics.ShowRestauranteList(req, res);
		Restaurante.Restaurantes(req,res);
	});

router.route('/deleted')
	.get(function(req, res) {
		Restaurante.RestaurantesDeshabilitados(req,res)
		//publics.ShowRestauranteListDeleted(req, res);
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
		res.redirect("/admins/restaurantes")
	});


router.route("/edit/:MongoId/photo")
	.get(function(req, res) {
		publics.ShowEditRestaurantePhoto(req, res);
	})
	.post(function(req, res) {
		if (req.validationErrors()) {
			publics.ShowEditRestaurantePhoto(req, res);
		} else {
			publics.EditRestaurantePhoto(req, res);
		}
	});

router.route("/edit/:MongoId")
	.get(function(req, res) {
		//publics.ShowEditRestaurante(req, res);
		Restaurante.RestauranteById(req, res,req.params.MongoId);

	})
	.post(function(req, res) {
		Restaurante.Update_RestauranteById(req, res,req.params.MongoId);
		//publics.EditRestaurante
	});


router.route("/:MongoId")
	.get(function(req, res) {
		publics.ShowPerfilRestaurante(req, res);
	});



router.route("/delete/:MongoId")
	.get(function(req, res) {
		//publics.ShowDeleteRestaurante(req, res);
		Restaurante.Delete_RestauranteById(req,res,req.params.MongoId);
	})
	/*
	.post(function(req, res) {
		publics.DeleteRestaurante(req, res);
	});
	*/


router.route("/undelete/:MongoId")
	.get(function(req, res) {
		Restaurante.Undelete_RestauranteById(req,res,req.params.MongoId);
		//publics.ShowUnDeleteRestaurante(req, res);
	})
	.post(function(req, res) {
		publics.UnDeleteRestaurante(req, res);
	});


router.route('*')
	.get(function(req, res) {
		publics.ShowRestauranteList(req, res);
	});

module.exports = router;