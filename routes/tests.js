var express          = require('express');
var router           = express.Router();
var expressValidator = require('express-validator'); 
var users            = require('./../model/m_users.js');
var passport         = require('passport');

// route middleware that will happen on every request
router.use(function(req,res,next){
	for(var i in req.validationErrors(true))
	{
		if(typeof(req.validationErrors(true)[i].value) != "undefined"){
			req.flash('form', { field:req.validationErrors(true)[i]});
		} 
	}
	next();
});


router.get('/', function(req,res) {
	res.send("qwe")
})


router.route('/maps')
	.get(function(req,res) {
		res.render('tests/maps',{})
	})
	
router.route('/webgl')
	.get(function(req,res) {
		res.render('tests/webgl',{})
	})
	


router.route('/login')
	.get(function(req,res) {
		if(req.isAuthenticated()){
			res.redirect('/')	
		}
		else{
			res.render('users/users_login',{
				title:'Iting'
			})
		}
	})
	.post(passport.authenticate('local', {
			failureRedirect: '/login'
		}), function(req,res){
		 	users.session(req, res);
		}
	)

router.route('/register')
	.get(function(req,res) {
		users.ShowCreateUser(req,res);
	})
	.post(function(req,res) {
		users.CreateUser(req,res);
	})

router.route('/profile')
	.get(function(req,res) {
		users.ShowEditUser(req,res);
	})
	.post(function(req,res) {
		users.EditUser(req,res);
	})

router.route('/logout')
	.get(function(req, res){
		req.logOut();
		res.redirect("/");
	});
	




module.exports = router;