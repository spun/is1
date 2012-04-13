var BlackBoard = {
	
	init: function( config ) {
		this.config = config;
		this.context = this.config.board[0].getContext('2d');

		this.isPenDown = false;
		this.penDownPos = {};
		this.penColor = "#09f";
		this.penThickness = 3;

		this.locked = false;
		this.moves = [];

		this.bufferedPath = [];
		this.lastBufferTime = new Date().getTime();
		this.broadcastPathIntervalID;

		if (!this.context)
			alert('Ocurrió un error: # No existe "context"');
		else
			this.bindEvents();

	},
	
	lock: function(status) {
		this.locked = status;		
	},

	bindEvents: function() {
		this.config.board.on('mousedown', this.mouseDown);
		this.config.board.on('mouseleave', this.mouseUp);
		$(document).on('mouseup', this.mouseUp);
		this.config.board.on('mousemove', this.mouseMove);
	},

	mouseDown: function (e) {
		var self = BlackBoard;

		self.isPenDown = true;
		self.penDownPos.x = e.pageX - this.offsetLeft;
		self.penDownPos.y = e.pageY - this.offsetTop;

		clearInterval(self.broadcastPathIntervalID);
		self.broadcastPathIntervalID = setInterval(self.broadcastPath, 600);

		console.log("Mouse down");
		return false;
	},

	mouseUp: function() {
		var self = BlackBoard;
		if (self.isPenDown) {
			console.log("Mouse up");
			self.isPenDown = false;
		}						
	},

	mouseMove: function(e) {

		var self = BlackBoard;
		if(self.isPenDown && !self.locked)
		{
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;

			if ((new Date().getTime() - self.lastBufferTime) > 10) {
				self.bufferedPath.push(self.penDownPos.x + "," + self.penDownPos.y + "," + mouseX + "," + mouseY);
				self.lastBufferTime = new Date().getTime();
				
				self.drawLine(self.penColor, self.penThickness, self.penDownPos.x, self.penDownPos.y, mouseX, mouseY)

				self.penDownPos.x = e.pageX - this.offsetLeft;
				self.penDownPos.y = e.pageY - this.offsetTop;

			}

			//console.log("Mouse move");
			
			
		}

	},

	drawLine: function(color, thickness, x1, y1, x2, y2) {
		this.context.strokeStyle = color;
		this.context.lineWidth   = thickness;
		this.context.lineCap = 'round';
		this.context.beginPath();
		this.context.moveTo(x1, y1)
		this.context.lineTo(x2, y2);
		this.context.stroke();
	},

	
	broadcastPath: function() {
		var self = BlackBoard;
		

		if (self.bufferedPath.length == 0) {
			console.log("no hay nada que enviar");
			if (!self.isPenDown) {
				
				clearInterval(self.broadcastPathIntervalID);
			}
			return;
		}

		/* ENVIO DEL MENSAJE */						
		self.sendBuffer();

		self.bufferedPath = [];
		if (!self.isPenDown) {
			clearInterval(self.broadcastPathIntervalID);
		}
	},
	
	sendBuffer: function() {
		
		var self = BlackBoard;
		console.log(self.bufferedPath)
		sendMessage("http://localhost:8080/gamebroadcast/draw", self.bufferedPath);

	},
	
	drawFromCoord: function(m) {
		var self = BlackBoard;
		//console.log(m.coord);
		var path = m.coord.split(",");

		// For each point, push a "lineTo" command onto the drawing-command stack 
		// for the sender
		for (var i = 0; i < path.length; i+=4)
		{							
			posOri = {x:parseInt(path[i]), y:parseInt(path[i+1])};
			position = {x:parseInt(path[i+2]), y:parseInt(path[i+3])};
		
			var point = {posOrigen: posOri, posFinal: position};						
			self.moves.push(point);						

			setTimeout(self.drawTest,(i/2)*10);
			

		}
		console.log(self.moves);
		
	},

	drawTest: function() {
		var self = BlackBoard;
		var datos = self.moves.shift()

		self.context.strokeStyle = self.penColor;
		self.context.lineWidth   = self.penThickness;
		self.context.lineCap = 'round';
		self.context.beginPath();
		self.context.moveTo(datos.posOrigen.x, datos.posOrigen.y)
		self.context.lineTo(datos.posFinal.x, datos.posFinal.y);
		self.context.stroke();
	}
};
//~ 
//~ 





//~ 
//~ 
//~ var BlackBoard = {
	//~ 
	//~ init: function( config ) {
		//~ this.config = config;
		//~ this.context = this.config.board[0].getContext('2d');
//~ 
		//~ this.isPenDown = false;
		//~ this.penDownPos = {};
		//~ this.penColor = "#09f";
		//~ this.penThickness = 3;
//~ 
		//~ this.locked = false;
		//~ this.moves = [];
//~ 
		//~ this.bufferedPath = [];
		//~ this.lastBufferTime = new Date().getTime();
		//~ this.broadcastPathIntervalID;
//~ 
		//~ if (!this.context)
			//~ alert('Error: failed to getContext!');
		//~ else
			//~ this.bindEvents();
