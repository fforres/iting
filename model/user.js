var async = require("async");
var crypto = require('crypto');
var _REQUEST = require("request");
var _ = require('underscore');

 
var createUser = function(req, res) {
	ob = {
		"username": req.body.username,
		"email": req.body.email,
		"password": req.body.password
	};
	var stringOB = global.API_URL + "/usuarios";
	_REQUEST(
    { 
    	method: 'POST',
    	uri: stringOB ,
    	json : true,
    	body : ob
    }  , function (error, response, body) {
		 
	if(body){
		if(body.error){
			req.flash('error', {
				msg: body.error.message
			});
			res.redirect("/")
		}else{
			logInUser(req,res,body);
		}
	}
	if(response && response.statusCode == 200){
		}
		
    })
}

var logInUser = function(req,res,user){
	ob = {
		"email": req.body.email,
		"password": req.body.password
	};
	var stringOB = global.API_URL + "/usuarios/login";
	_REQUEST(
    { 
    	method: 'POST',
    	uri: stringOB ,
    	json : true,
    	body : ob
    }  , function (error, response, body) {
		 
	if(body){
		if(body.error){
			req.flash('error', {
				msg: body.error.message
			});
			res.redirect("/")
		}else{
			getUserRole(req,res,body);
		}
	}
	if(response && response.statusCode == 200){
		}
		
    })
}


var logOutUser = function(req,res,user){
	_ACCESTOKEN="access_token="+req.session.user.key
	var stringOB = global.API_URL + "/usuarios/logout?"+_ACCESTOKEN;
	_REQUEST(
	    { 
	    	method: 'GET',
	    	uri: stringOB ,
	    	json : true
	    }  ,
	    function (error, response, body) {
				 
			if(body){
				if(body.error){
					req.flash('error', {
						msg: body.error.message
					});
				}else{
					req.flash('error', {
						msg: "Deslogueado correctamente"
					});
				}
				req.session.destroy(function(err) {
					res.redirect("/");
				})
			}
			
	    }
    )
}

var getUserRole = function(req,res,user){
	var user = user;
	var ob2 = {
		include:["role"],
		where:{
			principalId: user.userId
		}
	};
	var stringOB2 = global.API_URL + "/rolmappings?filter="+JSON.stringify(ob2)
	_REQUEST(
    { 
    	method: 'GET', 
    	uri: stringOB2,
    	json:true
    }  
    , function (error, response, body) {
		if(body){
			getUserRestaurant(req,res,user,body)
		}
		if(response && response.statusCode == 200){
			}
			
	    })
}


var getUserRestaurant = function(req,res,user,rol){
	var user = user;
	var ob2 = {
		include:["restaurante"],
		where:{
			usuarioId: user.userId
		}
	};
	var stringOB2 = global.API_URL + "/usuarios_restaurantes?filter="+JSON.stringify(ob2)
	_REQUEST(
    { 
    	method: 'GET', 
    	uri: stringOB2,
    	json:true
    }  
    , function (error, response, body) {
		if(body){
			registerUserSession(req,res,user,rol,body)
		}
		if(response && response.statusCode == 200){
			}
			
	    })
}

var registerUserSession = function(req,res,user,roles,restaurant)
{

	
	var sess = req.session;
	var ob = {}
	ob.logged = true;
	ob.key = user.id
	ob.id = user.userId,
	ob.rol = {}
	ob.rol.roles = []
	
	for (rol in roles){
		var newob = {
			name : roles[rol].role.name,
			id :  roles[rol].role.id
		}
		ob.rol.roles.push(newob);
		ob.rol["is"+roles[rol].role.name] = true;
	}
	
	if(restaurant[0] && restaurant[0].restaurante && restaurant[0].restaurante.id){
		ob.restaurant = {
			nombre: restaurant[0].restaurante.nombre,
			id: restaurant[0].restaurante.id,
		}
	}
	console.log(ob)
	sess.user = ob;
	req.flash('success', {
		msg: 'Estas logueado'
	});
	res.redirect("/")
}

var getProfile = function(req,res){
	_ACCESTOKEN="access_token="+req.session.user.key
	var stringOB = global.API_URL + "/usuarios/"+req.session.user.id+"?"+_ACCESTOKEN;
	_REQUEST(
    { 
    	method: 'GET',
    	uri: stringOB,
    	json:true
    }  , function (error, response, body) {
		 
	if(body){
		if(body.error){
			req.flash('error', {
				msg: body.error.message
			});
			res.redirect("/")
		}else{
			res.render('users/users_edit', {
				title: 'Iting',
				user:body
			});
		}
	}
	if(response && response.statusCode == 200){
		}
		
    })
	

}


var getProfile = function(req,res){
	_ACCESTOKEN="access_token="+req.session.user.key
	var stringOB = global.API_URL + "/usuarios/"+req.session.user.id+"?"+_ACCESTOKEN;
	_REQUEST(
    { 
    	method: 'GET',
    	uri: stringOB,
    	json:true
    },
    function (error, response, body) {
			 
		if(body){
			if(body.error){
				req.flash('error', {
					msg: body.error.message
				});
				res.redirect("/")
			}else{
				res.render('users/users_edit', {
					title: 'Iting',
					user:body
				});
			}
		}
		if(response && response.statusCode == 200){
			}
			
	    }
    )
	

}

var getUsersWithRolesPorRestaurant = function(req,res,cb){
	var sess = req.session;
	console.log(sess.user)
	var restaurantId = sess.user.restaurant.id;
	if(restaurantId){
		var stringOB = global.API_URL + "/restaurantes/"+restaurantId+"/usuarios";
		_REQUEST(
	    { 
	    	method: 'GET',
	    	uri: stringOB,
	    	json:true
	    },
	    function (error, response, body) {
				 
			if(body){
				if(body.error){
					req.flash('error', {
						msg: body.error.message
					});
					res.redirect("/")
				}else{
					var arrids = [];
					for(k in body){
						arrids.push(body[k].id)
					}
							
							var ob2 = {
								where:{
									id:{
										inq:arrids
									} 
								}
							};
							var stringOB2 = global.API_URL + "/usuarios?filter="+JSON.stringify(ob2)
							_REQUEST(
						    { 
						    	method: 'GET',
						    	uri: stringOB,
						    	json:true
						    },
						    function (error, response, body) {
									 
								if(body){
									if(body.error){
										req.flash('error', {
											msg: body.error.message
										});
										res.redirect("/")
									}else{
										
										console.log(body.length)
										console.log("body")
										res.render('app/users/users_list', {
											title: 'Iting',
											users:body
										});
									}
								}
								if(response && response.statusCode == 200){
								}
						    }
						    )

					
				}
			}
			if(response && response.statusCode == 200){
			}
	    }
	    )
	}
}
exports.Create = createUser;
exports.Login = logInUser;
exports.Logout = logOutUser;
exports.GetProfile = getProfile;
exports.GetUsersPorRestaurant = getUsersWithRolesPorRestaurant;

/*

req.session.destroy(function(err) {
			res.redirect("/");
		})

*/