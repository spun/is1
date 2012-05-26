
Broadcast.init({
	state: state,	// Declarado en juego.html
	onopen: function() {
		Broadcast.sendMessage('http://'+location.host+'/gamebroadcast/load', "New");
	},
	onmessage: function(m) {
		dat = JSON.parse(m.data);
		if(dat.type == "chat")
		{
			ChatZone.receiveMessage(dat.content);
		}
		else if(dat.type == "winner")
		{
			ChatZone.reportWinner(dat.content);
		}
		else if(dat.type == "draw")
		{
			if(dat.drawer == $(".userBlock.active").attr('id'))
				BlackBoard.drawPoints(dat.content);
		}
		else if(dat.type == "infoGame")
		{
			BlackBoard.context.clearRect(0, 0, 600, 500);
			BlackBoard.renderContext.clearRect(0, 0, 600, 500);
			if(dat.content.drawing == true)
			{
				$("#wordZone").text(dat.content.word);
			}
			else
			{
				var tam = dat.content.word;
				$("#wordZone").text("");
				for(i=0; i<tam; i++)
				{							
					var t = $("#wordZone").text();
					$("#wordZone").text(t+"_ ");
				}
			}
			$("#wordZone").slideDown();						
			$(".userBlock").removeClass("active");
			$("#"+dat.content.painter).addClass("active");
			
			if(state.user_key == dat.content.painter)
			{
				$(BlackBoard.canvasRender).css("borderColor", "#6DBA00");
				BlackBoard.lock(false);
			}
			else
			{
				$(BlackBoard.canvasRender).css("borderColor", "#FF5100");
				BlackBoard.lock(true);
			}
			
			IniciarCrono();
		}
		else if (dat.type == "finish")
		{
			$(BlackBoard.canvasRender).css("borderColor", "#FF5100");
			BlackBoard.lock(true);
			Broadcast.sendMessage('http://'+location.host+'/gamebroadcast/load', "New");
			ChatZone.reportTimeEnd(dat.content);
		}
		else if (dat.type == "finPartida")
		{
				$('#modalFin').modal('show')
				if(dat.content.Winner == 'Empate')
				{
					$("#titleGanador").text("");
					$("span#winner").text('Empate')
				}
				else
				{
					$("span#winner").text(dat.content.Winner)
				}
		}
	}
});

ChatZone.init({
	history: $('#chatZone-history'),
	form: $('#chatZone-form'),
	urlChat: 'http://'+location.host+'/gamebroadcast/chat',
	urlLoad: 'http://'+location.host+'/gamebroadcast/load',
	sender: Broadcast.sendMessage
});

BlackBoard.init({
	board: $('#myCanvas'),
	urlDraw: 'http://'+location.host+'/gamebroadcast/draw',
	sender: Broadcast.sendMessage
});



	$('#colorPicker-btn').on('click', function(e) {
		$(this).popover('toggle');
		e.preventDefault();
	});
	
	
	var colorPickerContent = '<ul id="colorPicker">';
	colorPickerContent += '<li id="toRojo" style="background-color: #FF0000" ></li>';
	colorPickerContent += '<li id="toAzul" style="background-color: #09f" ></li>';
	colorPickerContent += '<li id="toAmarillo" style="background-color: #FFFF00" ></li>';
	colorPickerContent += '<li id="toNegro" style="background-color: #000000" ></li>';
	colorPickerContent += '<li id="toVerde" style="background-color: #00FF00" ></li>';
	colorPickerContent += '<li id="toMarron" style="background-color: #8B6914" ></li>';
	colorPickerContent += '<li id="toNaranja" style="background-color: #FFA500" ></li>';
	colorPickerContent += '<li id="toGris" style="background-color: #7F7F7F" ></li>';
	colorPickerContent += '<li id="toLila" style="background-color: #A020F0" ></li>';
	colorPickerContent += '</ul>';
	

	$('#colorPicker-btn').popover({
		placement: 'right',

		trigger: 'manual',
		content: colorPickerContent
	});



	$("#toRojo").live("click", function() {
		BlackBoard.setColor("#FF0000");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toAzul").live("click", function() {
		BlackBoard.setColor("#09f");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toAmarillo").live("click", function() {
		BlackBoard.setColor("#FFFF00");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toNegro").live("click", function() {
		BlackBoard.setColor("#000000");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toVerde").live("click", function() {
		BlackBoard.setColor("#00FF00");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toMarron").live("click", function() {
		BlackBoard.setColor("#8B6914");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toNaranja").live("click", function() {
		BlackBoard.setColor("#FFA500");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toGris").live("click", function() {
		BlackBoard.setColor("#7F7F7F");
		$('#colorPicker-btn').css("background-color", "red");
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toLila").live("click", function() {
		BlackBoard.setColor("#A020F0");
		$('#colorPicker-btn').popover('hide');
	});

	$("#toTres").on("click", function(e) {
		$(".thickBtn").removeClass('active');
		$("#toTres").addClass('active');
		BlackBoard.setThickness(3);
		e.preventDefault();
	});
	
	$("#toCinco").on("click", function(e) {
		$(".thickBtn").removeClass('active');
		$("#toCinco").addClass('active');
		BlackBoard.setThickness(5);
		e.preventDefault();
	});
	
	$("#toDiez").on("click", function(e) {
		$(".thickBtn").removeClass('active');
		$("#toDiez").addClass('active');
		BlackBoard.setThickness(10);
		e.preventDefault();
	});
	
	$("#toVeinte").on("click", function(e) {		
		$(".thickBtn").removeClass('active');
		$("#toVeinte").addClass('active');
		BlackBoard.setThickness(20);
		e.preventDefault();
	});

	$("#toLapiz").on("click", function(e) {
		BlackBoard.setTool('pencil');
		$("#toLapiz").addClass('active');
		$("#toRectangulo").removeClass('active');
		e.preventDefault();
	});
	
	$("#toRectangulo").on("click", function(e) {
		BlackBoard.setTool('rectangle');
		$("#toRectangulo").addClass('active');
		$("#toLapiz").removeClass('active');
		e.preventDefault();
	});
	


//CRONOMETRO  

var CronoID = null  
var CronoEjecutandose = false  
var segundos 
  
function DetenerCrono (){  
	if(CronoEjecutandose)  
		clearTimeout(CronoID)  
	CronoEjecutandose = false  
}  
  
function InicializarCrono () {  
	//inicializa contadores globales  
	segundos = 90 
}  
  
function MostrarCrono () {  
			 
	segundos--;
	if ( segundos <= 0 )
	{  
		DetenerCrono();
		$('.progress .bar').css("width","0%")
		Broadcast.sendMessage('http://'+location.host+'/gamebroadcast/crono', "None");
		return true;
		
	}
	else
	{
		var progreso = (segundos*100)/90
		$('.progress .bar').css("width",progreso+"%")
	}
  
	CronoID = setTimeout("MostrarCrono()", 1000)  
	CronoEjecutandose = true

	return true  
}  
  
function IniciarCrono () {  
	DetenerCrono()  
	InicializarCrono()  
	MostrarCrono()  
}



$(document).ready(function(){

	
});
