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
			text: m.user+": "							
		}).prependTo(li);
		
		self.config.history.find("ul").prop({ scrollTop:self.config.history.find("ul").prop("scrollHeight") });
	},
	
	reportWinner: function(m) {
		var self = ChatZone;
		var li = $("<li></li>", {
			text: " ha acertado la palabra. \nLa palabra era "+m.word+"."
			
		}).appendTo(self.config.history.find("ul"));
		
		$("<span></span>", {
			text: "## "+m.user							
		}).prependTo(li);
		self.config.history.find("ul").prop({ scrollTop:self.config.history.find("ul").prop("scrollHeight") });
		console.log(m);
		$("li#"+m.userKey+" .userScore").text(m.ptosUser);
		$("li#"+m.userDibKey+" .userScore").text(m.ptosDib);
		self.config.sender(self.config.urlLoad , m.user);
	}
};

