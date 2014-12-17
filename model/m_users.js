var mongojs = require("mongojs");
var db = mongojs("localhost/iting");
var async = require("async");
var crypto = require('crypto');
var _ = require('underscore');
var _REQUEST = require("request");


function _ShowCreateUser(req, res) {
	res.render('users/users_new', {
		title: 'Iting',
		errores: {
			form: req.formErrors,
		},
	});
}


function _ShowEditUser(req, res) {
	res.render('users/users_edit', {
		title: 'Iting',
		errores: {
			form: req.formErrors,
			user: _findUserById(req.session.passport.user)
		},
	});
}


function _ShowEditUser_AsignarALocal(req, res,id) {
	
	
	_ACCESTOKEN="access_token="+req.session.user.key
	var stringOB = global.API_URL + "/usuarios/"+id+"?"+_ACCESTOKEN
	_REQUEST(
    { 
    	method: 'GET', 
    	uri: stringOB,
    	json:true
    }  
    , function (error, response, usuario) {
		if(usuario){
			if(usuario.error){

			}else{
			
				var ob = 
				{
					include:["restaurante"],
					where : 
					{
						usuarioId: usuario.id
					}
				}
				_ACCESTOKEN="access_token="+req.session.user.key
				var stringOB = global.API_URL + "/usuarios_restaurantes/?filter="+JSON.stringify(ob)+"&"+_ACCESTOKEN
				_REQUEST(
				{ 
					method: 'GET', 
					uri: stringOB,
					json:true
				}  
				, function (error, response, usuariorestaurant) {
						var stringOB = global.API_URL + "/restaurantes";
						
						_REQUEST(
						{ 
							method: 'GET', 
							uri: stringOB,
							json:true
						}  
						, function (error, response, restaurantes) {


								res.render('admins/users/users_edit_local', {
									title: 'Iting',
									usuario: usuario,
									restaurante: usuariorestaurant[0],
									restaurantes:restaurantes
								});
						
						})
				})

			}
		}
    })
}

function _ShowUsersList(req, res) {
	
	
	
	_ACCESTOKEN="access_token="+req.session.user.key

	var ob = 
	{
		include:["restaurante"]
	}
	
	
	var stringOB = global.API_URL + "/usuarios?"+_ACCESTOKEN
	_REQUEST(
    { 
    	method: 'GET', 
    	uri: stringOB,
    	json:true
    }  
    , function (error, response, body) {
		if(body){
			if(body.error){
				
			}else{
				res.render('admins/users/users_list', {
					title: 'Iting',
					users: body
				});
			}
		}
		if(response && response.statusCode == 200){
			}
			
	    })
	    
}

function _ShowEditUser_Roles(req, res) {
	async.parallel({
			user: function(callback) {
				_findUserById(req.params.MongoId, callback);
			},
			roles: function(callback) {
				GetRoles(callback);
			}
		},
		function(err, results) {
			var Helper = _.pairs(results.user.rol);
			var roleHelper = [];
			var roleHelper2 = results.roles;
			var roleHelper3 = results.roles;

			for (var i = 0; i < _.size(Helper); i++) {
				var a = {};
				a.nombre = Helper[i][1].nombre;
				a.value = Helper[i][1].value;
				roleHelper.push(a);
			}
			res.render("admins/users/users_roles", {
				user: results.user,
				roles: roleHelper
			});
		}
	);
}

exports.CreateUser = function(req, res) {
	var ob = {};
	ob.req = req;
	ob.res = res;
	GetRolesArray(ob, doCreateUser);
};

function doCreateUser(docs, ob) {
	var req = ob.req;
	var res = ob.res;
	var usuarios = db.collection('usuarios');
	var salt = makeSalt();
	usuarios.ensureIndex({
		"email": 1
	}, {
		unique: true
	});
	usuarios.save({
		email: req.body.email,
		salt: salt,
		password: encryptPassword(req.body.password, salt),
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		rol: docs,
		fechaCreacion: new Date()
	}, function(err, docs) {
		if (err) {
			req.flash('info', {
				msg: 'Este correo ya existe en nuestros registros. ¿Seguro que no has olvidado tu contraseña?'
			});
			_ShowCreateUser(req, res);
		} else {
			res.redirect('/login');
		}
	});
}

