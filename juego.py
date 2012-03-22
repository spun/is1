import os
import webapp2
import json
import cgi

from google.appengine.ext.webapp import template
from google.appengine.api import channel

import session
from BD.clases import UserDB
from BD.clases import Game
from BD.clases import UsersInGame
from BD.clases import UsersInGameDB
from BD.clases import Palabras


class GamePage(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		user = None
		game = None
		
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
			
		#path = os.path.join(os.path.dirname(__file__), 'juego.html')
		#self.response.out.write(template.render(path, template_values))

		game_key = self.request.get('gamekey')

		# Si hay usuario identificado
		if user:
			# Si tenemos una gamekey
			if game_key:
				game = Game.get(game_key)

			# Si existe un juego con esa gamekey
			if game:				
				users_by_game = UsersInGame.all()
				users_by_game.filter("game =", game)
				usersPlaying = users_by_game.fetch(30)
				
				users_by_game.filter("user =", user)				
				results = users_by_game.get()

				# Si el usuario identificado esta asignado al juego
				if results:
					token = channel.create_channel(str(results.key()))
					template_values = {'token': token,
						'user': user,
						'game_key': game_key,
						'users_playing': usersPlaying
					}

					path = os.path.join(os.path.dirname(__file__), 'juego.html')
					self.response.out.write(template.render(path, template_values))
					
				else:
					self.response.out.write("El usuario no esta asignado a este juego")

				

			else:
				self.response.out.write("No hay una id de juego asignada")
				
			
				
				
				#~ template_values = {'token': token,
									#~ 'me': user.key(),
									#~ 'game_key': game_key,
									#~ 'game_link': game_link,
									#~ 'initial_message': GameUpdater(game).get_game_message()
								#~ }
								
			#~ path = os.path.join(os.path.dirname(__file__), 'juego.html')
			#~ self.response.out.write(template.render(path, template_values))
			#~ else:
				#~ self.response.out.write('No such game')		
#~ 
					#~ 
		else:
			self.redirect('/login')
			#~ return





class GameBroadcastChat(webapp2.RequestHandler):
	"""This page is responsible for showing the game UI. It may also
	create a new game or add the currently-logged in uesr to a game."""
	
	def post(self):
		game_key = self.request.get('g')
		if game_key:
			game = Game.get(game_key)
			
			if game:				
				user = None
				self.sess = session.Session('enginesession')
				if self.sess.load():
					user = UserDB().getUserByKey(self.sess.user)
				
				users_by_game = UsersInGame.all()
				users_by_game.filter("game =", game)

				results = users_by_game.fetch(30)
				
				messageRaw = None
				if game.palabra.palabra == cgi.escape(self.request.get('d')): 
					if user.key() != game.dibujante.key():
						ptos = UsersInGameDB().scoreUp(user)
						messageRaw = {
						"type": "winner", 
						"content": {
							"user": user.nick,
							"word": game.palabra.palabra,
							"ptos": ptos
							}
						}
					else:
						messageRaw = {
						"type": "chat", 
						"content": {
							"messaje": "#########",
							"user": user.nick							
							}
						}						
				else:
					messageRaw = {
					"type": "chat", 
					"content": {
						"messaje": cgi.escape(self.request.get('d')),
						"user": user.nick							
						}
					}				
				message = json.dumps(messageRaw)
				
				for r in results:		
					channel.send_message(str(r.key()), message)



class GameBroadcastDraw(webapp2.RequestHandler):
	"""This page is responsible for showing the game UI. It may also
	create a new game or add the currently-logged in uesr to a game."""
	
	def post(self):
		game_key = self.request.get('g')
		if game_key:
			game = Game.get(game_key)
			
			if game:				
				user = None
				self.sess = session.Session('enginesession')
				if self.sess.load():
					user = UserDB().getUserByKey(self.sess.user)
				
				users_by_game = UsersInGame.all()
				users_by_game.filter("game =", game)
				users_by_game.filter("user !=", user.key())

				results = users_by_game.fetch(30)

				messageRaw = {
				"type": "draw", 
				"content": {
					"coord": cgi.escape(self.request.get('d'))						
					}
				}				
				message = json.dumps(messageRaw)
				
				for r in results:		
					channel.send_message(str(r.key()), message)


class GameBroadcastLoad(webapp2.RequestHandler):
	"""This page is responsible for showing the game UI. It may also
	create a new game or add the currently-logged in uesr to a game."""
	
	def post(self):
		
		game_key = self.request.get('g')
		if game_key:
			game = Game.get(game_key)
			
			if game:				
				user = None
				self.sess = session.Session('enginesession')
				if self.sess.load():
					user = UserDB().getUserByKey(self.sess.user)
					
				if user.key() != game.dibujante.key():
					messageRaw = {
					"type": "infoGame", 
					"content": {
						"drawing": False,
						"word": len(game.palabra.palabra),
						"painter": str(game.dibujante.key())
						}
					}		
				else:
					messageRaw = {
					"type": "infoGame", 
					"content": {
						"drawing": True,
						"word": game.palabra.palabra,
						"painter": str(game.dibujante.key())
						}
					}	
		
				users_by_game = UsersInGame.all()
				users_by_game.filter("user =", user.key())
				result = users_by_game.get()
		
				message = json.dumps(messageRaw)
				
				channel.send_message(str(result.key()), message)
		

app = webapp2.WSGIApplication([('/juego', GamePage),
								('/gamebroadcast/chat', GameBroadcastChat),
								('/gamebroadcast/draw', GameBroadcastDraw),
								('/gamebroadcast/load', GameBroadcastLoad)],
                              debug=True)
