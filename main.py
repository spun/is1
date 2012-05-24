# -*- coding: utf-8 -*-

import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import UserDB
from BD.clases import NoticiasDB

class MainPage(webapp2.RequestHandler):
	def get(self):
		template_values={}
		self.sess = session.Session('enginesession')
		
		listaNoticias = NoticiasDB().getNoticias()
		
		template_values['listaNoticias'] = listaNoticias
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			template_values['user'] = user
		
		if self.request.get('a')=="0":
			template_values['successMsg'] = {
				"title": "Registro completado.",
				"text": "¡Bienvenido! Ya puedes identificarte desde el formulario de login y empezar a jugar."
			}
		
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
