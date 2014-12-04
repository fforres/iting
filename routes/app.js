var express          = require('express');
var router           = express.Router();
var expressValidator = require('express-validator'); 
var roleHelper = require('./../helpers/roleHelper.js');

var routeRestaurantes   = require('./../routes/app/restaurantes');
var routeUsers  	 	= require('./../routes/app/users');
var routeMesas  	 	= require('./../routes/app/mesas');
var routeItems  	 	= require('./../routes/app/items');
var routeInventario  	 	= require('./../routes/app/inventario');
var routeReportes  	 	= require('./../routes/app/reportes');

/* GET users listing. */
router.use(function(req,res,next){
	if(!roleHelper.isAuthenticated(req)){
		req.flash('access', { 
		    msg: 'No tienes permisos para acceder a esta seccion de Iting. Si tienes dudas envíanos un mensaje por Twitter o Facebook. (Siempre respondemos)' });
		res.redirect('/');
	}else{
	    next()	    
	}
});
//req.session.user.logged
router.use('/restaurante',routeRestaurantes);
router.use('/usuarios',routeUsers);
router.use('/mesas',routeMesas);
router.use('/items',routeItems);
router.use('/reportes',routeReportes);
router.use('/inventario',routeInventario);
router.route('/*')
	.get(function(req, res) {
		//publics.ShowRestauranteList(req, res);
		res.redirect("/"); 
	});

module.exports = router;
