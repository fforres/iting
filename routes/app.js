var express          = require('express');
var router           = express.Router();
var expressValidator = require('express-validator'); 
var roleHelper = require('./../helpers/roleHelper.js');

var routeRestaurantes   = require('./../routes/app/restaurantes');
var routeUsers  	 	= require('./../routes/app/users');
var routeMesas  	 	= require('./../routes/app/mesas');


/* GET users listing. */
router.use(function(req,res,next){
	if(!roleHelper.isAuthenticated(req)){
		req.flash('access', { msg: 'No tienes permisos para acceder a esta seccion de Iting. Si tienes dudas envíanos un mensaje por Twitter o Facebook. (Siempre respondemos)' });
		res.redirect('/');
	}
	next()
});
//req.session.user.logged
router.use('/restaurantes',routeRestaurantes);
router.use('/usuarios',routeUsers);
router.use('/mesas',routeMesas);
router.route('/*')
	.get(function(req, res) {
		//publics.ShowRestauranteList(req, res);
		res.redirect("/"); 
	});

module.exports = router;
