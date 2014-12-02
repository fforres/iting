$('#inventario #datepicker').on("change", function(e) {
	console.log($(this).datepicker().datepicker('getDate'))
})
$('#inventario #datepicker').datepicker().datepicker("setDate", new Date());
$('#inventario #datepicker').trigger("change");
$("#inventario .acciones a.crear ").on("click", function(e) {
	var ob = {}
	var errores = 0;
	$.each($('#inventario .agregados .item'), function(k, v) {
		$(this).find(".movimientos").show();
		var segundoOb = {};
		var itemId = $(this).data("itemid");
		$.each($(this).find(".movimientos .movimiento"), function(k, v) {
			var inputmovimiento = $(v).find(".valor input");
			var valorinputmovimiento = $(v).find(".valor input").val();
			var inputmovimientoParent = $(this)
				// TIENE UNA COMA
			if (valorinputmovimiento.lastIndexOf(",") != -1) {
				// agregar error por que tiene coma
				inputmovimientoParent.removeClass("has-success").addClass("has-error");
				errores++;
			} else {
				if (valorinputmovimiento.trim().length > 0 && valorinputmovimiento.trim() != "") {
					if (valorinputmovimiento.lastIndexOf(".") != -1) {
						if (parseFloat(valorinputmovimiento)) {
							var attr = $(this).attr('data-parent');
							if (typeof attr !== typeof undefined && attr !== false) {
								//revisar si el parent está vacío
								if ($(this).parents(".movimientos").find(".movimiento[data-idmovimiento='" + attr + "'] input").val().trim().length > 0) {
									// LLENO
									if (typeof segundoOb[attr] != "object") {
										segundoOb[attr] = {};
									}
									inputmovimientoParent.removeClass("has-error").addClass("has-success");
									segundoOb[attr]["valordeunidad"] = parseFloat(valorinputmovimiento)
								} else {
									// VACIO
									inputmovimientoParent.removeClass("has-success").addClass("has-error");
									errores++;
								}
							} else {
								inputmovimientoParent.removeClass("has-error").addClass("has-success");
								segundoOb[$(v).data("idmovimiento")] = {
									val: parseFloat(valorinputmovimiento)
								}
							}
						} else {
							inputmovimientoParent.removeClass("has-success").addClass("has-error");
							errores++;
						}
					} else {
						if (parseInt(valorinputmovimiento)) {
							var attr = $(this).attr('data-parent');
							if (typeof attr !== typeof undefined && attr !== false) {
								//revisar sielparentestá vacío
								if ($(this).parents(".movimientos").find(".movimiento[data-idmovimiento='" + attr + "'] input").val().trim().length > 0) {
									// LLENO
									if (typeof segundoOb[attr] != "object") {
										segundoOb[attr] = {};
									}
									inputmovimientoParent.removeClass("has-error").addClass("has-success");
									segundoOb[attr]["valordeunidad"] = parseInt(valorinputmovimiento)
								} else {
									// VACIO
									inputmovimientoParent.removeClass("has-success").addClass("has-error");
									errores++;
								}
							} else {
								inputmovimientoParent.removeClass("has-error").addClass("has-success");
								segundoOb[$(v).data("idmovimiento")] = {
									val: parseInt(valorinputmovimiento)
								}
							}
						} else {
							inputmovimientoParent.removeClass("has-success").addClass("has-error");
							errores++;
						}
					}
				} else {
					inputmovimientoParent.removeClass("has-error").addClass("has-success");
				}
			}
		})
		if (Object.keys(segundoOb).length > 0) {
			ob[itemId] = segundoOb;
		}
	})
	if (errores === 0) {
		if (Object.keys(ob).length > 0) {
			saveInventario(ob);
		}
	} else {
		alert("Tiene " + errores + " errores")
	}

	function saveInventario(inventario) {
	    
	    var cantidadDeQueries = 0;
        var cantidadDeQueriesBien = 0;	    
        var cantidadDeQueriesMal = 0;
        
	    $.each(inventario, function(k, v) {
        $.each(v, function(k2, v2) {
            cantidadDeQueries++;
        })
        })
        
		var lafecha = $('#inventario #datepicker').datepicker().datepicker('getDate')
		var obHistorialConsulta = 
		{
		    where:
		    {
		        and:
		        [
		            {
		                fecha : lafecha
		            },
		            {
		                restauranteId : $("#inventario .searchbox input[data-restaurante]").data("restaurante")
		            }
		        ]
		    }
		}
		var obHistorialGuardado = 
		{
		    fecha : lafecha,
		    restauranteId : $("#inventario .searchbox input[data-restaurante]").data("restaurante")
		}
		
		
		$.ajax({
			url: API_URL + "/historiales?filter=" + JSON.stringify(obHistorialConsulta),
			type: "GET",
			success: function(data) {
				if(data.length == 1){
				    alert("Ya existe un inventario para esta fecha")
				}else{
				    	$.ajax({
                			url: API_URL + "/historiales",
                			type: "POST",
                			data: obHistorialGuardado,
                			success: function(data) {
                			    
                			    
                                    var idHistorial = data.id;
                                    $.each(inventario, function(k, v) {
                                        $.each(v, function(k2, v2) {
                                            var elvalor = 0;
                                            if (v2.valordeunidad) {
                                                elvalor = v2.valordeunidad;
                                            }
                                            
                                            
                                            var ob = {
                                                cantidad: v2.val,
                                                costoUnidad: elvalor,
                                                itemId: k,
                                                tipomovimientoId: k2,
                                                historialId:idHistorial
                                            }
                                            $.ajax({
                                                url: API_URL + "/historialesdescripciones",
                                                type: "POST",
                                                data: ob,
                                                success: function(data) {
                                                    cantidadDeQueriesBien++
                                                },
                                                done: function(data){
                                                    if(cantidadDeQueriesBien+cantidadDeQueriesMal == cantidadDeQueries){
                                                        alert("Guardado Finalizado");
                                                    }
                                                }
                                            })
                                        })
                                    })
                                    
                            		
                			}
                		})
				}
			}
		})
		
		
	}
})
$("#inventario .agregar input").on("input", function(e) {
	startSearch($(this))
}).on("focus", function(e) {
	startSearch($(this))
}).on("blur", function(e) {
	startSearch(
		$(this).parents(".agregar").find(".searchcontainer"),
		$(this).parents(".agregar").find(".search")
	)
}).on("keypress", function(e) {
	if (e.keyCode == 13) {
		startSearch($(this))
	}
})

