channel = new goog.appengine.Channel('{{ token }}');
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

