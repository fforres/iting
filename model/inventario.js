var _REQUEST = require("request");
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
exports.Create = createInventario;

/*

req.session.destroy(function(err) {
			res.redirect("/");
		})

*/