var _ = require("underscore");

function _Rol(req, res, next, app) {
	if (req.user && req.user.rol) {
		var admin = _.find(req.user.rol, function(item) {
			return item.nombre === "Admin";
		});
		app.locals.rol = {};
		app.locals.rol.isAdmin = admin.value;
	}
	next();
}

function _loggedIn(req, res, next, app) {
	if (typeof req.utils == "undefined") {
		req.utils = {};
	}
	req.utils.url = req.originalUrl;
	if (req.user) {
		res.locals.user = req.user;
		res.locals.isLoggedIn = true;
	} else {
		res.locals.user = false;
		res.locals.isLoggedIn = false;
	}
	next();
}

exports.setTopBarRol = _Rol;
exports.setTopBarLoggedIn = _loggedIn;