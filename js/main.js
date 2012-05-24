$(document).ready(function() {
	setTimeout("displayArchievements()",500);
	$.getScript('js/kode.js');	
});

function displayArchievements() {

	$.getJSON("/ajaxapi/earned_achievements" ,
		function(data) {
			if(data)
			{
				$.each(data, function(key,info)
				{	
					var achievement = $("<div>", {
						class: "achievementBox"		
					});
					
					var achievementCloseButton = $("<a>", {
						class: "close",
						text: "x", 
						click: function() {  
							closeAchievement(this)  
						}  
					}).appendTo(achievement);
					
					var achievImg = $("<img>",{
						src: "/img/logros/"+info.image, 
						class: "achievement-logo"
					}).appendTo(achievement);	
					
					var achievementTitle = $("<a>", {
						class: "achievement-name",
						text: info.name, 
						href: "/logros"
					}).appendTo(achievement);
					
					var achievementDesc = $("<p>", {
						class: "achievement-desc",
						text: info.desc, 
					}).appendTo(achievement);	
					
					achievement.appendTo("#achievementWrap").fadeIn().delay('5000').fadeOut();
				
				});
			}			
	});
}

function closeAchievement(box)
{
	$(box).parent().stop().fadeOut();
}
