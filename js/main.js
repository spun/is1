$(document).ready(function(){
	console.log("# Document loaded");

	$("#login-button").on("click", function(e) {
		$('#login-menu').toggle().find("input").first().focus();
		e.preventDefault();
	});
});
