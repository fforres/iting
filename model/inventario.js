var _REQUEST = require("request");
var moment = require("moment");
var createInventario = function(req,res,id){
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


var getInventarioById = function(req,res,idHistorial,cb){
	var ob = {
		where:{
		    id:idHistorial
		}
	};
	var stringOB = global.API_URL + "/historiales?filter="+JSON.stringify(ob);
	_REQUEST(
    { 
    	method: 'GET',
    	uri: stringOB,
    	json:true
    }, function (error, response, historial) {
		if(historial){
			if(historial.error){
				req.flash('error', {
					msg: historial.error.message
				});
				res.redirect("/app/historial");
			}else{
				
				
					var ob = {
						include:["item","tipomovimiento","historial"],
						where:{
						    historialId:idHistorial
						}
					};
					var stringOB = global.API_URL + "/historialesdescripciones?filter="+JSON.stringify(ob);
					_REQUEST(
					{ 
						method: 'GET',
						uri: stringOB,
						json:true
					},
					function (error, response, body) {
						var arr = {}
						for (var i = 0; i < body.length; i++) {
							var entrada = body[i];
							var ob = {}
							if(arr[entrada.item.id])
							{
								ob = arr[entrada.item.id];
								ob.tipomovimiento[entrada.tipomovimiento.orden] = {}
								ob.tipomovimiento[entrada.tipomovimiento.orden].nombre = entrada.tipomovimiento.nombre;
								ob.tipomovimiento[entrada.tipomovimiento.orden].orden = entrada.tipomovimiento.orden;
								ob.tipomovimiento[entrada.tipomovimiento.orden].valorenlaunidad = entrada.tipomovimiento.tienevalordeunidad;
								ob.tipomovimiento[entrada.tipomovimiento.orden].id = entrada.id;
								ob.tipomovimiento[entrada.tipomovimiento.orden].cantidad = entrada.cantidad;
								ob.tipomovimiento[entrada.tipomovimiento.orden].costo = entrada.costoUnidad;
								arr[entrada.item.id] = ob;
							}else{
								ob.id = entrada.item.id;
								ob.nombre = entrada.item.nombre;
								ob.unidaddemedida = entrada.item.unidaddemedida;
								ob.descripcion = entrada.item.descripcion;
								ob.tipomovimiento = {};
								ob.tipomovimiento[entrada.tipomovimiento.orden] = {}
								ob.tipomovimiento[entrada.tipomovimiento.orden].nombre = entrada.tipomovimiento.nombre;
								ob.tipomovimiento[entrada.tipomovimiento.orden].orden = entrada.tipomovimiento.orden;
								ob.tipomovimiento[entrada.tipomovimiento.orden].valorenlaunidad = entrada.tipomovimiento.tienevalordeunidad;
								ob.tipomovimiento[entrada.tipomovimiento.orden].id = entrada.id;
								ob.tipomovimiento[entrada.tipomovimiento.orden].cantidad = entrada.cantidad;
								ob.tipomovimiento[entrada.tipomovimiento.orden].costo = entrada.costoUnidad;
								arr[entrada.item.id] = ob
							}
						}
						if(body){
							if(body.error){
								req.flash('error', {
									msg: body.error.message
								});
								res.redirect("/app/historial");
							}else{
								console.log(arr["547db7afaea23d8e177924db"])  
								cb(res,arr,historial,moment)
							}
						}
					})
				
				
			}
		}
    })
}

exports.Create = createInventario;
exports.Get = getInventarioById;
