var mongojs = require("mongojs");
var db = mongojs("localhost/iting");
var _ = require("underscore");
var async = require("async");

function _ShowCreateRestaurante(req, res) {
	async.parallel({
			comunas: function(callback) {
				GetComunas(callback);
			},
			tiposdelocales: function(callback) {
				GetTiposDeLocales(callback);
			}
		},
		function(err, results) {
			res.render('admins/restaurantes/restaurante_new', {
				title: 'Iting',
				comunas: results.comunas,
				tiposdelocales: results.tiposdelocales
			});
		}
	);
}


function _ShowEditRestaurante(req, res) {
	async.parallel({
			comunas: function(callback) {
				GetComunas(callback);
			},
			tiposdelocales: function(callback) {
				GetTiposDeLocales(callback);
			},
			restaurantes: function(callback) {
				GetRestaurantesByID(req.params.MongoId, callback);
			}
		},
		function(err, results) {
			var rest;
			if (results.restaurantes === null) {
				rest = req.body;
			} else {
				rest = results.restaurantes;
			}
			res.render('admins/restaurantes/restaurante_edit', {
				title: 'Iting',
				comunas: results.comunas,
				restaurantes: rest,
				tiposdelocales: results.tiposdelocales
			});
		}
	);
}



function _ShowEditRestaurantePhoto(req, res) {
	async.parallel({
			restaurantes: function(callback) {
				GetRestaurantesByID(req.params.MongoId, callback);
			}
		},
		function(err, results) {
			var rest;
			if (results.restaurantes === null) {
				rest = req.body;
			} else {
				rest = results.restaurantes;
			}
			res.render('admins/restaurantes/restaurante_photo', {
				title: 'Iting',
				restaurantes: rest,
			});
		}
	);
}

function _ShowPerfilRestaurante(req, res) {
	async.parallel({
			comunas: function(callback) {
				GetComunas(callback);
			},
			tiposdelocales: function(callback) {
				GetTiposDeLocales(callback);
			},
			restaurante: function(callback) {
				GetRestaurantesByID(req.params.MongoId, callback);
			}
		},
		function(err, results) {
			var rest;
			if (results.restaurantes === null) {
				rest = req.body;
			} else {
				rest = results.restaurante;
			}

			var comuna = _.find(results.comunas, function(item) {
				return item._id == rest.comunasSinMongoID;
			});

			var tipodelocal = _.find(results.tiposdelocales, function(item) {
				return item._id == rest.tipoSinMongoId;
			});

			console.log(rest);
			res.render('perfilLocal', {
				title: 'Iting',
				comuna: comuna,
				restaurant: rest,
				tipodelocal: tipodelocal
			});
		}
	);
}

function _ShowDeleteRestaurante(req, res) {
	async.parallel({
			comunas: function(callback) {
				GetComunas(callback);
			},
			restaurantes: function(callback) {
				GetRestaurantesByID(req.params.MongoId, callback);
			}
		},
		function(err, results) {
			var rest;
			if (results.restaurantes === null) {
				rest = req.body;
				res.redirect('/admins/restaurantes');
			} else {
				rest = results.restaurantes;
				res.render('admins/restaurantes/restaurante_delete', {
					title: 'Iting',
					comunas: results.comunas,
					restaurantes: rest
				});
			}


		}
	);
}


function _ShowUnDeleteRestaurante(req, res) {
	async.parallel({
			comunas: function(callback) {
				GetComunas(callback);
			},
			restaurantes: function(callback) {
				GetRestaurantesByID(req.params.MongoId, callback);
			}
		},
		function(err, results) {
			var rest;
			if (results.restaurantes === null) {
				rest = req.body;
				res.redirect('/admins/restaurantes');
			} else {
				rest = results.restaurantes;
				res.render('admins/restaurantes/restaurante_delete', {
					title: 'Iting',
					comunas: results.comunas,
					restaurantes: rest
				});
			}


		}
	);
}

function _ShowJustCreatedRestaurante(req, res) {
	async.parallel({
			comunas: function(callback) {
				GetComunas(callback);
			},
		},
		function(err, results) {
			res.render('admins/restaurantes/restaurante_edit', {
				title: 'Iting',
				comunas: results.comunas,
				restaurantes: req.body
			});
		}
	);
}

function _ShowRestauranteList(req, res) {
	async.parallel({
			restaurantes: function(callback) {
				GetRestaurantes(callback);
			}
		},
		function(err, results) {
			res.render('admins/restaurantes/restaurante_list', {
				title: 'Iting',
				restaurantes: results.restaurantes
			});
		}
	);
}


function _ShowRestauranteListDeleted(req, res) {
	async.parallel({
			restaurantes: function(callback) {
				GetRestaurantesAll(callback);
			}
		},
		function(err, results) {
			res.render('admins/restaurantes/restaurante_list_deleted', {
				title: 'Iting',
				restaurantes: results.restaurantes
			});
		}
	);
}

