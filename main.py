import os
import webapp2

from google.appengine.ext.webapp import template

from BD.clases import UserDB
	
	
class MainPage(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'index.html')
		self.response.out.write(template.render(path, template_values))
		
class BDtesting(webapp2.RequestHandler):
	def get(self):
		user = UserDB();
		
		# user.AddUser("neo", "gato", "neo@gato.com")
		
		r = user.getUserByNick(self.request.get('nick')) # /?nick=
		if (r):
			self.response.out.write(r[0].nick + "<br>");
			self.response.out.write(r[0].password + "<br>");
			self.response.out.write(r[0].email + "<br>");
		else:
			self.response.out.write("No se encontraron usuarios con ese nick");
			


app = webapp2.WSGIApplication([('/', MainPage),
								('/bdtesting', BDtesting)],
                              debug=True)
