$(document)
	.ready(function() {
		var hash = window.location.hash;
		switch (hash) {
			case ("#login"):
				$('#loginModal')
					.modal("show");
		}

		$('.carousel')
			.carousel({
				autoplay: true,
				interval: 3000
			});

		randomizeInput(1500, $('.index form input#srch-term'), 0)

		function randomizeInput(time, $container) {
			var a = [
				"Gourmet",
				"Italiana ",
				"Mediterranea",
				"Francesa",
				"Naturista",
				"NewYorker",
				"Chilena"
			];
			setTimeout(function() {
				var pos = getRandomInt(0, a.length);
				$container.removeAttr('placeholder');
				$container.attr("placeholder", a[pos]);
				randomizeInput(time, $container);

			}, time);

		}


		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		$(".scroll-link")
			.on("click", function() {
				scrollToID($(this)
					.attr("attr_goto"));
			});

	});



scrollToID = function(id, speed) {
	id = "#" + id;
	var offSet = $("ul.nav.navbar-nav")
		.height();
	var targetOffset = $(id)
		.offset()
		.top;
	var mainNav = $('#main-nav');
	if (!speed) {
		speed = 500;
	}
	$('html,body')
		.animate({
			scrollTop: targetOffset
		}, speed);
	if (mainNav.hasClass("in")) {
		mainNav.collapse("hide");
	}
};

cerrarDiv = function($containerParaCerrar,velocidad){
    
}