var calendar = $("#inventario #calendar").calendar(
{
    tmpl_path: "/3rdparty/responsive-calendar/tmpls/",
    events_source: function () { return []; },
    onAfterViewLoad: function(view) {		
    	console.log(view) 
    	$(".cal-cell").unbind()
    	$(".cal-cell span").unbind()
   	    var restauranteId = $("#inventario").data("restaurantid");
    	var fechaInicio = moment($(".cal-cell .cal-month-day.cal-day-inmonth span").first().data("cal-date"))._d
    	var fechaTermino = moment($(".cal-cell .cal-month-day.cal-day-inmonth span").last().data("cal-date"))._d
    	
    	
		var obHistorialConsulta = 
		{
		    where:
		    {
		        and:
		        [
		            {
		                fecha : {
		                	gte : fechaInicio
		                }
		            },
		            {
		                fecha : {
		                	lte : fechaTermino
		                }
		            },
	                {
	                    restauranteId: restauranteId
	                }
		        ]
		    }
		}
		
		
		console.log(API_URL + "/historiales?filter=" + JSON.stringify(obHistorialConsulta))
		$.ajax({
			url: API_URL + "/historiales?filter=" + JSON.stringify(obHistorialConsulta),
			type:"GET",
    		success:function(data){
		    	addToCalCells($("#inventario #calendar"),data)
    		}
    	})
    }
});     

function addToCalCells($cont,data){
	$.each(data,function(k,v){
		var elspan = $cont.find(".cal-cell .cal-month-day.cal-day-inmonth span[data-cal-date='"+moment(v.fecha).format("YYYY-MM-DD")+"']");
		var laCel = elspan.parents(".cal-cell");
		laCel.addClass('tieneEvento').data("idHistorial",v.id);
		laCel.on("click",function(e){
			window.open(
				"/app/inventario/" + $(this).data("idHistorial"),
				'_blank'
			)
			
		})
	})

}