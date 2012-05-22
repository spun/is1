import os
import webapp2
import cgi
from google.appengine.ext.webapp import template

from BD.clases import UserDB
from BD.clases import PalabrasDB
import session

class Administracion(webapp2.RequestHandler):
	def get(self):
		template_values = {}

		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			if not user.nick == "admin":
				self.redirect('/')
			template_values['user'] = user		
			path = os.path.join(os.path.dirname(__file__), 'administracion.html')
			self.response.out.write(template.render(path, template_values))
		else:
			self.redirect('/')
	def post(self):
		template_values = {}
		
		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
		
		# Recogemos la palabra y el tema
		palabra = self.request.get('palabra')
		tema = self.request.get('tema')

		if not palabra and not tema:
			template_values['errorMsg'] = {
				"title": "Ocurrió un error al insertar la palabra.",
				"text": "Ambos campos no puden estar vacíos."
			}					
		else:
			PalabrasDB().AddPalabra(palabra, tema)
			template_values['successMsg'] = {
				"title": "Palabra añadida.",
				"text": "La palabra se ha añadido correctamente."
			}

		path = os.path.join(os.path.dirname(__file__), 'administracion.html')
		self.response.out.write(template.render(path, template_values))

			
		
			
		
app = webapp2.WSGIApplication([('/administracion', Administracion)],
                              debug=True)		
