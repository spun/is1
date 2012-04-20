var BlackBoard = {
		
	init: function( config ) {
		this.config = config;
		this.context = this.config.board[0].getContext('2d');

		this.createCanvasRender();

		this.tool;
		this.tools = {};

		this.isPenDown = false;
		this.penDownPos = {};

		this.locked = false;
		this.moves = [];

		this.bufferedPath = [];
		this.lastBufferTime = new Date().getTime();
		this.broadcastPathIntervalID;
		
		this.initTools();
		if (!this.context)
			alert('Ocurrió un error: # No existe "context"');
		else
			this.bindEvents();
			
		this.renderContext.strokeStyle = "#09f";
		this.renderContext.lineWidth   = 3;
		this.renderContext.lineCap = 'round';
	},
	
	createCanvasRender: function() {
		
		var container = this.config.board[0].parentNode;
		this.canvasRender = document.createElement('canvas');
		if (!this.canvasRender) {
			alert('Error: I cannot create a new canvas element!');
			return;
		}

		this.canvasRender.id     = 'imageTemp';
		this.canvasRender.width  = this.config.board[0].width;
		this.canvasRender.height = this.config.board[0].height;
		container.appendChild(this.canvasRender);
		
		container.style.position = 'relative';
		this.canvasRender.style.position = 'absolute';
		this.canvasRender.style.top = '0';
		this.canvasRender.style.left = '0';
		this.canvasRender.style.borderWidth = '1px';
		this.canvasRender.style.borderColor = 'red';
		this.canvasRender.style.borderStyle = 'solid';
		this.renderContext = this.canvasRender.getContext('2d');
	},
	
	initTools: function() {
		this.tools.pencil = new Pencil(BlackBoard);
		this.tools.rectangle = new Rectangle(this);
		this.tool = this.tools.rectangle;
	},
	
	setTool: function(toolName) {
		this.tool = this.tools[toolName];
	},
	
	bindEvents: function() {
		$(this.canvasRender).on('mousedown', this.ev_canvas);
		$(this.canvasRender).on('mouseleave', this.ev_canvas);
		$(document).on('mouseup', this.ev_canvas);
		$(this.canvasRender).on('mousemove', this.ev_canvas);
	},
	
	ev_canvas: function(ev) {
		var self = BlackBoard;
		
		if (ev.layerX || ev.layerX == 0) { // Firefox
			ev._x = ev.layerX;
			ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
			ev._x = ev.offsetX;
			ev._y = ev.offsetY;
		}

		// Call the event handler of the tool.
		var func = self.tool[ev.type];
		if (func) {
			func(ev);
		}
		
	},
	
	

	setColor: function(newColor) {
		this.renderContext.strokeStyle = newColor;	
	},
	
	setThickness: function(newThickness) {
		this.renderContext.lineWidth = newThickness;
	},
	
	img_update: function() {
		this.context.drawImage(this.canvasRender, 0, 0);
		this.renderContext.clearRect(0, 0, this.canvasRender.width, this.canvasRender.height);
	}
};


function Pencil(board) {

	var tool = this;
	this.board = board;
	this.started = false;

	// This is called when you start holding down the mouse button.
	// This starts the pencil drawing.
	this.mousedown = function (ev) {
		tool.board.renderContext.beginPath();
		tool.board.renderContext.moveTo(ev._x, ev._y);
		tool.started = true;
	};

	// This function is called every time you move the mouse. Obviously, it only 
	// draws if the tool.started state is set to true (when you are holding down 
	// the mouse button).
	this.mousemove = function (ev) {
		if (tool.started) {
			

			tool.board.renderContext.lineTo(ev._x, ev._y);
			tool.board.renderContext.stroke();
		}
	};

	// This is called when you release the mouse button.
	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			tool.board.img_update();
		}
	};
};


function Rectangle(board) {
	
	var tool = this;
	this.started = false;
	this.board = board;

	this.mousedown = function (ev) {
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
	};

	this.mousemove = function (ev) {
		if (!tool.started) {
			return;
		}

		var x = Math.min(ev._x,	tool.x0),
				y = Math.min(ev._y,	tool.y0),
				w = Math.abs(ev._x - tool.x0),
				h = Math.abs(ev._y - tool.y0);

		console.log(tool.board);
		tool.board.renderContext.clearRect(0, 0, tool.board.canvasRender.width, tool.board.canvasRender.height);

		if (!w || !h) {
			return;
		}

		tool.board.renderContext.strokeRect(x, y, w, h);
	};

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			tool.board.img_update();
			
		}
	};
}










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