exports.CreateRestaurante = function(req, res) {
	var restaurantes = db.collection('restaurantes');
	restaurantes.update({
			nombre: req.body.nombre
		}, {
			$set: {
				nombre: req.body.nombre,
				direccion: req.body.direccion,
				comunas: mongojs.ObjectId(req.body.comuna),
				comunasSinMongoID: req.body.comuna,
				tipo: mongojs.ObjectId(req.body.tipo),
				tipoSinMongoId: req.body.tipo,
				web: req.body.web,
				email: req.body.email,
				telefono: req.body.telefono,
				enabled: true
			}
		}, {
			upsert: true
		},
		function(err, docs, lastErrorObject) {
			if (!err) {
				if (docs.updatedExisting) {
					req.flash('success', {
						msg: 'Los datos fueron actualizados sin problemas.'
					});
				} else {
					req.flash('success', {
						msg: 'Los datos fueron guardados sin problemas.'
					});
				}
			} else {
				req.flash('warning', {
					msg: 'Tuvimos problemas guardando tus datos. Por favor intenta nuevamente '
				});
			}
			_ShowJustCreatedRestaurante(req, res);
		}
	);
};


exports.EditRestaurante = function(req, res) {
	var restaurantes = db.collection('restaurantes');
	restaurantes.update({
			_id: mongojs.ObjectId(req.params.MongoId)
		}, {
			$set: {
				nombre: req.body.nombre,
				direccion: req.body.direccion,
				comunas: mongojs.ObjectId(req.body.comuna),
				comunasSinMongoID: req.body.comuna,
				tipo: mongojs.ObjectId(req.body.tipo),
				tipoSinMongoId: req.body.tipo,
				web: req.body.web,
				email: req.body.email,
				telefono: req.body.telefono
			}
		}, {
			upsert: true
		},
		function(err, docs, lastErrorObject) {
			if (!err) {
				if (docs.updatedExisting) {
					req.flash('success', {
						msg: 'Los datos fueron actualizados sin problemas.'
					});
				} else {
					req.flash('success', {
						msg: 'Los datos fueron guardados sin problemas.'
					});
				}
			} else {
				req.flash('warning', {
					msg: 'Tuvimos problemas guardando tus datos. Por favor intenta nuevamente '
				});
			}
			_ShowEditRestaurante(req, res);
		}
	);
};



exports.DeleteRestaurante = function(req, res) {
	var restaurantes = db.collection('restaurantes');
	var MongoId = req.params.MongoId;
	if (typeof(MongoId) != "undefined") {
		if (/^[0-9a-fA-F]{24}$/.test(MongoId)) {
			// it's an ObjectID
			restaurantes.update({
					_id: mongojs.ObjectId(MongoId)
				}, {
					$set: {
						enabled: false
					}
				},
				function(err, docs, lastErrorObject) {
					if (!err) {
						req.flash('success', {
							msg: 'Restaurante eliminado sin problemas.'
						});
						_ShowRestauranteList(req, res);
					} else {
						req.flash('warning', {
							msg: 'Tuvimos problemas al borrar el restaurante. Por favor intenta nuevamente '
						});
						_ShowRestauranteList(req, res);
					}
				}
			);
		} else {
			req.flash('danger', {
				msg: "No existe un Restaurante con ID " + MongoId
			});
			callback(null, null);
		}
	} else {
		req.flash('danger', {
			msg: "No se ha definido un ID de Restaurant"
		});
		callback(null, null);
	}


};

exports.UnDeleteRestaurante = function(req, res) {
	var restaurantes = db.collection('restaurantes');
	var MongoId = req.params.MongoId;
	if (typeof(MongoId) != "undefined") {
		if (/^[0-9a-fA-F]{24}$/.test(MongoId)) {
			// it's an ObjectID
			restaurantes.update({
					_id: mongojs.ObjectId(MongoId)
				}, {
					$set: {
						enabled: true
					}
				},
				function(err, docs, lastErrorObject) {
					if (!err) {
						req.flash('success', {
							msg: 'Restaurante re-generado sin problemas.'
						});
						_ShowRestauranteList(req, res);
					} else {
						req.flash('warning', {
							msg: 'Tuvimos problemas al re-generar el restaurante. Por favor intenta nuevamente '
						});
						_ShowRestauranteListDeleted(req, res);
					}
				}
			);
		} else {
			req.flash('danger', {
				msg: "No existe un Restaurante con ID " + MongoId
			});
			callback(null, null);
		}
	} else {
		req.flash('danger', {
			msg: "No se ha definido un ID de Restaurant"
		});
		callback(null, null);
	}


};


