var _REQUEST = require("request");
var SearchRestauranteByCategoria = function(searchTerm, req, res) {
		var ob = {
			include: ["categoria", "comuna"],
			where: 
			{
				categoriaId:  searchTerm
			}
		};
		var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
		console.log(stringOB);
		_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			var restaurantes = body
			var hayRespuestas = false;
			if (body.length > 0) {
				hayRespuestas = true;
			}
			if (body) {
				res.render('searchResults', {
					title: 'Itings',
					busqueda: {},
					rest: body,
					searchTerm: searchTerm,
					hayRespuestas: hayRespuestas
				});
			}
			if (response && response.statusCode == 200) {}
		})

}

var SearchRestauranteByComuna = function(searchTerm, req, res) {
		var ob = {
			include: ["categoria", "comuna"],
			where: {
				comunaId: searchTerm
			}
		};
		var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
    	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			var restaurantes = body
			var hayRespuestas = false;
			if (body.length > 0) {
				hayRespuestas = true;
			}
			if (body) {
				res.render('searchResults', {
					title: 'Itings',
					busqueda: {},
					rest: body,
					searchTerm: searchTerm,
					hayRespuestas: hayRespuestas
				});
			}
			if (response && response.statusCode == 200) {}
		})
	
}
var SearchRestaurante = function(searchTerm, req, res) {
	goGetIdsPorCategoria(searchTerm, req, res, goGetIdsPorComuna, function(searchTerm, idsCategoria, idsComuna, req, res) {
		var ob = {
			include: ["categoria", "comuna"],
			where: {
				or: [{
					nombre: {
						like: searchTerm
					}
				}, {
					web: {
						like: searchTerm
					}
				}, {
					direccion: {
						like: searchTerm
					}
				}, {
					email: {
						like: searchTerm
					}
				}, {
					categoriaId: {
						inq: idsCategoria
					}
				}, {
					comunaId: {
						inq: idsComuna
					}
				}]
			}
		};
		var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
		console.log(stringOB);
		_REQUEST({
				method: 'GET',
				uri: stringOB,
				json: true
			},
			function(error, response, body) {
				var restaurantes = body
				var hayRespuestas = false;
				if (body.length > 0) {
					hayRespuestas = true;
				}
				if (body) {
					res.render('searchResults', {
						title: 'Itings',
						busqueda: {},
						rest: body,
						searchTerm: searchTerm,
						hayRespuestas: hayRespuestas
					});
				}
				if (response && response.statusCode == 200) {}
			})
	});
}
goGetIdsPorCategoria = function(termino, req, res, cb, cb2) {
	var ob = {
		where: {
			nombre: {
				like: termino
			}
		}
	}
	var stringOB = global.API_URL + "/categorias?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			var arrIds = [];
			for (var i = 0; i < body.length; i++) {
				arrIds.push(body[i].id);
			}
			cb(termino, arrIds, req, res, cb2)
		})
}
goGetIdsPorComuna = function(termino, arrCategorias, req, res, cb) {
	var ob = {
		where: {
			nombre: {
				like: termino
			}
		}
	}
	var stringOB = global.API_URL + "/comunas?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			var arrIds = [];
			for (var i = 0; i < body.length; i++) {
				arrIds.push(body[i].id);
			}
			cb(termino, arrCategorias, arrIds, req, res);
		})
}

