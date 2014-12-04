$('#reportes #datepickerInicio').datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#reportes #datepickerFin" ).datepicker( "option", "minDate", selectedDate );
      }
    });

$('#reportes #datepickerFin').datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 1,
    onClose: function( selectedDate ) {
        $( "#reportes #datepickerInicio" ).datepicker( "option", "maxDate", selectedDate );
    }
});

$("#reportes.flujodiarioitems").trigger("click");
$("#reportes.flujodiarioitems .getReporte").on("click",function(){
    
    $('#reportes .reportecont .acciones').hide(200)
    $("#reportes #showgraph.reporte").hide(200)
    console.log("clickeando")
    var restauranteId = $("#reportes").data("restauranteId");
    var lafechaInicio = $('#reportes #datepickerInicio').datepicker().datepicker('getDate');
    var lafechaFin = $('#reportes #datepickerFin').datepicker().datepicker('getDate');
    
    if(!lafechaInicio){
        lafechaInicio = new Date("12/02/2014")
    }
    if(!lafechaFin){
        lafechaFin = new Date("12/06/2014")
    }
    
    obtenerInventarios(lafechaInicio,lafechaFin,restauranteId)

})

function obtenerInventarios(fechainicio, fechafin,restauranteId){
    var obHistorialConsulta = 
    {
        where: 
        {
            and: 
            [
                {
                    fecha:
                    {
                        gte: fechainicio
                    }
                },
                {
                    fecha:
                    {
                        lte: fechafin
                    }
                },
                {
                    restauranteId: restauranteId
                }
            ]
        }
    }
    $.ajax({
        url:API_URL + "/historiales?filter=" + JSON.stringify(obHistorialConsulta),
        type:"GET",
        success:function(data){
            var arrHistoriales = []
            $.each(data,function(k,v){
                arrHistoriales.push(v.id)
            })
            obtenerDescripcionDeInventarios(arrHistoriales,data,restauranteId);
        }
    })
}

function obtenerDescripcionDeInventarios(arrHistorialesId,historiales,restauranteId){
    var losHistoriales = historiales;
    var obHistorialDescripcionConsulta = 
    {
        include: ["tipomovimiento","item","historial"],
        where: 
        {
            and: 
            [
                {
                    historialId:
                    {
                        inq: arrHistorialesId
                    }
                },
                {
                    restauranteId: restauranteId
                }
            ]
        }
    }
    $.ajax({
        url:API_URL + "/historialesdescripciones?filter=" + JSON.stringify(obHistorialDescripcionConsulta),
        type:"GET",
        success:function(data){
            
            var arrNombres = [];
            $.each(data,function(k,v){
                arrNombres.push(v.item.nombre)
            })
            var arrNombresUnicos = _.uniq(arrNombres).reverse();
            var ArrHeaders= ["Fecha"]
            $.each(arrNombresUnicos,function(k,v){
                ArrHeaders.push(v);
            })
            
            
            var arrFechas =[]
            $.each(losHistoriales,function(k,v){
                arrFechas.push(v.fecha)    
            })
            
        
            var OB = {}
            $.each(arrFechas,function(k2,v2){
                var arrN = {};
                $.each(arrNombresUnicos,function(k3,v3){
                    var total = 0
                    $.each(data,function(k,v){
                        if(v.historial.fecha == v2 && v.item.nombre == v3)
                        {
                            if(v.tipomovimiento && v.tipomovimiento.nombre == "ingreso"){
                                total += v.cantidad;
                            }else{
                                total -= v.cantidad;
                            }
                        }
                    })
                    arrN[v3] = total;
                })
                OB[v2] = arrN;
            })
            
            
            
            
            var arrGraphs = 
            [
               ArrHeaders
            ];
            
            $.each(arrFechas,function(k,v){
                var arr = [];
                arr.push(moment(v).format("DD/MM/YYYY"))
                $.each(arrNombresUnicos,function(k2,v2){
                    arr.push(OB[v][v2])
                })
                arrGraphs.push(arr)
            })
            $("#reportes #showgraph.reporte").show(250,function(){drawChart()})
            
            $(window).resize(function(){
                drawChart();
            });
            function drawChart() {
                var data = google.visualization.arrayToDataTable(arrGraphs);
                var options = {
                    title: 'Flujo de items',
                    curveType: 'function',
                    showTextEvery:1,
                    legend: { position: 'bottom' },
                    is3D: true
                };
                
                var chart = new google.visualization.LineChart(document.getElementById('showgraph'));
                
                google.visualization.events.addListener(chart, 'ready', function () {
                    $('#reportes .reportecont .acciones').show(200);
                    $('#reportes .reportecont .acciones a').attr("href",chart.getImageURI())
                });
                chart.draw(data, options);
            }
            
           
            
            /*
            $.each(data,function(k,v){
                [
                    moment(v.historial.fecha).format("DD/MM/YYYY"),
                    ,
                    ""
                ]
            })
            
            */
            
        }
    })
}