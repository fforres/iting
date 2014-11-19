var _REQUEST = require("request");
var _ = require("underscore");
var async = require("async");


var SearchRestaurante = function(searchTerm,req,res){
	var ob = {
		include:["categoria","comuna"],
		where:{
			or: [
				{
					nombre:
					{
						like: searchTerm
					}		
				},
				{
					web:
					{
						like: searchTerm
					}		
				}
			]
		}
	};
	var stringOB = global.API_URL + "/restaurantes?filter="+JSON.stringify(ob)
	_REQUEST(
    { method: 'GET'
    , uri: stringOB 
    }  , function (error, response, body) {
		 
	if(body){
		console.log(JSON.parse(body))
		res.render('searchResults', {
			title: 'Itings',
			busqueda: {},
			rest: JSON.parse(body)
		});
	}
	if(response && response.statusCode == 200){
		}
		
    })

}


var SearchOneRestaurante = function(req,res){
	var ob = {
		include:["categoria","comuna"],
		where:{
			id:req.params.MongoId
		}
	};
	var stringOB = 	global.API_URL + "/restaurantes?filter="+JSON.stringify(ob)
	
	_REQUEST(
    {
    	method: 'GET', 
    	uri: stringOB
    }, 
    function (error, response, body) {
		if(body[0]){
			body = JSON.parse(body)
			res.render('perfilLocal', {
				title: 'Iting',
				comuna: body[0].comuna,
				restaurant: body[0],
				categoria: body[0].categoria
			});
		}
		if(response && response.statusCode == 200){
		}
			
	})
}

var SearchRestauranteById = function(req,res,idRestaurante){
	var ob = {
		include:["categoria","comuna"],
		where:{
			id:idRestaurante
		}
	};
	var stringOB = 	global.API_URL + "/restaurantes?filter="+JSON.stringify(ob)
	
	_REQUEST(
    {
    	method: 'GET', 
    	uri: stringOB,
    	json:true
    }, 
    function (error, response, body) {
		if(body[0]){
			res.render('admins/restaurantes/restaurante_edit', {
				title: 'Iting',
				comuna: body[0].comuna,
				restaurant: body[0],
				categoria: body[0].categoria
			});
		}
		if(response && response.statusCode == 200){
		}
			
	})
}



var UpdateRestauranteById = function(req,res,idRestaurante){
	console.log(req.body);
	var ob = {
		nombre: req.body.nombre,
		direccion: req.body.direccion,
		web: req.body.web,
		email: req.body.email,
		telefono: req.body.telefono,
		categoriaId: req.body.categoria,
		comunaId:req.body.comuna

	};
	var stringOB = 	global.API_URL + "/restaurantes/"+idRestaurante;
	
	_REQUEST(
    {
    	method: 'PUT', 
    	uri: stringOB,
    	json:true,
    	body:ob
    }, 
    function (error, response, body) {
		if(body.error){
			console.log(body.error)
		}else{
			req.flash('success', {
				msg: "Restaurante Actualizado"
			});
			res.redirect("/admins/restaurantes/")
		}
		if(response && response.statusCode == 200){
		}
			
	})
}

var getRestaurantes = function(req,res){
	var ob = {
		include:["categoria","comuna"]
	};
	var stringOB = 	global.API_URL + "/restaurantes?filter="+JSON.stringify(ob)
	_REQUEST(
    {
    	method: 'GET', 
    	uri: stringOB,
    	json: true
    }, 
    function (error, response, body) {
    	console.log(body)
		if(body.error){
			req.flash('error', {
				msg: body.error.message
			});
			res.redirect("/admins/restaurantes")
		}else{
			res.render('admins/restaurantes/restaurante_list', {
				title: 'Iting',
				restaurantes: body
			});
		}
		if(response && response.statusCode == 200){
		}
			
	})
}
 
 
exports.Search = SearchRestaurante;
exports.Restaurante = SearchOneRestaurante;
exports.RestauranteById = SearchRestauranteById;
exports.Restaurantes = getRestaurantes;
exports.Update_RestauranteById = UpdateRestauranteById;

