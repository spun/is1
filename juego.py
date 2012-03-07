import os
import webapp2

from google.appengine.ext.webapp import template

class GamePage(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'juego.html')
		self.response.out.write(template.render(path, template_values))



app = webapp2.WSGIApplication([('/juego', GamePage)],
                              debug=True)
