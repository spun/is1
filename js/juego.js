
Broadcast.init({
	state: state,	// Declarado en juego.html
	onopen: function() {
		console.log('# Socket open');
		Broadcast.sendMessage("http://localhost:8080/gamebroadcast/load", "None");
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
			BlackBoard.drawPoints(dat.content);
		}
		else if(dat.type == "infoGame")
		{
			console.log(dat);
			BlackBoard.context.clearRect(0, 0, 600, 500);
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
			$("#"+dat.content.painter).css("borderColor", "#09f")
			
			if(state.user_key == dat.content.painter)
			{
				$("#myCanvas").css("borderColor", "#6DBA00");
				//BlackBoard.lock(false);
			}
			else
			{
				//BlackBoard.lock(true);
			}
			
			IniciarCrono();
		}
		else if (dat.type == "finish")
		{
			$("#myCanvas").css("borderColor", "#FF5100");
			// BlackBoard.lock(true);
			Broadcast.sendMessage("http://localhost:8080/gamebroadcast/load", "New");
		}
	}
});

ChatZone.init({
	history: $('#chatZone-history'),
	form: $('#chatZone-form'),
	urlChat: 'http://'+location.host+'/gamebroadcast/chat',
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
		$('#colorPicker-btn').popover('hide');
	});
	
	$("#toLila").live("click", function() {
		BlackBoard.setColor("#A020F0");
		$('#colorPicker-btn').popover('hide');
	});

	$("#toTres").on("click", function() {
		BlackBoard.setThickness(3);
	});
	
	$("#toCinco").on("click", function() {
		BlackBoard.setThickness(5);
	});
	
	$("#toDiez").on("click", function() {
		BlackBoard.setThickness(10);
	});
	
	$("#toVeinte").on("click", function() {
		BlackBoard.setThickness(20);
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
	
	
	

$(document).ready(function(){

	/*channel = new goog.appengine.Channel('{{ token }}');
	socket = channel.open();
	socket.onopen = function() {
		console.log("onopen");
		sendMessage("http://localhost:8080/gamebroadcast/load", "None");
	};
	socket.onmessage = function(m) {
		dat = JSON.parse(m.data)
		if(dat.type == "chat")
		{
			ChatZone.receiveMessage(dat.content);
		}
		else if(dat.type == "draw")
		{
			BlackBoard.drawFromCoord(dat.content)
		}
		else if(dat.type == "winner")
		{
			ChatZone.reportWinner(dat.content);
		}
		else if(dat.type == "infoGame")
		{
			console.log(dat);
			BlackBoard.context.clearRect(0, 0, 600, 500);
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
			$("#"+dat.content.painter).css("borderColor", "#09f")
			
			if(state.user_key == dat.content.painter)
			{
				$("#myCanvas").css("borderColor", "#6DBA00");
				BlackBoard.lock(false);
			}
			else
			{
				BlackBoard.lock(true);
			}
			
			IniciarCrono();
		}
		else if (dat.type == "finish")
		{
			$("#myCanvas").css("borderColor", "#FF5100");
			BlackBoard.lock(true);
			sendMessage("http://localhost:8080/gamebroadcast/load", "New");
		}

	};
	socket.onerror = function() {
		console.log("onerror");
	};
	socket.onclose = function() {
		console.log("onclose");
	};

	sendMessage = function(path, opt_param) {
		path += '?g=' + state.game_key;
		if (opt_param) {
			path += '&d=' + opt_param;
		}
		var xhr = new XMLHttpRequest();
		xhr.open('POST', path, true);
		xhr.send();
	};

*/

	



	/* ##########
	

####### */
	
});

//CRONOMETRO  
var CronoID = null  
var CronoEjecutandose = false  
var decimas, segundos, minutos  
  
function DetenerCrono (){  
	if(CronoEjecutandose)  
		clearTimeout(CronoID)  
	CronoEjecutandose = false  
}  
  
function InicializarCrono () {  
	//inicializa contadores globales  
	decimas = 9 
	segundos = 29  
	minutos = 0  
	  
	//pone a cero los marcadores  
	document.crono.display.value = '00:30:00'  
}  
  
function MostrarCrono () {  
			 
	//incrementa el crono  
	decimas--
	
	if ( decimas < 0 )
	{  
		decimas = 9  
		segundos--
		if ( segundos < 0 )
		{  
			segundos = 59  
			minutos--  
			if ( minutos < 0 )
			{  
				DetenerCrono();
				Broadcast.sendMessage('http://'+location.host+'/gamebroadcast/crono', "None");
				return true;
			}  
		}  
	}  
  
	//configura la salida  
	var ValorCrono = ""  
	ValorCrono = (minutos < 10) ? "0" + minutos : minutos  
	ValorCrono += (segundos < 10) ? ":0" + segundos : ":" + segundos  
	ValorCrono += ":" + decimas   
			  
	document.crono.display.value = ValorCrono  
  
	CronoID = setTimeout("MostrarCrono()", 100)  
	CronoEjecutandose = true  
	return true  
}  
  
function IniciarCrono () {  
	DetenerCrono()  
	InicializarCrono()  
	MostrarCrono()  
}
