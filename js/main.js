$(document).ready(function(){
	console.log("# Document loaded");

	$("#login-button").on("click", function() {
		$('#login-menu').toggle().find("input").first().focus();
		e.preventDefault();
	});
});
