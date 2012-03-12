import os
import webapp2

from google.appengine.ext.webapp import template
from google.appengine.api import channel

import session
from BD.clases import UserDB
from BD.clases import Juego

class GamePage(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		user = None
		game = None
		
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
			
		path = os.path.join(os.path.dirname(__file__), 'juego.html')
		self.response.out.write(template.render(path, template_values))
			
		#~ game_key = self.request.get('gamekey')
#~ 
		#~ if user:
			#~ if game_key:
				#~ game = Juego.get_by_key_name(game_key)
				#~ 
			#~ else:
				#~ game_key = str(user.key())
				#~ game = Juego()
				#~ game.put()
												#~ 
						#~ 
			#~ if game:
				#~ tokId = str(game.key())+str(user.key())
				#~ self.response.out.write(tokId)	
				#~ token = channel.create_channel(tokId)
				
				
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
		#~ else:
			#~ self.redirect('/login')
			#~ return




class GameBroadcast(webapp2.RequestHandler):
	"""This page is responsible for showing the game UI. It may also
	create a new game or add the currently-logged in uesr to a game."""

	def get(self):
		self.response.out.write('here')
		#~ user = None
		#~ 
		#~ self.sess = session.Session('enginesession')
		#~ 
		#~ if self.sess.load():
			#~ user = UserDB().getUserByKey(self.sess.user)
			#~ template_values['user'] = user
#~ 
		#~ if not user:
			#~ self.redirect('/')
			#~ return

		#~ game_key = self.request.get('gamekey')
		#~ game = None
		#~ game = Game.get_by_key_name(game_key)
		#~ if not game.userO and game.userX != user:
        #~ # If this game has no 'O' player, then make the current user
        #~ # the 'O' player.
        #~ game.userO = user
        #~ game.put()

    #~ token = channel.create_channel(user.user_id() + game_key)
    #~ template_values = {'token': token,
                       #~ 'me': user.user_id(),
                       #~ 'game_key': game_key
                       #~ }














app = webapp2.WSGIApplication([('/juego', GamePage),
								('/gamebroadcast', GameBroadcast)],
                              debug=True)
