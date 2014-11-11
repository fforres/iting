var LocalStrategy    = require('passport-local').Strategy;
var Users = require('./../model/m_users.js');
module.exports = function (app, passport, request){

	passport.serializeUser(function(user, done) {
	  	done(null, user._id);
	});

	passport.deserializeUser(function(usuario,done){
		Users.findUserById(usuario,function(err,user){
			done(err,user);
		})
	})

	//usar local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email,password,done){
			Users.findUserByEmail(
					{email:email,password:password}
				,function(err,usuario,data){
					if(err){
						return done(err);
					}
					if(!usuario){
						return done(null, false,{message: "No tenemos ningun usuario con ese email"});
					}
					if(!Users.authenticate(usuario,data.password)){
						return done(null, false, { message: 'invalid login or password' });
					}
					return done(null, usuario);
				}
			)
		}
	))
}