//~ 
	//~ },
	//~ 
	//~ lock: function(status) {
		//~ this.locked = status;		
	//~ },
//~ 
	//~ bindEvents: function() {
		//~ this.config.board.on('mousedown', this.mouseDown);
		//~ this.config.board.on('mouseleave', this.mouseUp);
		//~ $(document).on('mouseup', this.mouseUp);
		//~ this.config.board.on('mousemove', this.mouseMove);
	//~ },
//~ 
	//~ mouseDown: function (e) {
		//~ var self = BlackBoard;
//~ 
		//~ self.isPenDown = true;
		//~ self.penDownPos.x = e.pageX - this.offsetLeft;
		//~ self.penDownPos.y = e.pageY - this.offsetTop;
//~ 
		//~ clearInterval(self.broadcastPathIntervalID);
		//~ self.broadcastPathIntervalID = setInterval(self.broadcastPath, 600);
//~ 
		//~ console.log("Mouse down");
		//~ return false;
	//~ },
//~ 
	//~ mouseUp: function() {
		//~ var self = BlackBoard;
		//~ if (self.isPenDown) {
			//~ console.log("Mouse up");
			//~ self.isPenDown = false;
		//~ }						
	//~ },
//~ 
	//~ mouseMove: function(e) {
//~ 
		//~ var self = BlackBoard;
		//~ if(self.isPenDown && !self.locked)
		//~ {
			//~ var mouseX = e.pageX - this.offsetLeft;
			//~ var mouseY = e.pageY - this.offsetTop;
//~ 
			//~ if ((new Date().getTime() - self.lastBufferTime) > 10) {
				//~ self.bufferedPath.push(self.penDownPos.x + "," + self.penDownPos.y + "," + mouseX + "," + mouseY);
				//~ self.lastBufferTime = new Date().getTime();
				//~ 
				//~ self.drawLine(self.penColor, self.penThickness, self.penDownPos.x, self.penDownPos.y, mouseX, mouseY)
//~ 
				//~ self.penDownPos.x = e.pageX - this.offsetLeft;
				//~ self.penDownPos.y = e.pageY - this.offsetTop;
//~ 
			//~ }
//~ 
			//~ //console.log("Mouse move");
			//~ 
			//~ 
		//~ }
//~ 
	//~ },
//~ 
	//~ drawLine: function(color, thickness, x1, y1, x2, y2) {
		//~ this.context.strokeStyle = color;
		//~ this.context.lineWidth   = thickness;
		//~ this.context.lineCap = 'round';
		//~ this.context.beginPath();
		//~ this.context.moveTo(x1, y1)
		//~ this.context.lineTo(x2, y2);
		//~ this.context.stroke();
	//~ },
//~ 
	//~ 
	//~ broadcastPath: function() {
		//~ var self = BlackBoard;
		//~ 
//~ 
		//~ if (self.bufferedPath.length == 0) {
			//~ console.log("no hay nada que enviar");
			//~ if (!self.isPenDown) {
				//~ 
				//~ clearInterval(self.broadcastPathIntervalID);
			//~ }
			//~ return;
		//~ }
//~ 
		//~ /* ENVIO DEL MENSAJE */						
		//~ self.sendBuffer();
//~ 
		//~ self.bufferedPath = [];
		//~ if (!self.isPenDown) {
			//~ clearInterval(self.broadcastPathIntervalID);
		//~ }
	//~ },
	//~ 
	//~ sendBuffer: function() {
		//~ 
		//~ var self = BlackBoard;
		//~ console.log(self.bufferedPath)
		//~ sendMessage("http://localhost:8080/gamebroadcast/draw", self.bufferedPath);
//~ 
	//~ },
	//~ 
	//~ drawFromCoord: function(m) {
		//~ var self = BlackBoard;
		//~ //console.log(m.coord);
		//~ var path = m.coord.split(",");
//~ 
		//~ // For each point, push a "lineTo" command onto the drawing-command stack 
		//~ // for the sender
		//~ for (var i = 0; i < path.length; i+=4)
		//~ {							
			//~ posOri = {x:parseInt(path[i]), y:parseInt(path[i+1])};
			//~ position = {x:parseInt(path[i+2]), y:parseInt(path[i+3])};
		//~ 
			//~ var point = {posOrigen: posOri, posFinal: position};						
			//~ self.moves.push(point);						
//~ 
			//~ setTimeout(self.drawTest,(i/2)*10);
			//~ 
//~ 
		//~ }
		//~ console.log(self.moves);
		//~ 
	//~ },
//~ 
	//~ drawTest: function() {
		//~ var self = BlackBoard;
		//~ var datos = self.moves.shift()
//~ 
		//~ self.context.strokeStyle = self.penColor;
		//~ self.context.lineWidth   = self.penThickness;
		//~ self.context.lineCap = 'round';
		//~ self.context.beginPath();
		//~ self.context.moveTo(datos.posOrigen.x, datos.posOrigen.y)
		//~ self.context.lineTo(datos.posFinal.x, datos.posFinal.y);
		//~ self.context.stroke();
	//~ }
//~ };
