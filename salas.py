import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import SalasDB
from BD.clases import UserDB

class Salas(webapp2.RequestHandler):
	def get(self):
		salas=SalasDB()		
		res=salas.ListarSalas()
		
		template_values = {'salas_list':res}
		
		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
		
		path = os.path.join(os.path.dirname(__file__), 'salas.html')
		self.response.out.write(template.render(path, template_values))
		
	def post(self):
		if self.request.get('nombre') !="":
			salas=SalasDB()
			autor=self.request.get('nombre')
			salas.AddSala(autor)
			self.redirect("/salas")
		else:
			self.redirect("/salas")
	

app = webapp2.WSGIApplication([('/salas', Salas)],
                              debug=True)
