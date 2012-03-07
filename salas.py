import os
import webapp2

from google.appengine.ext.webapp import template
from BD.clases import SalasDB

class Salas(webapp2.RequestHandler):
	def get(self):
		salas=SalasDB()
		
		res=salas.ListarSalas()
		template_values = {'salas_list':res}
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