var searchRestaurantePorCategoria = function(req, res, idRestaurante) {
	if (!idRestaurante) {
		idRestaurante = req.session.user.restaurant.id
	}
	var ob = {
		include: ["categoria", "comuna"],
		where: {
			id: idRestaurante
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			if (body[0]) {
				res.render('app/restaurante/show', {
					title: 'Iting',
					comuna: body[0].comuna,
					restaurant: body[0],
					categoria: body[0].categoria
				});
			}
			if (response && response.statusCode == 200) {}
		})
}
var SearchOneRestaurante = function(req, res) {
	var ob = {
		include: ["categoria", "comuna"],
		where: {
			id: req.params.MongoId
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB
		},
		function(error, response, body) {
			if (body[0]) {
				body = JSON.parse(body)
				res.render('perfilLocal', {
					title: 'Iting',
					comuna: body[0].comuna,
					restaurant: body[0],
					categoria: body[0].categoria
				});
			}
			if (response && response.statusCode == 200) {}
		})
}
var SearchRestauranteById = function(req, res, idRestaurante) {
	if (!idRestaurante) {
	    console.log(idRestaurante)
		idRestaurante = req.session.user.restaurant.id
	}
	var ob = {
		include: ["categoria", "comuna"],
		where: {
			id: idRestaurante
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
    console.log(stringOB)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
		    console.log(body)
			if (body[0]) {
				res.render('app/restaurante/show', {
					title: 'Iting',
					comuna: body[0].comuna,
					restaurant: body[0],
					categoria: body[0].categoria
				});
			}
			if (response && response.statusCode == 200) {}
		})
}
var SearchRestauranteByIdEdit = function(req, res, idRestaurante) {
	if (!idRestaurante) {
		idRestaurante = req.session.user.restaurant.id
	}
	var ob = {
		include: ["categoria", "comuna"],
		where: {
			id: idRestaurante
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			if (body[0]) {
				res.render('app/restaurante/edit', {
					title: 'Iting',
					comuna: body[0].comuna,
					restaurant: body[0],
					categoria: body[0].categoria
				});
			}
			if (response && response.statusCode == 200) {}
		})
}
var UpdateRestauranteById = function(req, res) {
	if (req.session.user && req.session.user.restaurant && req.session.user.restaurant.id) {
		idRestaurante = req.session.user.restaurant.id
		console.log(idRestaurante);
		var ob = {
			nombre: req.body.nombre,
			direccion: req.body.direccion,
			web: req.body.web,
			email: req.body.email,
			telefono: req.body.telefono,
			categoriaId: req.body.categoria,
			comunaId: req.body.comuna
		};
		var stringOB = global.API_URL + "/restaurantes/" + idRestaurante;
		_REQUEST({
				method: 'PUT',
				uri: stringOB,
				json: true,
				body: ob
			},
			function(error, response, body) {
				console.log(body);
				if (body.error) {
					console.log(body.error)
				} else {
					req.flash('success', {
						msg: "Restaurante Actualizado"
					});
					res.redirect("/app/restaurante/")
				}
				if (response && response.statusCode == 200) {}
			})
	}
}
var DeleteRestauranteById = function(req, res, idRestaurante) {
	var ob = {
		enabled: false
	};
	var stringOB = global.API_URL + "/restaurantes/" + idRestaurante;
	_REQUEST({
			method: 'PUT',
			uri: stringOB,
			json: true,
			body: ob
		},
		function(error, response, body) {
			if (body.error) {
				console.log(body.error)
			} else {
				req.flash('success', {
					msg: "Restaurante Deshabilitado"
				});
				res.redirect("/admins/restaurantes")
			}
			if (response && response.statusCode == 200) {}
		})
}
var UndeleteRestauranteById = function(req, res, idRestaurante) {
	var ob = {
		enabled: true
	};
	var stringOB = global.API_URL + "/restaurantes/" + idRestaurante;
	_REQUEST({
			method: 'PUT',
			uri: stringOB,
			json: true,
			body: ob
		},
		function(error, response, body) {
			if (body.error) {
				console.log(body.error)
			} else {
				req.flash('success', {
					msg: "Restaurante Habilitado"
				});
				res.redirect("/admins/restaurantes/deleted")
			}
			if (response && response.statusCode == 200) {}
		})
}
var GetRestaurantes = function(req, res) {
	var ob = {
		include: ["categoria", "comuna"],
		where: {
			enabled: true
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			console.log(body)
			if (body.error) {
				req.flash('error', {
					msg: body.error.message
				});
				res.redirect("/admins/restaurantes")
			} else {
				res.render('admins/restaurantes/restaurante_list', {
					title: 'Iting',
					restaurantes: body
				});
			}
			if (response && response.statusCode == 200) {}
		})
}
var GetRestaurantesDeshabilitados = function(req, res) {
	var ob = {
		include: ["categoria", "comuna"],
		where: {
			enabled: false
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter=" + JSON.stringify(ob)
	_REQUEST({
			method: 'GET',
			uri: stringOB,
			json: true
		},
		function(error, response, body) {
			console.log(body)
			if (body.error) {
				req.flash('error', {
					msg: body.error.message
				});
				res.redirect("/admins/restaurantes")
			} else {
				res.render('admins/restaurantes/restaurante_list_deleted', {
					title: 'Iting',
					restaurantes: body
				});
			}
			if (response && response.statusCode == 200) {}
		})
}
exports.Search = SearchRestaurante;
exports.SearchByComuna = SearchRestauranteByComuna;
exports.SearchByCategoria = SearchRestauranteByCategoria;
exports.Restaurante = SearchOneRestaurante;
exports.RestauranteById = SearchRestauranteById;
exports.RestauranteByIdForEdit = SearchRestauranteByIdEdit;
exports.Restaurantes = GetRestaurantes;
exports.RestaurantesDeshabilitados = GetRestaurantesDeshabilitados;
exports.Update_RestauranteById = UpdateRestauranteById;
exports.Delete_RestauranteById = DeleteRestauranteById;
exports.Undelete_RestauranteById = UndeleteRestauranteById;