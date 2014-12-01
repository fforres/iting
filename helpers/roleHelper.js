
function _Rol(req, res, next, app) {
	if (req.session.user && req.session.user.rol) {
		app.locals.rol = {};
		
		
		if(req.session.user.rol.isadmin){
			app.locals.rol.isadmin = true;	
		}else{
			app.locals.rol.isadmin = false;
		}
		
		if(req.session.user.rol.ispublico){
			app.locals.rol.ispublico = true;	
		}else{
			app.locals.rol.ispublico = false;
		}
		
		if(req.session.user.rol.isowner){
			app.locals.rol.isowner = true;	
		}else{
			app.locals.rol.isowner = false;
		}
		
		if(req.session.user.rol.islocaladmin){
			app.locals.rol.islocaladmin = true;	
		}else{
			app.locals.rol.islocaladmin = false;
		}
		if(req.session.user.rol.ismesero){
			app.locals.rol.ismesero = true;	
		}else{
			app.locals.rol.ismesero = false;
		}
		
	}
	next();
}

function _loggedIn(req, res, next, app) {
	if (typeof req.utils == "undefined") {
		req.utils = {};
	}
	req.utils.url = req.originalUrl;
	if (req.session.user) {
		res.locals.currentUser = req.session.user;
		res.locals.loggedIn = true;
	} else {
		res.locals.currentUser = false;
		res.locals.loggedIn = false;
	}
	if(req.session.user && req.session.user.restaurant && req.session.user.restaurant.id){
		res.locals.idRestaurant = req.session.user.restaurant.id;
	}
	next();
}

function _isAuthenticated(req){
	if(req.session && req.session.user && req.session.user.logged ){
		return true;
	}else{
		return false;	
	}
}

function _isAdmin(req){
	if(req.session && req.session.user && req.session.user.rol && req.session.user.rol.isadmin){
		return req.session.user.rol.isadmin
	}else{
		return false;
	}
}

exports.setTopBarRol = _Rol;
exports.setTopBarLoggedIn = _loggedIn;
exports.isAuthenticated = _isAuthenticated;
exports.isAdmin = _isAdmin;
