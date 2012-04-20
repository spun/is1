
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
	board2: $('#myCanvas2'),
	urlDraw: location.host+'/gamebroadcast/draw'
});

	$("#toRojo").on("click", function() {
		BlackBoard.setColor("#FF0000");
	});
	
	$("#toAzul").on("click", function() {
		BlackBoard.setColor("#09f");
	});
	
	$("#toAmarillo").on("click", function() {
		BlackBoard.setColor("#FFFF00");
	});
	
	$("#toNegro").on("click", function() {
		BlackBoard.setColor("#000000");
	});
	
	$("#toVerde").on("click", function() {
		BlackBoard.setColor("#00FF00");
	});
	
	$("#toMarron").on("click", function() {
		BlackBoard.setColor("#8B6914");
	});
	
	$("#toNaranja").on("click", function() {
		BlackBoard.setColor("#FFA500");
	});
	
	$("#toGris").on("click", function() {
		BlackBoard.setColor("#7F7F7F");
	});
	
	$("#toLila").on("click", function() {
		BlackBoard.setColor("#A020F0");
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

	$("#toLapiz").on("click", function() {
		BlackBoard.setTool('pencil');
	});
	
	$("#toRectangulo").on("click", function() {
		BlackBoard.setTool('rectangle');
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