function closeSearch($searchCont, $searchArea) {
	$searchCont.hide(250);
	$searchArea.html("");
}

function startSearch($cont) {
	var elValue = $cont.val();
	var elInput = $cont;
	var $agregadosCont = $cont.parents("#inventario").find(".agregados");
	var $searchCont = $cont.parents(".agregar").find(".searchcontainer");
	var $searchArea = $cont.parents(".agregar").find(".search");
	var elRestaurant = $cont.data("restaurante");
	var arrDeAgregados = []
	$.each($agregadosCont.find(".item"), function() {
		arrDeAgregados.push($(this).data("itemid"));
	})
	if (elValue.length > 2) {
		var ob = {
			where: {
				and: [{
					restauranteId: elRestaurant
				}, {
					id: {
						nin: arrDeAgregados
					}
				}, {
					or: [{
						nombre: {
							like: elValue
						}
					}, {
						descripcion: {
							like: elValue
						}
					}]
				}]
			},
			order : 'nombre ASC'

		}
		var laurl = API_URL + "/items?filter=" + JSON.stringify(ob);
		var xhr = $.ajax({
			url: laurl,
			type: "GET"
		})
		xhr.done(function(data) {
			addToSearchResults($searchArea, $searchCont, $agregadosCont, elInput, data)
		})

		function addToSearchResults($searchArea, $searchCont, $agregadosCont, elInput, data) {
			var $searchArea = $cont.parents(".agregar").find(".search");
			var html = "";
			if (data.length == 0) {
				html += "<div class='col-xs-12 searchresult'>";
				html += "<h3>No hay resultados para esta búsqueda</h3>";
				html += "</div>";
			} else {
				$.each(data, function(k, v) {
					html += "<div class='col-xs-12 searchresult item row-xs-height'>";
					html += "<div class='col-xs-7 col-xs-height'>";
					html += "<h3>" + v.nombre + "</h3>";
					html += "<p>" + v.descripcion + "</p>";
					html += "</div>";
					html += "<div class='col-xs-4 col-xs-height col-middle'>";
					html += "<a href='#' data-itemid='" + v.id + "' data-nombre='" + v.nombre + "' data-unidaddemedida='" + v.unidaddemedida + "' class='btn btn-info pull-right'> Agregar </a>"
					html += "</div>";
					html += "</div>";
				});
			}
			$searchArea.html(html);
			$searchCont.show(200);
			$(document).mouseup(function(e) {
				var $containerParaCerrar = $cont.parents(".agregar");
				if (!$containerParaCerrar.is(e.target) // if the target of the click isn't the container...
					&& $containerParaCerrar.has(e.target).length === 0) // ... nor a descendant of the container
				{
					closeSearch($searchCont, $searchArea);
				}
			});
			doListenersForSearchResults($searchCont, $agregadosCont, $searchArea)
		}

		function doListenersForSearchResults($searchCont, $agregadosCont, $searchArea) {
			$searchCont.find(".searchresult.item a").on("click", function(e) {
			    
			    var elbutton = $(this)
			    if(!elbutton.hasClass("ocupado")){
			        elbutton.addClass("ocupado")    
    				var elNombre = $(this).data("nombre");
    				var elItemId = $(this).data("itemid");
    				var laUnidadDeMedida = $(this).data("unidaddemedida");
    				var laurl = API_URL + '/tiposmovimientos?filter={"order": "orden ASC"}';
    				$.ajax({
    					url: laurl,
    					type: "GET",
    					success : function(data) {
        					var html = "";
        					html += "<div class='col-xs-12 item' data-itemid='" + elItemId + "' >";
        					html += "<h3>" + elNombre + " (" + laUnidadDeMedida + ")<i class='fa fa-fw fa-caret-down pull-right'></i></h3>";
        					html += "<div class='col-xs-12 row-xs-height movimientos' >";
        					$.each(data, function(k, v) {
        						html += "<div class='col-xs-12 row-xs-height movimiento form-group' data-idmovimiento='" + v.id + "' >";
        						html += "<div class='col-xs-8 col-xs-height col-middle nombre'>";
        						html += "<label class='control-label'>" + capitalize(v.nombre) + "</label>";
        						html += "</div>";
        						html += "<div class='col-xs-4 col-xs-height col-middle valor'>";
        						html += "<input type='text' class='form-control'>";
        						html += "</div>";
        						html += "</div>";
        						if (v.tienevalordeunidad) {
        							html += "<div class='col-xs-12 movimiento tienevalordeunidad form-group' data-parent='" + v.id + "'>";
        							html += "<div class='col-xs-8 col-xs-height col-middle nombre'>";
        							html += "<label class='control-label'>Valor de Unidad - (" + laUnidadDeMedida + ")</label>";
        							html += "</div>";
        							html += "<div class='col-xs-4 col-xs-height col-middle valor '>";
        							html += "<input type='text' class='form-control'>";
        							html += "</div>"; 
        							html += "</div>";
        						}
        					})
        					html += "</div>";
        					html += "</div>";
        					$agregadosCont.prepend(html);
        					$agregadosCont.find(".item[data-itemid='" + elItemId + "']").show(200);
        					$agregadosCont.find(".item[data-itemid='" + elItemId + "']").find("h3").on("click", function() {
        						$agregadosCont.find(".item[data-itemid='" + elItemId + "']").find(".movimientos").toggle(200);
        					})
        					closeSearch($searchCont, $searchArea);
        				},
        				done : function(data){
        				    elbutton.removeClass("ocupado")
        				}
    				})
			    }
			})
		}
	} else if (elValue.length == 0) {
		// closeSearch($searchCont, $searchArea);
	}
}