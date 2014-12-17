var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var Inventario = require('./../../model/inventario.js');

// route middleware that will happen on every request


router.use(function(req, res, next) {
	next();
});


router.route('/')
	.get(function(req, res) {
		res.render("app/inventario/list",{
			title:"iting"
		})
	});
	

	

router.route("/new")
	.get(function(req, res) {
		res.render("app/inventario/new",{
			title:"iting"
		})
	});


router.route('/:MongoId/edit')
	.get(function(req, res) {
		Inventario.Get(
			req,
			res,
			req.params.MongoId,
			function(req, arr,historial,moment){
				res.render('app/inventario/edit', {
					title: 'Iting',
					entradas:arr,
					fecha: moment(historial[0].fecha).format("ddd DD MMMM - YYYY"),
					fechaformat: moment(historial[0].fecha).format("DD/MM/YYYY"),
					id: historial[0].id
				})
			}
		)
	});
	
	
router.route('/:MongoId')
	.get(function(req, res) {
		Inventario.Get(
			req,
			res,
			req.params.MongoId,
			function(req, arr,historial,moment){
				res.render('app/inventario/show', {
					title: 'Iting',
					entradas:arr,
					fecha: moment(historial[0].fecha).format("ddd DD MMMM - YYYY"),
					fechaformat: moment(historial[0].fecha).format("DD/MM/YYYY"),
					id: historial[0].id
				})
			}
		)
	});


module.exports = router;