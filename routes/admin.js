var express          = require('express');
var router           = express.Router();
var expressValidator = require('express-validator'); 
var passport         = require('passport');
var publics          = require('./../model/m_restaurantes.js');
var users            = require('./../model/m_users.js');
var roleHelper = require('./../helpers/roleHelper.js');

var routeRestaurantes   = require('./../routes/admins/restaurantes');
var routeUsers  	 	= require('./../routes/admins/users');


/* GET users listing. */

router.use(function(req,res,next){
	if(roleHelper.isNotAdmin(req)){
		req.flash('access', { msg: 'No tienes permisos para acceder a esta seccion de Iting. Si tienes dudas envíanos un mensaje por Twitter o Facebook. (Siempre respondemos)' });
		res.redirect('/');
	}
	next()
});
//req.session.user.logged
router.use('/restaurantes',routeRestaurantes);
router.use('/users',routeUsers);


module.exports = router;
