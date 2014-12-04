API_URL = "http://fforres.koding.io:3002/api";
APP_URL = "http://fforres.koding.io:3001";
HASHES="";
ROUTE = "";
getRoute();
function getRoute(){
	var actualUrl = window.location.href;
	if(actualUrl.lastIndexOf(APP_URL) != -1){
		var restOfUrl = actualUrl.substring(APP_URL.length, actualUrl.length);
		HASHES = restOfUrl.split("#")[1];
		ROUTE = restOfUrl.split("#")[0];
		ROUTE = ROUTE.split("?")[0];
		QUERY = ROUTE.split("?")[1];
	}else{
		console.log("error");
	}
}
$(document).on("ready",function(e){
	$.each($("select[data-fetch]"),function(k,v){
		var $cont = $(v);
		var actual = $(v).data("preselected").trim();
		var fetch = $(v).data("fetch"); 
		var restaurante = $cont.data("restaurant")
		
		var ob = {}
		if(restaurante){
			ob = {
				where:{
					restauranteId : restaurante
				}
			};
		}
		$.ajax({
			url:API_URL+"/"+fetch+"?filter="+JSON.stringify(ob),
			type:"GET",
			success:function(data){
				var html="";
				$.each(data,function(k,v){
					$cont.append("<option value='"+v.id+"'>"+v.nombre+"</option>");
				});
				if(actual.length>0){
				   $cont.find("option[value='"+actual+"']").prop("selected",true)
				}
				if($cont.attr("disabled")=="disabled"){
					$cont.attr("disabled",false);
				}
			}
		});
	});
	
	$("#userslist .acciones a").on("click",function(e){
	    e.preventDefault();
		var $theContainer = $(this).parents(".user");
		getRoles($theContainer, function($theContainer,roles){
			var theroles = roles;
			var userId = $theContainer.data("userid");
			e.preventDefault();
			var ob = {
				include:["role"],
				where:{
					principalId:userId
				}
			};
			$.ajax({
				url:API_URL+"/rolmappings?filter="+JSON.stringify(ob),
				type:"GET",
				success:function(data){
					if(data.error){
						$theContainer.find(".rolewrapper").hide();
						$theContainer.find(".roles").html("");
					}else{
						var html="";
						var localadmin = false;
						var localadminId = "";
						var currentlocaladminId = "";
						var mesero = false;
						var meseroId = "";
						var currentmeseroId = "";
						
						$.each(data,function(k,v){
							if(v.role && v.role.name =="mesero"){
								mesero = true; 
								currentmeseroId = v.id;
							}
							if(v.role && v.role.name =="localadmin"){
								localadmin = true;
								currentlocaladminId = v.id;
							}
						});

						$.each(theroles,function(k,v){
							if(v.name=="mesero"){
								meseroId = v.id;
							}
							if(v.name=="localadmin"){
								localadminId = v.id;
							}
						});
						
						html += "<label class='checkbox'>";
							if(localadmin){
								html += "<input type='checkbox' value='' checked data-currentrolid='"+currentlocaladminId+"'data-rolid='"+localadminId+"' /> Administrador de Local";
							}else{
								html += "<input type='checkbox' value='' data-rolid='"+localadminId+"' /> Administrador de Local";
							}
						html += "</label>";
						html += "<label class='checkbox'>";
							if(mesero){
								html += "<input type='checkbox' value='' checked data-currentrolid='"+currentmeseroId+"'data-rolid='"+meseroId+"' /> Mesero";
							}else{
								html += "<input type='checkbox' value='' data-rolid='"+meseroId+"'  /> Mesero";
							}
						html += "</label>";
						$theContainer.find(".roles").html(html)
						$theContainer.find(".rolewrapper").show();
						$theContainer.find(".roles input[type='checkbox']").on("click",function(e){
							var elcheckbox = $(this);
							var rol = $(this).prop('checked');
							var rolid = $(this).data("rolid");
							var currentrolid = $(this).data("currentrolid");
							userId;
							if(rol){ // crear rol
								var ob = {
									"principalType": "USER",
									"principalId": userId,
									"roleId": rolid
								};
								$.ajax({
									url : API_URL+"/rolmappings/",
									type : "POST",
									data : ob,
									success:function(data){
										if(data.error){
											console.log("error");
										}else{
											
											elcheckbox.attr("data-currentrolid",data.id)
										}
									}
						
								});
							}else{ // eliminar rol
								$.ajax({
									url:API_URL+"/rolmappings/"+currentrolid,
									type:"DELETE",
									success:function(data){
										
									}
								});
							}
						});
					}
				}
			});
		});
	});

	function getRoles($cont,cb){
		$.ajax({
			url:API_URL+"/roles",
			type:"GET",
			success:function(data){
				if(data.error){
				}else{
					cb($cont,data);
				}
			}
		});
	}
	
	if($("#inventario").length>0){
	    $.getScript( "/javascripts/strongloop/inventario.js", function( data, textStatus, jqxhr ) {
          console.log( "Load was performed." );
        });
	}
	
	if($("#inventario.calendario").length>0){
	    $.getScript( "/javascripts/strongloop/inventario.js", function( data, textStatus, jqxhr ) {
          console.log( "Load was performed." );
        });
	}
	
	if($("#reportes.flujodiarioitems").length>0){
	    $.getScript( "/javascripts/strongloop/reportes.js", function( data, textStatus, jqxhr ) {
	    $.getScript( "/3rdparty/moment/moment.js", function( data, textStatus, jqxhr ) {
	    $.getScript( "/3rdparty/underscore/underscore.js", function( data, textStatus, jqxhr ) {
          console.log( "Load was performed." );
        });
        });
        });
	}

	capitalize = function(s)
    {
        if(s){
            return s[0].toUpperCase() + s.slice(1);    
        }else{
            return "";
        }
    }
});

