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
		res.render("app/inventario/list",{
			title:"iting"
		})
	});
	

router.route("/new")
	.get(function(req, res) {
		res.render("app/inventario/new",{
			title:"iting"
		})
	})


module.exports = router;