import os
import webapp2

from google.appengine.ext.webapp import template
		
class GamePage(webapp2.RequestHandler):
	def get(self):
		self.response.out.write("Pagina de juego");
			


app = webapp2.WSGIApplication([('/juego', GamePage)],
                              debug=True)