exports.UpdateUser = function(req, res, id) {
	var usuarios = db.collection('usuarios');
	var salt = makeSalt();
	usuarios.update({
		_id: id
	}, {
		email: req.body.email,
		salt: salt,
		password: encryptPassword(req.body.password, salt),
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		rol: req.body.rol,
	}, function(err, docs) {
		if (err) {
			req.flash('info', {
				msg: 'Este correo ya existe en nuestros registros. ¿Seguro que no has olvidado tu contraseña?'
			});
			_ShowCreateUser(req, res);
		} else {
			res.redirect(req.utils.originalUrl);
		}
	});
};

exports.UpdateUser_Roles = function(req, res, id) {
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		for (var k in req.body) {
			if (req.body[k] == "on") {
				req.body[k] = true;
			}
		}
		async.parallel({
				frontend: function(callback) {
					callback(null, req.body);
				},
				roles: function(callback) {
					GetRoles(callback);
				}
			},
			function(err, results) {
				var roleHelper = _.pairs(results.frontend);
				var roleHelper2 = results.roles;
				var roleHelper3 = results.roles;
				async.series([

					function(callback) {
						for (var i = 0; i < roleHelper3.length; i++) {
							roleHelper3[i].value = false;
						}
						callback(null, roleHelper3);
					},
					function(callback) {
						for (var i = 0; i < roleHelper2.length; i++) {
							for (var j = 0; j < roleHelper.length; j++) {
								if (roleHelper2[i].nombre == roleHelper[j][0]) {
									roleHelper3[i].value = true;
								}
							}
						}
						callback(null, roleHelper3);
					},
					function(callback) {
						callback(null, null);
					}
				], function(err, resultado) {
					var usuarios = db.collection('usuarios');
					usuarios.update({
						_id: mongojs.ObjectId(id)
					}, {
						$set: {
							rol: resultado[1]
						},
					}, function(err, docs) {
						if (err) {
							req.flash('info', {
								msg: 'error al updatear info :O'
							});
							_ShowCreateUser(req, res);
						} else {
							req.flash('success', {
								msg: 'Done!'
							});
							res.redirect(req.utils.url);
						}
					});
				});


			}
		);

	}

};



function _findUserByEmail(data, cb) {
	var usuarios = db.collection('usuarios');
	usuarios.findOne({
		email: data.email
	}, function(err, _user) {
		if (cb) {
			cb(err, _user, data);
		} else {
			return _user;
		}
	});
}


function GetUsers(callback) {
	var usuarios = db.collection('usuarios');
	usuarios.find(function(err, docs) {
		if (!err) {
			callback(null, docs);
		}
	});
}

function GetRolesArray(ob, callback) {
	var usuarios = db.collection('roles');
	usuarios.find(function(err, docs) {
		if (!err) {
			var rol = _.find(docs, function(item) {
				return item.nombre == "Admin";
			});
			rol.value = false;

			var rol2 = _.find(docs, function(item) {
				return item.nombre == "PublicUser";
			});
			rol2.value = true;

			var rol3 = _.find(docs, function(item) {
				return item.nombre == "Waiter";
			});
			rol3.value = false;

			var rol4 = _.find(docs, function(item) {
				return item.nombre == "Boss";
			});
			rol4.value = false;
			var arr = [];
			arr.push(rol);
			arr.push(rol2);
			arr.push(rol3);
			arr.push(rol4);

			callback(docs, ob);
		}
	});
}

function GetRoles(callback) {
	var usuarios = db.collection('roles');
	usuarios.find(function(err, docs) {
		if (!err) {
			if (typeof callback == "function") {
				callback(null, docs);
			} else {
				return docs;
			}
		}
	});
}



