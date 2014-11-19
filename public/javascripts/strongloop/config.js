API_URL = "http://fforres.koding.io:3002/api";
APP_URL = "http://fforres.koding.io:3001";
HASHES="";
ROUTE = "";
getRoute();
function getRoute(){
	var actualUrl = window.location.href
	if(actualUrl.lastIndexOf(APP_URL) != -1){
		var restOfUrl = actualUrl.substring(APP_URL.length, actualUrl.length)
		HASHES = restOfUrl.split("#")[1];
		ROUTE = restOfUrl.split("#")[0];
		ROUTE = ROUTE.split("?")[0];
		QUERY = ROUTE.split("?")[1];
	}else{
		console.log("error")
	}
}
$(document).on("ready",function(e){
	$.each($("select[data-fetch]"),function(k,v){
		var $cont = $(v);
		var actual = $(v).data("preselected");
		var fetch = $(v).data("fetch");
		var ob = {
			where:{
				id : {
					neq : actual
				}
			}
		}
		$.ajax({
			url:API_URL+"/"+fetch+"?filter="+JSON.stringify(ob),
			type:"GET",
			success:function(data){
				var html=""
				$.each(data,function(k,v){
					$cont.append("<option value='"+v.id+"'>"+v.nombre+"</option>")
				});
				if($cont.attr("disabled")=="disabled"){
					$cont.attr("disabled",false)
				}
			}
		})
	})
	
	

	
});