var EditRestaurantPhoto = function(ob, res) {
	var restaurantes = db.collection('restaurantes');
	restaurantes.update({
			_id: mongojs.ObjectId(ob.id)
		}, {
			$set: {
				photoURL: ob.photoURL
			}
		},
		function(err, docs, lastErrorObject) {
			if (!err) {
				if (docs.updatedExisting) {
					req.flash('success', {
						msg: 'Los datos fueron actualizados sin problemas.'
					});
				} else {
					req.flash('success', {
						msg: 'Los datos fueron guardados sin problemas.'
					});
				}
			} else {
				req.flash('warning', {
					msg: 'Tuvimos problemas guardando tus datos. Por favor intenta nuevamente '
				});
			}
			_ShowEditRestaurante(req, res);
		}
	);
};


function GetComunas(callback) {
	var comunas = db.collection('comunas');
	comunas.find(function(err, docs) {
		if (!err) {
			callback(null, docs);
		}
	});
}

function GetTiposDeLocales(callback) {
	var tiposdelocales = db.collection('tiposdelocales');
	tiposdelocales.find(function(err, docs) {
		if (!err) {
			callback(null, docs);
		}
	});
}

function GetRestaurantesAll(callback) {
	var restaurantes = db.collection('restaurantes');
	restaurantes.find({
		enabled: false
	}, function(err, docs) {
		if (!err) {
			callback(null, docs);
		}
	});

}

function GetRestaurantes(callback) {
	var restaurantes = db.collection('restaurantes');
	restaurantes.find({
		enabled: true
	}, function(err, docs) {
		if (!err) {
			callback(null, docs);
		}
	});
}


function GetRestaurantesByID(MongoId, callback) {
	var restaurantes = db.collection('restaurantes');
	if (typeof(MongoId) != "undefined") {
		if (/^[0-9a-fA-F]{24}$/.test(MongoId)) {
			// it's an ObjectID
			restaurantes.findOne({
				_id: mongojs.ObjectId(MongoId)
			}, function(err, docs) {
				if (!err) {
					callback(null, docs);
				} else {
					req.flash('danger', {
						msg: "No existe un Restaurante con ID " + MongoId
					});
					callback(null, null);
				}
			});
		} else {
			req.flash('danger', {
				msg: "No existe un Restaurante con ID " + MongoId
			});
			callback(null, null);
		}
	} else {
		req.flash('danger', {
			msg: "No se ha definido un ID de Restaurant"
		});
		callback(null, null);
	}

}



var _ShowRestaurantesBySearchTerm = function(searchTerm, req, res) {
	var restaurantes = db.collection('restaurantes');
	// it's an ObjectID
	GetTiposDeLocalesID(searchTerm, function(objetoBusqueda) {
		if (objetoBusqueda) {
			restaurantes.find({
				$or: [{
					nombre: new RegExp(objetoBusqueda.stringBusqueda, "gi")
				}, {
					comunas: {
						$in: objetoBusqueda.idComunas
					},
				}, {
					tipo: {
						$in: objetoBusqueda.idTipoLocal
					},
				}]
			}, function(err, docs) {
				if (!err && docs.length > 0) {
					console.log(docs);
					console.log(objetoBusqueda);
					res.render('searchResults', {
						title: 'Iting',
						busqueda: objetoBusqueda.stringBusqueda,
						rest: docs
					});
				} else {
					req.flash('danger', {
						msg: "No hemos podido encontrar locales relacionados con tu búsqueda, por favor inténtalo denuevo :)"
					});
					res.render('index', {
						title: 'Iting'
					});
				}

			});
		}
	});
};


function GetTiposDeLocalesID(tiposdelocales, callback) {
	var tipoDeLocales = db.collection('tiposdelocales');
	var comunas = db.collection('comunas');
	tiposdelocales = tiposdelocales.toLowerCase();
	tipoDeLocales.find({
			nombre: new RegExp(tiposdelocales, "gi")
		},
		function(err, docs) {
			if (!err) {

				comunas.find({
						nombre: new RegExp(tiposdelocales, "gi")
					},
					function(err, docs2) {
						if (!err) {
							var ob = {};
							var arr = [];
							var arr2 = [];
							_.each(docs, function(value, key, docs) {
								arr.push(value._id);
							});
							_.each(docs2, function(value, key, docs2) {
								arr2.push(value._id);
							});
							ob.idTipoLocal = arr;
							ob.idComunas = arr2;
							ob.stringBusqueda = tiposdelocales;
							callback(ob);
						}
					});


			}
		});
}

exports.ShowCreateRestaurante = _ShowCreateRestaurante;
exports.ShowEditRestaurante = _ShowEditRestaurante;
exports.ShowEditRestaurantePhoto = _ShowEditRestaurantePhoto;
exports.ShowRestauranteList = _ShowRestauranteList;
exports.ShowRestauranteListDeleted = _ShowRestauranteListDeleted;
exports.ShowDeleteRestaurante = _ShowDeleteRestaurante;
exports.ShowUnDeleteRestaurante = _ShowUnDeleteRestaurante;
exports.RestauranteSearch = _ShowRestaurantesBySearchTerm;
exports.ShowPerfilRestaurante = _ShowPerfilRestaurante;