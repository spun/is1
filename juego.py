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



app = webapp2.WSGIApplication([('/juego', GamePage)],
                              debug=True)
