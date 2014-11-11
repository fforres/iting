$(window)
	.konami({
		cheat: function() {
			doKonami()
		}
	});

$(document)
	.ready(function() {

		var hash = window.location.hash;
		switch (hash) {
			case ("#login"):
				$('#loginModal')
					.modal("show");
			case ("#konamicode"):
				doKonami();
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


function doKonami() {
	console.log("CHEATCODE!");
	$("body")
		.append("<img id='nyan' src='images/nyan.gif' style='display:none;z-index:1000;'>");
	$.getScript("/javascripts/howler.min.js", function(e) {
		var sound = new Howl({
			urls: ['/audio/konami/o_nyan.mp3'],
			loop: true,
			autoplay: true,
			onplay: function() {
				$("#nyan")
					.show();
				$(document)
					.mousemove(function(e) {
						$('#nyan')
							.offset({
								left: e.pageX + 1,
								top: e.pageY + 1
							});
					});
			}
		})


	})
}

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