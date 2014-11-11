var map,currentInfoWindow,geoCoder,pos;

$(document).on("ready",function(e){
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
  			var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			initialize(pos);

	  	});
	}else{
		initialize(false);
	}

});


function initialize(p) {
	var mapOptions = {};
	if(p){
		mapOptions = {
			zoom: 15,
			center: p
		};
		map = new google.maps.Map(
	 		document.getElementById('map-canvas'),	      
				mapOptions
		);
		new google.maps.Marker({
			position: p,
			map: map,
			animation:google.maps.Animation.DROP,
			title: "Yo"
		});
	}
	else{
		mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng(-33.5,-70.6)
		};
		map = new google.maps.Map(
	 		document.getElementById('map-canvas'),	      
				mapOptions
		);
	} 

}



function BounceForAWhile(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(
  		function() {
			marker.setAnimation(null);
    	}, 
   		1400 
    );
}

function closeOtherWindows() {
    if (infowindow) {
    	infowindow.close();
	}
}
function UpdateLateralInfo(marker){
	console.log(marker.id)
}

