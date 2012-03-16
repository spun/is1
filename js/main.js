$(document).ready(function(){
	console.log("# Document loaded");

	$("#login-button").on("click", function(e) {
		$('#login-menu').toggle().find("input").first().focus();
		e.preventDefault();
	});
	
	$(".botonIndex").on("hover", function(e) {
		$(this).find("img").stop(true).animate({
			opacity: 0.7,
			left: -20
		}, 500);
	}).on('mouseleave', function() {
		$(this).find("img").stop(true).animate({
			opacity: 0.3,
			left: -40
		}, 500);
			
	});;
});
