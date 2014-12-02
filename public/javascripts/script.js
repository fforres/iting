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

jQuery.extend({
	getScript: function(url, callback) {
		var head = document.getElementsByTagName("head")[0] || document.documentElement;
		var script = document.createElement("script");
		script.src = url;
		// Handle Script loading
		{
			var done = false;
			// Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
				if (!done && (!this.readyState || this.readyState === "loaded" ||
					this.readyState === "complete")) {
					done = true;
					//success();
					//complete();
					if (callback)
						callback();
					// Handle memory leak in IE
					script.onload = script.onreadystatechange = null;
					if (head && script.parentNode) {
						head.removeChild(script);
					}
				}
			};
		}
		head.insertBefore(script, head.firstChild);
		return undefined;
	}
});
