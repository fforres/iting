var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var Reportes = require('./../../model/reportes.js');
 
// route middleware that will happen on every request

 
router.use(function(req, res, next) {
	next();
});


router.route('/')
	.get(function(req, res) {
		res.render("app/reportes/list",{
			title:"iting"
		})
	});
	
router.route('/flujodiarioitems')
	.get(function(req, res) {
		res.render("app/reportes/flujodiarioitems",{
			title:"iting"
		})
	});
	


router.route('*')
	.get(function(req, res) {
		res.render("app/reportes/list",{
			title:"iting"
		})
	});

module.exports = router;