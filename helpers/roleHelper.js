
function _Rol(req, res, next, app) {
	if (req.session.user && req.session.user.rol) {
		app.locals.rol = {};
		if(req.session.user.rol.name == "admin"){
			app.locals.rol.isAdmin = true;	
		}else{
			app.locals.rol.isAdmin = false;
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
	} else {
		res.locals.currentUser = false;
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
	if(req.session && req.session.user && req.session.user.logged && req.session.user.rol.name=="admin"){
		return true;
	}else{
		return false;	
	}
}
function _isNotAdmin(req){
	if(req.session && req.session.user && req.session.user.logged && req.session.user.rol.name=="admin"){
		return false;
	}else{
		return true;	
	}
}

exports.setTopBarRol = _Rol;
exports.setTopBarLoggedIn = _loggedIn;
exports.isAuthenticated = _isAuthenticated;
exports.isAdmin = _isAdmin;
exports.isNotAdmin = _isNotAdmin;