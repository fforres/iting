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
	$('#inventario #datepicker').datepicker();
	$("#inventario .acciones a.crear ").on("click",function(e){
	    var ob = {}
	    var errores = 0;
        $.each($('#inventario .agregados .item'),function(k,v){
            $(this).find(".movimientos").show();
            var segundoOb={};
            var itemId = $(this).data("itemid");
            $.each($(this).find(".movimientos .movimiento"),function(k,v){
                
                var inputmovimiento =  $(v).find(".valor input");
                var valorinputmovimiento = $(v).find(".valor input").val();
                var inputmovimientoParent = $(this)
                // TIENE UNA COMA
                if(valorinputmovimiento.lastIndexOf(",") != -1){
                    // agregar error por que tiene coma
                    inputmovimientoParent.removeClass("has-success").addClass("has-error");
                    errores++;
                }else{
                    if(valorinputmovimiento.trim().length > 0 && valorinputmovimiento.trim() != ""){
                        if(valorinputmovimiento.lastIndexOf(".") != -1){
                            if(parseFloat(valorinputmovimiento)){
                                
                                var attr = $(this).attr('data-parent');
                                if (typeof attr !== typeof undefined && attr !== false) {
                                    //revisar si el parent está vacío
                                    if($(this).parents(".movimientos").find(".movimiento[data-idmovimiento='"+attr+"'] input").val().trim().length >0)
                                    {
                                        // LLENO
                                        inputmovimientoParent.removeClass("has-error").addClass("has-success");
                                        segundoOb["valordeunidad"] = parseFloat(valorinputmovimiento);    
                                    }else{
                                        // VACIO
                                        inputmovimientoParent.removeClass("has-success").addClass("has-error");
                                        errores++;
                                    }
                                }else{
                                    inputmovimientoParent.removeClass("has-error").addClass("has-success");
                                    segundoOb[$(v).data("idmovimiento")] = parseFloat(valorinputmovimiento);    
                                }
                            }else{
                                inputmovimientoParent.removeClass("has-success").addClass("has-error");
                                errores++;
                            }
                        }else{
                            if(parseInt(valorinputmovimiento)){
                                var attr = $(this).attr('data-parent');
                                if (typeof attr !== typeof undefined && attr !== false) {
                                    //revisar sielparentestá vacío
                                    if($(this).parents(".movimientos").find(".movimiento[data-idmovimiento='"+attr+"'] input").val().trim().length >0)
                                    {
                                        // LLENO
                                        inputmovimientoParent.removeClass("has-error").addClass("has-success");
                                        segundoOb["valordeunidad"] = parseInt(valorinputmovimiento);
                                    }else{
                                        // VACIO
                                        inputmovimientoParent.removeClass("has-success").addClass("has-error");
                                        errores++;
                                    }
                                }else{
                                    inputmovimientoParent.removeClass("has-error").addClass("has-success");
                                    segundoOb[$(v).data("idmovimiento")] = parseInt(valorinputmovimiento);
                                }
                            }else{
                                inputmovimientoParent.removeClass("has-success").addClass("has-error");
                                errores++;
                            }
                        }
                        
                    }else{
                        inputmovimientoParent.removeClass("has-error").addClass("has-success");
                    }
                }
            })
            if(Object.keys(segundoOb).length > 0){
                ob[itemId] = segundoOb;    
            }
        })
        if(errores === 0){
            if(Object.keys(ob).length > 0){
                saveInventario(ob);
            }
        }else{
            alert("Tiene "+errores+ " errores")
        }
        
        function saveInventario(inventario){
            console.log(inventario)   
            $.each(inventario,function(k,v){
                console.log("/////////////")
                console.log(v)
                $.each(v,function(k2,v2){
                    console.log(v2)
                })
            })
        }
	})
	$("#inventario .agregar input").on("input",function(e){
        startSearch($(this))
	}).on("focus",function(e){
        startSearch($(this))
	}).on("blur",function(e){
        startSearch(
            $(this).parents(".agregar").find(".searchcontainer"),
            $(this).parents(".agregar").find(".search")
        )
	}).on("keypress",function(e){
        if (e.keyCode == 13) {
            startSearch($(this))
        }
	})
	function closeSearch($searchCont,$searchArea){
        $searchCont.hide(250);
        $searchArea.html("");
	}
	function startSearch($cont){
	    var elValue = $cont.val();
	    var elInput = $cont;
        var $agregadosCont = $cont.parents("#inventario").find(".agregados");
        var $searchCont = $cont.parents(".agregar").find(".searchcontainer");
        var $searchArea = $cont.parents(".agregar").find(".search");
	    var elRestaurant = $cont.data("restaurante");
	    var arrDeAgregados = []
	    $.each($agregadosCont.find(".item"),function(){
	         arrDeAgregados.push($(this).data("itemid"));
	    })
	    if(elValue.length > 2){
    	    e.preventDefault();
    	    var  ob = 
    	    {
    	        where: 
                {   
                    and : 
                    [
                        {
                            restauranteId  :   elRestaurant
                        },
                        {
                            id :
                            {
                                nin:arrDeAgregados
                            }
                        },
                        {
                            or:
                            [
                                {
                                    nombre : 
                                    {
                                        like: elValue
                                    }
                                },
                                {
                                    descripcion : 
                                    {
                                        like: elValue
                                    }
                                }
                            ] 
                        }
                    ]
                }
    	    }
            var laurl = API_URL+"/items?filter="+JSON.stringify(ob);
            var xhr = $.ajax({
    			url:laurl,
    			type:"GET"
            })
            xhr.done(function(data){
                addToSearchResults($searchArea, $searchCont , $agregadosCont, elInput, data)   
            })
            function addToSearchResults($searchArea, $searchCont , $agregadosCont, elInput, data){
                var $searchArea = $cont.parents(".agregar").find(".search");
                var html="";
                if(data.length == 0){
                    html+="<div class='col-xs-12 searchresult'>";
                        html+="<h3>No hay resultados para esta búsqueda</h3>";
                    html+="</div>";  
                }else{
                    $.each(data,function(k,v){
                        html+="<div class='col-xs-12 searchresult item row-xs-height'>";
                            html+="<div class='col-xs-7 col-xs-height'>";
                                html+="<h3>"+v.nombre+"</h3>";
                                html+="<p>"+v.descripcion+"</p>";
                            html+="</div>";  
                            html+="<div class='col-xs-4 col-xs-height col-middle'>";
                                html+="<a href='#' data-itemid='"+v.id+"' data-nombre='"+v.nombre+"' data-unidaddemedida='"+v.unidaddemedida+"' class='btn btn-info pull-right'> Agregar </a>"
                            html+="</div>";  
                        html+="</div>";  
                    });
                }
                $searchArea.html(html);
                $searchCont.show(200);
                
           
                $(document).mouseup(function (e)
                {
                    var $containerParaCerrar = $searchCont;
                    if (!$containerParaCerrar.is(e.target) // if the target of the click isn't the container...
                        && $containerParaCerrar.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        closeSearch($searchCont, $searchArea);
                    }
                });
                
                doListenersForSearchResults($searchCont,$agregadosCont,$searchArea)
                
                
            }
            function doListenersForSearchResults($searchCont,$agregadosCont,$searchArea){
                $searchCont.find(".searchresult.item a").on("click",function(e){
                    var elNombre = $(this).data("nombre");
                    var elItemId = $(this).data("itemid");
                    var laUnidadDeMedida = $(this).data("unidaddemedida");
                    var laurl = API_URL+'/tiposmovimientos?filter={"order": "nombre DESC"}';
                    var xhr = $.ajax({
            			url:laurl,
            			type:"GET"
                    })
                    xhr.done(function(data){
                        var html = "";
                        html+="<div class='col-xs-12 item' data-itemid='"+elItemId+"' >";
                            html+="<h3>"+elNombre+" ("+laUnidadDeMedida+")<i class='fa fa-fw fa-caret-down pull-right'></i></h3>";
                            html+="<div class='col-xs-12 row-xs-height movimientos' >";
                                $.each(data,function(k,v){
                                    html+="<div class='col-xs-12 row-xs-height movimiento form-group' data-idmovimiento='"+v.id+"' >";
                                        html+="<div class='col-xs-8 col-xs-height col-middle nombre'>";
                                            html+="<label class='control-label'>"+v.nombre+"</label>";
                                        html+="</div>";  
                                        html+="<div class='col-xs-4 col-xs-height col-middle valor'>";
                                            html+="<input type='text' class='form-control'>";  
                                        html+="</div>";  
                                    html+="</div>";  
                                     if(v.tienevalordeunidad){
                                        html+="<div class='col-xs-12 movimiento tienevalordeunidad form-group' data-parent='"+v.id+"'>";
                                        
                                            html+="<div class='col-xs-8 col-xs-height col-middle nombre'>";
                                                html+="<label class='control-label'>Valor de Unidad - ("+laUnidadDeMedida+")</label>";
                                            html+="</div>";  
                                            html+="<div class='col-xs-4 col-xs-height col-middle valor '>";
                                                html+="<input type='text' class='form-control'>";  
                                            html+="</div>";  
                                            
                                        html+="</div>";  
                                    }
                                })
                            html+="</div>";  
                        html+="</div>";           
                        $agregadosCont.prepend(html);
                        $agregadosCont.find(".item[data-itemid='"+elItemId+"']").show(200);
                        $agregadosCont.find(".item[data-itemid='"+elItemId+"']").find("h3").on("click",function(){
                            $agregadosCont.find(".item[data-itemid='"+elItemId+"']").find(".movimientos").toggle(200);
                        })
                        closeSearch($searchCont, $searchArea);
                        
                    });
                    
                })
            }

	    }else if(elValue.length == 0){
	       // closeSearch($searchCont, $searchArea);
	    }
	}
});

