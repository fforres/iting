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
	var stringOB = global.API_URL + "/users";
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
	var stringOB = global.API_URL + "/users/login";
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

var getUserRole = function(req,res,user){
	var user = user;
	
		/*
	{"where":{"principalId":"546bae57832a608c06ab5b6c"},"include":["role"]}
	*/
	
	var ob2 = {
		include:["role"],
		where:{
			principalId: user.userId
		}
	};
	var stringOB2 = global.API_URL + "/RoleMappings?filter="+JSON.stringify(ob2)
	_REQUEST(
    { 
    	method: 'GET', 
    	uri: stringOB2
    }  
    , function (error, response, body) {
			 
		if(body){
			registerUserSession(req,res,user,JSON.parse(body))
		}
		if(response && response.statusCode == 200){
			}
			
	    })
}
var registerUserSession = function(req,res,user,rol)
{
	console.log(user)
	console.log(rol[0])	
	
	var sess = req.session;
	var ob = {}
	ob.logged = true;
	ob.key = user.id
	ob.id = user.userId,
	ob.rol = {
		name : rol[0].role.name,
		id : rol[0].role.id
	}
	sess.user = ob;
	req.flash('success', {
		msg: 'Estas logueado'
	});
	res.redirect("/")
}

var getProfile = function(req,res){
	_ACCESTOKEN="?access_token="+req.session.user.key
	var stringOB = global.API_URL + "/users/"+req.session.user.id+_ACCESTOKEN;
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
exports.Create = createUser;
exports.Login = logInUser;
exports.GetProfile = getProfile;
