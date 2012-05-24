import os
import webapp2
import cgi
from google.appengine.ext.webapp import template

from BD.clases import UserDB
from BD.clases import PalabrasDB
from BD.clases import NoticiasDB
import session

class Administracion(webapp2.RequestHandler):
	def get(self):
		template_values = {}

		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			if not user.nick == "Admin":
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

		# Recogemos el titular y el cuerpo de la noticia
		titular = self.request.get('titular')
		cuerpo = self.request.get('cuerpo')
		
	
		if not palabra and not tema: #Comprobar que no se ha insertado ninguna noticia
			if not titular and not cuerpo:
				template_values['errorMsg'] = {
					"title": "Ocurrió un error al insertar la palabra y/o noticia.",
					"text": "Se debe introducir o una noticia o una palabra, rellenando todos sus campos."
				}
			else:
				NoticiasDB().AddNoticia(titular, cuerpo)
				template_values['successMsg'] = {
					"title": "Noticia añadida.",
					"text": "La noticia se ha añadido correctamente."
				}
		else:
			if not titular and not cuerpo: #Sólo se inserta la palabra
				PalabrasDB().AddPalabra(palabra, tema)
				template_values['successMsg'] = {
					"title": "Palabra añadida.",
					"text": "La palabra se ha añadido correctamente."
				}
			else: #Se insertan ambos	
				PalabrasDB().AddPalabra(palabra, tema)
				NoticiasDB().AddNoticia(titular, cuerpo)
				template_values['successMsg'] = {
					"title": "Palabra y noticia añadidas.",
					"text": "La palabra y la noticia se han añadido correctamente."
				}

		path = os.path.join(os.path.dirname(__file__), 'administracion.html')
		self.response.out.write(template.render(path, template_values))

			
		
			
		
app = webapp2.WSGIApplication([('/administracion', Administracion)],
                              debug=True)		
