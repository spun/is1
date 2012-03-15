import os
import webapp2
import cgi

from google.appengine.ext.webapp import template

from BD.clases import UserDB

class Perfil(webapp2.RequestHandler):
	def get(self):
		if self.request.get('user'):
			user = UserDB().getUserByNick(cgi.escape(self.request.get('user')))
			template_values = {}
			template_values['user'] = user
			path = os.path.join(os.path.dirname(__file__), 'perfil.html')
			self.response.out.write(template.render(path, template_values))
		else:
			self.redirect('/')

app = webapp2.WSGIApplication([('/perfil', Perfil)],
                              debug=True)		
