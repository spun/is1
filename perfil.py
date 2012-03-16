import os
import webapp2
import cgi

from google.appengine.ext.webapp import template
import session
from BD.clases import UserDB

class Perfil(webapp2.RequestHandler):
	def get(self):
		template_values = {}		
		user = None
		userProfile = None
		
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
			userProfile = user
			
		if self.request.get('user'):
			userProfile = UserDB().getUserByNick(cgi.escape(self.request.get('user')))
				
		if userProfile:
			template_values['userProfile'] = userProfile
			path = os.path.join(os.path.dirname(__file__), 'perfil.html')
			self.response.out.write(template.render(path, template_values))
		else:
			self.redirect('/')

app = webapp2.WSGIApplication([('/perfil', Perfil)],
                              debug=True)		
