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
 
exports.Search = SearchRestaurante;
exports.Restaurante = SearchOneRestaurante;
