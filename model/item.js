var async = require("async");
var crypto = require('crypto');
var _REQUEST = require("request");
var _ = require('underscore');

 
var createItem = function(req, res) {
    var nombre = req.body.nombre
	ob = {
		"nombre": req.body.nombre,
		"cantidadactual": 0,
		"descripcion": req.body.descripcion,
		"unidaddemedida": req.body.unidaddemedida,
		"categoriaitemId": req.body.categoriaitem,
		"restauranteId": req.session.user.restaurant.id
	};
	var stringOB = global.API_URL + "/items";
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
    			res.redirect("/app/items/new")
    		}else{
    			req.flash('success', {
    				msg: "Item '"+nombre+"' Creado Exitosamente"
    			});
    			res.redirect("/app/items/new")
    		}
    	}
		
    })
}


var getItemById = function(req,res,id){
    var ob = {
		include:["categoriaitem"],
		where:{
		    id:id
		}
	};
	var stringOB = global.API_URL + "/items?filter="+JSON.stringify(ob);
    console.log(stringOB)

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
				res.redirect("/app/items");
			}else{
                var categoriaitemid ="";
                if(body[0].categoriaitem){
                   categoriaitemid = body[0].categoriaitem.id;
                }
				res.render('app/item/edit', {
					title: 'Iting',
					item:body[0],
					categoriaitem:categoriaitemid
				});
			}
		}
		if(response && response.statusCode == 200){
			}
			
        }
    )
}

var getItemsPorRestaurante = function(req,res,cb){
	var restaurantId = req.session.user.restaurant.id;
	var stringOB = global.API_URL + "/restaurantes/"+restaurantId+"/items";
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
				res.render('app/item/list', {
					title: 'Iting',
					items:body
				});
			}
		}
		if(response && response.statusCode == 200){
		}
    }
    )
	
}


var createItem = function(req, res) {
    var nombre = req.body.nombre
	ob = {
		"nombre": req.body.nombre,
		"cantidadactual": 0,
		"descripcion": req.body.descripcion,
		"unidaddemedida": req.body.unidaddemedida,
		"categoriaitemId": req.body.categoriaitem,
		"restauranteId": req.session.user.restaurant.id
	};
	var stringOB = global.API_URL + "/items";
	_REQUEST(
    { 
        method: 'POST',
        uri: stringOB ,
        json : true,
        body : ob
    }  , 
    function (error, response, body) {
    	if(body){
    		if(body.error){
    			req.flash('error', {
    				msg: body.error.message
    			});
    			res.redirect("/app/items/new")
    		}else{
    			req.flash('success', {
    				msg: "Item '"+nombre+"' Creado Exitosamente"
    			});
    			res.redirect("/app/items/new")
    		}
    	}
		
    })
}


var updateItem = function(req,res,id){
    var elnombre = req.body.nombre;
    var ob = {
		"nombre": req.body.nombre,
		"descripcion": req.body.descripcion,
		"categoriaitemId": req.body.categoriaitem,
		"unidaddemedida": req.body.unidaddemedida
	};
	var stringOB = global.API_URL + "/items/"+id;
	console.log(ob)
	_REQUEST(
    { 
    	method: 'PUT',
    	uri: stringOB,
    	body:ob,
    	json:true
    },
    function (error, response, body) {

		if(body){
			if(body.error){
				req.flash('error', {
					msg: body.error.message
				});
				res.redirect("/app/items")
			}else{
                req.flash('success', {
					msg: "Item - "+elnombre+" - actualizado exitosamente"
				});
				res.redirect('/app/items');
			}
		}
		if(response && response.statusCode == 200){
			}
			
	    }
    )
}


exports.Create = createItem;
exports.GetById = getItemById;
exports.Update = updateItem;
exports.GetItemsPorRestaurante = getItemsPorRestaurante;

/*

req.session.destroy(function(err) {
			res.redirect("/");
		})

*/