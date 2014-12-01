var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var Item = require('./../../model/item.js');

// route middleware that will happen on every request


router.use(function(req, res, next) {
	next();
});


router.route('/')
	.get(function(req, res) {
		res.render("app/inventario/new",{
			title:"iting"
		})
	});
	

router.route("/new")
	.get(function(req, res) {
		res.render("app/item/new",{
			title:"iting"
		})
	})
	.post(function(req, res) {
		Item.Create(req, res);
	});
	

router.route("/edit/:MongoId")
	.get(function(req, res) {
		//publics.ShowEditRestaurante(req, res);
		Item.GetById(req, res,req.params.MongoId);

	})
	.post(function(req, res) {
		Item.Update(req, res,req.params.MongoId);
		//publics.EditRestaurante
	});


router.route("/:MongoId")
	.get(function(req, res) {
		Item.ShowPerfilRestaurante(req, res);
	});



router.route("/delete/:MongoId")
	.get(function(req, res) {
		//publics.ShowDeleteRestaurante(req, res);
		Item.Delete_RestauranteById(req,res,req.params.MongoId);
	})
	/*
	.post(function(req, res) {
		publics.DeleteRestaurante(req, res);
	});
	*/


router.route("/undelete/:MongoId")
	.get(function(req, res) {
		Item.Undelete_RestauranteById(req,res,req.params.MongoId);
		//publics.ShowUnDeleteRestaurante(req, res);
	})
	.post(function(req, res) {
		Item.UnDeleteRestaurante(req, res);
	});


router.route('*')
	.get(function(req, res) {
		Item.GetItemsPorRestaurante(req, res);(req,res);
	});

module.exports = router;