function GetUsersRoles(id, cb) {
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		var usuarios = db.collection('usuarios');
		usuarios.findOne({
			_id: mongojs.ObjectId(id)
		}, function(err, user) {
			if (cb)
				cb(err, user.rol);
			else
				return false;
		});
	} else {
		return false;
	}
}



function _findUserById(id, cb) {
	if (/^[0-9a-fA-F]{24}$/.test(id)) {
		var usuarios = db.collection('usuarios');
		usuarios.findOne({
			_id: mongojs.ObjectId(id)
		}, function(err, user) {
			if (cb)
				cb(err, user);
			else
				return user;
		});
	} else {
		return false;
	}

}
function _UpdateUser_AsignarALocal(req,res,id){
	var ob = 
	{
		usuarioId: id
	}
	var stringOB = global.API_URL + "/usuarios_restaurantes/findOne?filter="+JSON.stringify(ob);
						
	_REQUEST(
	{ 
		method: 'GET', 
		uri: stringOB,
		json:true
	}  
	, function (error, response, body) {
			var type = "PUT"
			var stringOB = global.API_URL + "/usuarios_restaurantes";

			if(body.error){
				type = "POST"
				stringOB = global.API_URL + "/usuarios_restaurantes";
			}else{
				stringOB = global.API_URL + "/usuarios_restaurantes/"+body.id;
			}
		
			var ob = {
				usuarioId : id,
				restauranteId: req.body.restaurante
			}
			console.log(body)
			console.log(ob)
			console.log(type)
			console.log(stringOB)
			

			_REQUEST(
			{ 
				method: type, 
				uri: stringOB,
				body:ob,
				json:true
			}  
			, function (error, response, body) {
				if(body.error){
					req.flash('error', {
						msg: "Error en el cambio de local"
					});
				}else{
					req.flash('success', {
						msg: "Local cambiado exitosamente"
					});
				}
				res.redirect('/admins/users/edit/'+id+"/asignaralocal")
			})
			
			
	})
}

function makeSalt() {
	return Math.round((new Date()
		.valueOf() * Math.random())) + '';
}

function _authenticate(user, password) {
	return encryptPassword(password, user.salt) === user.password;
}

function encryptPassword(password, salt) {
	if (!password) return '';
	try {
		var encrypted = crypto.createHmac('sha1', salt)
			.update(password)
			.digest('hex');
		return encrypted;
	} catch (err) {
		return '';
	}
}

var loginVar = function(req, res) {
	var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
	delete req.session.returnTo;
	req.flash('success', {
		msg: 'Success! You are logged in.'
	});
	res.redirect(redirectTo);

};



var currentUserRole = {
	isAdmin: function(req) {
		if (req.user) {
			var rol = _.find(req.user.rol, function(item) {
				return item.nombre == "Admin";
			});
			if (rol.value) {

				return rol.value;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	isPublicUser: function(req) {
		var rol = _.find(req.user.rol, function(item) {
			return item.nombre == "PublicUser";
		});
		if (req.user) {
			if (rol.value) {
				return rol.value;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	isWaiter: function(req) {
		var rol = _.find(req.user.rol, function(item) {
			return item.nombre == "Waiter";
		});
		if (req.user) {
			if (rol.value) {
				return rol.value;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	isBoss: function(req) {
		var rol = _.find(req.user.rol, function(item) {
			return item.nombre == "Boss";
		});
		if (req.user) {
			if (rol.value) {
				return rol.value;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
};



exports.ShowCreateUser = _ShowCreateUser;
exports.ShowEditUser = _ShowEditUser;
exports.ShowUsersList = _ShowUsersList;
exports.ShowEditUser_Roles = _ShowEditUser_Roles;
exports.ShowEditUser_AsignarALocal = _ShowEditUser_AsignarALocal;
exports.UpdateUser_AsignarALocal = _UpdateUser_AsignarALocal;

exports.findUserByEmail = _findUserByEmail;
exports.findUserById = _findUserById;
exports.authenticate = _authenticate;
exports.session = loginVar;
exports.currentUserRole = currentUserRole;