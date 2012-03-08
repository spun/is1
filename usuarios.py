# -*- coding: utf-8 -*-

import os
import webapp2
import cgi

from google.appengine.ext.webapp import template

from BD.clases import UserDB
import session

class Registro(webapp2.RequestHandler):
	def get(self):
			template_values = {}
			
			# Extraemos el usuario de la sesion 
			self.sess = session.Session('enginesession')
			if self.sess.load():
				user = UserDB().getUserByKey(self.sess.user)
				template_values['user'] = user
			
			path = os.path.join(os.path.dirname(__file__), 'registro.html')
			self.response.out.write(template.render(path, template_values))
			
	def post(self):
		self.response.out.write("Aqui recibo el formulario de registro")
		self.response.out.write("<br/>Usuario: " + cgi.escape(self.request.get('user')))
		self.response.out.write("<br/>Pass: " + cgi.escape(self.request.get('contra')))
		self.response.out.write("<br/>Pass2: " + cgi.escape(self.request.get('contra2')))
		self.response.out.write("<br/>Mail: " + cgi.escape(self.request.get('mail')))
				
		userCtrl = UserDB()
		user = userCtrl.getUserByNick(cgi.escape(self.request.get('user')))
		
		if(self.request.get('user') == ""):
			self.response.out.write("<br/>* Error:* El campo usuario no puede estar vacio")
		else:	
			if(user):
				self.response.out.write("<br/>* Error:* El usuario "+ cgi.escape(self.request.get('user')+" ya existe"))
			else:
				contra = self.request.get('contra')
				contra2 = self.request.get('contra2')
				if(contra == "" or contra2 == ""):
					self.response.out.write("<br/>* Los password no pueden estar vacios")
				else:
					if(contra != contra2):
						self.response.out.write("<br/>* Los passwords no coinciden")
					else:
						mail = self.request.get('mail')
						if(mail == ""):
							self.response.out.write("<br/>* Error:* El campo mail no puede estar vacio")
						else:
							mail = userCtrl.getUserByMail(cgi.escape(self.request.get('mail')))
							
							if(mail):
								self.response.out.write("<br/>* Error:* La direccion de correo ya esta siendo utilizada por otro usuario")
							else:
								userCtrl.AddUser(cgi.escape(self.request.get('user')), cgi.escape(self.request.get('contra')), cgi.escape(self.request.get('mail')))
								self.response.out.write("<br/>Registro completado")
			
class Login(webapp2.RequestHandler):
	def get(self):
			template_values = {}
			
			# Extraemos el usuario de la sesion 
			self.sess = session.Session('enginesession')
			if self.sess.load():
				user = UserDB().getUserByKey(self.sess.user)
				template_values['user'] = user
			
			path = os.path.join(os.path.dirname(__file__), 'login.html')
			self.response.out.write(template.render(path, template_values))
		
	def post(self):
	
		template_values = {}
		self.sess = session.Session('enginesession')

		userCtrl = UserDB()
		users = userCtrl.getUsersQuery(self.request.get('user'),self.request.get('pass'))
		
		if users.count() == 1:
			expires = 7200			
			if self.sess.load():
				self.sess.store('', 0)
			self.sess.store(str(users.get().key()), expires)
			# self.redirect('/')
			path = os.path.join(os.path.dirname(__file__), 'index.html')
			self.response.out.write(template.render(path, template_values))
			
		else:
			self.response.out.write("no existe el usuario")		
		
class Logout(webapp2.RequestHandler):
	def get(self):
		self.sess = session.Session('enginesession')
		if self.sess.load():
			self.sess.store('', 0)
		self.redirect('/')
		
class IsOnline(webapp2.RequestHandler):
	def get(self):
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			self.response.out.write("Nombre de usuario: " + user.nick)
			self.response.out.write("<br/> E-mail: " + user.email)
			
		else:
			self.response.out.write("No login")

app = webapp2.WSGIApplication([('/registro', Registro),
								('/login', Login),
								('/logout', Logout),
								('/isonline', IsOnline)],
                              debug=True)			
