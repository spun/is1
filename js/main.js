$(document).ready(function() {
	setTimeout("displayArchievements()",500);
	showMessages();
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


function showMessages() {
	var num = getCookie("numMessages");
	if (num!=null && num!="")
	{
		$("#badgeMessages").html(num);
		if(num>0)
		$("#badgeMessages").addClass("badge-info");
	}
	setTimeout("getNoReadMessages()",1000);
}


function getNoReadMessages() {
	
	$.getJSON("/ajaxapi/noread_messages" ,
		function(data) {
			$("#badgeMessages").html(data);
			if(data>0)
			{
				$("#badgeMessages").addClass("badge-info");
				setCookie("numMessages",data,30);
			}
			else
			{
				$("#badgeMessages").removeClass("badge-info");
				setCookie("numMessages","0",30);
			}
			setTimeout("getNoReadMessages()",60000);
	});
}




function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}


function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}
