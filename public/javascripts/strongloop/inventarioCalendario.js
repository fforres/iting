$(document).ready(function () {
	$("#calendar .responsive-calendar").responsiveCalendar({
    	onDayClick: function(events) { 
    		console.log(events);
    		var day = $(this).data("day")
    		var month = $(this).data("month")
    		var year = $(this).data("year")
    		console.log(new Date(month+"/"+day+"/"+year));
    		
    	}
	}
  );
});
/*
onDayClick: function(events) { }
-*/
