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
		salas=SalasDB()
		autor=self.request.get('autor')
		salas.AddSala(autor)

app = webapp2.WSGIApplication([('/salas', Salas)],
                              debug=True)