import os
import webapp2
import cgi

from google.appengine.ext.webapp import template
import session
from BD.clases import UserDB
from BD.clases import PartidasJugadasDB
from BD.clases import AmigosDB

class Perfil(webapp2.RequestHandler):
	def get(self):
		template_values = {}		
		user = None
		userProfile = None
		listaPartidas = None
		listaAmigos = None
		listaPeticiones = None
		isAmigo = False;
		
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
			userProfile = user
			listaAmigos = AmigosDB().ObtenerAmigos(userProfile)
			listaPeticiones = AmigosDB().ObtenerPeticiones(userProfile)
			if self.request.get('user'):
				if self.request.get('amistad'):
					amigoObjetivo = UserDB().getUserByNick(cgi.escape(self.request.get('user')))
					AmigosDB().PedirAmistad(amigoObjetivo, userProfile)
					self.redirect('/perfil')
				if self.request.get('aceptar'):
					amigo = UserDB().getUserByNick(cgi.escape(self.request.get('aceptar')))
					AmigosDB().AceptarAmistad(user, amigo)
					self.redirect('/perfil')
				if self.request.get('denegar'):
					amigo = UserDB().getUserByNick(cgi.escape(self.request.get('denegar')))
					AmigosDB().DenegarAmistad(user, amigo)
					self.redirect('/perfil')
				if self.request.get('eliminar'):
					amigo = UserDB().getUserByNick(cgi.escape(self.request.get('eliminar')))
					AmigosDB().EliminarAmistad(user, amigo)
					self.redirect('/perfil')
		
		if self.request.get('user'):
			userProfile = UserDB().getUserByNick(cgi.escape(self.request.get('user')))
			if self.sess.load():
				isAmigo = AmigosDB().isAmigo(user, self.request.get('user'))
		
		listaPartidas = PartidasJugadasDB().ObtenerLista(userProfile)	
		if userProfile:
			template_values['userSession'] = user
			template_values['userProfile'] = userProfile
			template_values['listaPartidas'] = listaPartidas
			template_values['listaAmigos'] = listaAmigos
			template_values['listaPeticiones'] = listaPeticiones
			template_values['isAmigo'] = isAmigo
			path = os.path.join(os.path.dirname(__file__), 'perfil.html')
			self.response.out.write(template.render(path, template_values))
		else:
			self.redirect('/')

app = webapp2.WSGIApplication([('/perfil', Perfil)],
                              debug=True)		
