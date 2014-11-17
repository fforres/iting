API_URL = "http://fforres.koding.io:3006/api";
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
		console.log(HASHES)
		console.log(QUERY)
		console.log(ROUTE)
	}else{
		console.log("error")
	}
}
$(document).on("ready",function(e){

});