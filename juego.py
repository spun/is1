import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import UserDB

class GamePage(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		
		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
			
		path = os.path.join(os.path.dirname(__file__), 'juego.html')
		self.response.out.write(template.render(path, template_values))



#~ class GameBroadcast(webapp.RequestHandler):
  #~ """This page is responsible for showing the game UI. It may also
  #~ create a new game or add the currently-logged in uesr to a game."""
#~ 
	#~ def get(self):
#~ 
		#~ self.sess = session.Session('enginesession')
		#~ if self.sess.load():
			#~ user = UserDB().getUserByKey(self.sess.user)
			#~ template_values['user'] = user
#~ 
		#~ if not user:
			#~ self.redirect('/')
			#~ return
#~ 
		#~ game_key = self.request.get('gamekey')
		#~ game = None
		#~ game = Game.get_by_key_name(game_key)
		#~ if not game.userO and game.userX != user:
        #~ # If this game has no 'O' player, then make the current user
        #~ # the 'O' player.
        #~ game.userO = user
        #~ game.put()
#~ 
    #~ token = channel.create_channel(user.user_id() + game_key)
    #~ template_values = {'token': token,
                       #~ 'me': user.user_id(),
                       #~ 'game_key': game_key
                       #~ }














app = webapp2.WSGIApplication([('/juego', GamePage)],
                              debug=True)
