var ChatZone = {
	init: function( config ) {
		this.config = config;
		this.bindEvents();
	},
	
	bindEvents: function() {
		this.config.form.on('submit', this.formSubmit);
	},
	
	formSubmit: function(e) {
		var self = ChatZone;
		e.preventDefault();

		if(self.config.form.find("input").val() != "")
		{	
			self.config.sender(self.config.urlChat , self.config.form.find("input").val());
			self.config.form.find("input").val("")
		}
	},
	
	receiveMessage: function(m) {
		var self = ChatZone;
		var li = $("<li></li>", {
			text: m.messaje
			
		}).appendTo(self.config.history.find("ul"));
		
		$("<span></span>", {
			class: "userMsj",
			text: m.user+": "							
		}).prependTo(li);
		
		self.config.history.find("ul").prop({ scrollTop:self.config.history.find("ul").prop("scrollHeight") });
	},
	
	reportWinner: function(m) {
		var self = ChatZone;
		var li = $("<li></li>", {
			class: "report",
			html: " ha acertado la palabra. <br/>La palabra era:<br/> <p class='repWord'>"+m.word+"</p>"
			
		}).appendTo(self.config.history.find("ul"));
		
		$("<span></span>", {
			class:  'repUser',
			text: m.user							
		}).prependTo(li);
		self.config.history.find("ul").prop({ scrollTop:self.config.history.find("ul").prop("scrollHeight") });
		$("span#"+m.userKey).text(m.ptosUser);
		$("span#"+m.userDibKey).text(m.ptosDib);
		
		self.config.sender(self.config.urlLoad , m.user);
	},
	
	reportTimeEnd: function(m) {
		var self = ChatZone;
		var li = $("<li></li>", {
			class: "report",
			html: "Nadie ha acertado la palabra. <br/>La palabra era:<br/> <p class='repWord'>"+m.word+"</p>"
			
		}).appendTo(self.config.history.find("ul"));

		self.config.history.find("ul").prop({ scrollTop:self.config.history.find("ul").prop("scrollHeight") });
		self.config.sender(self.config.urlLoad , m.user);
	}
};

