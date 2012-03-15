import os
import webapp2
import cgi
from google.appengine.ext.webapp import template

from BD.clases import PalabrasDB

class Administracion(webapp2.RequestHandler):
	def get(self):
			palabra = PalabrasDB()
			template_values = {}
			path = os.path.join(os.path.dirname(__file__), 'administracion.html')
			self.response.out.write(template.render(path, template_values))

	def post(self):
		palabra = self.request.get('palabra')
		tema = self.request.get('tema')
		template_values = {}
		if not palabra and not tema:
			template_values['error'] = "Error, ambos campos no puden estar vacíos"
			path = os.path.join(os.path.dirname(__file__), 'administracion.html')
			self.response.out.write(template.render(path, template_values))			
		else:
			PalabrasDB().AddPalabra(palabra, tema)
			self.redirect('/administracion')
			
		
app = webapp2.WSGIApplication([('/administracion', Administracion)],
                              debug=True)		