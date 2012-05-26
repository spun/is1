import os
import webapp2

from google.appengine.ext.webapp import template
from google.appengine.api import channel
from BD.clases import UserDB
import session

class Ayuda(webapp2.RequestHandler):
    def get(self):
		template_values = {}

		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user

		path = os.path.join(os.path.dirname(__file__), 'ayuda.html')
		self.response.out.write(template.render(path, template_values))

app = webapp2.WSGIApplication([('/ayuda', Ayuda)], debug=True)
