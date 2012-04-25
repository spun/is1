# -*- coding: utf-8 -*-

import os
import webapp2
import cgi

from google.appengine.ext.webapp import template

from BD.clases import UserDB
from BD.clases import SalasDB
from BD.clases import UsersInGameDB
from BD.clases import GameDB
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
				
		userCtrl = UserDB()
		user = userCtrl.getUserByNick(cgi.escape(self.request.get('user')))
		
		error = False;
		errorMsg = "";
		if(self.request.get('user') == ""):
			error = True
			errorMsg += "El campo usuario no puede estar vacio."
		else:			
			if(user):
				error = True
				errorMsg += "El nombre de usuario ya existe."
			else:
				contra = self.request.get('contra')
				contra2 = self.request.get('contra2')
				if(contra == "" or contra2 == ""):
					error = True
					errorMsg += "Los campos de contraseña no pueden estar vacios."
				else:
					if(contra != contra2):
						error = True
						errorMsg += "Los campos de contraseña no son iguales."
					else:
						mail = self.request.get('mail')
						if(mail == ""):
							error = True
							errorMsg += "El campo de email no puede estar vacio."
						else:
							mail = userCtrl.getUserByMail(cgi.escape(self.request.get('mail')))
							
							if(mail):		
								error = True
								errorMsg += "La direccion de correo ya esta siendo utilizada por otro usuario."
		
		if error == True:			
			template_values = {}
		
			# Extraemos el usuario de la sesion 
			self.sess = session.Session('enginesession')
			if self.sess.load():
				user = UserDB().getUserByKey(self.sess.user)
				template_values['user'] = user
			
			template_values['errorMsg'] = {
				"title": "Ocurrió un error al completar el registro.",
				"text": errorMsg
			}
			
			path = os.path.join(os.path.dirname(__file__), 'registro.html')
			self.response.out.write(template.render(path, template_values))

		else:				
			userCtrl.AddUser(cgi.escape(self.request.get('user')), cgi.escape(self.request.get('contra')), cgi.escape(self.request.get('mail')))									
			self.redirect('/?a=0')							
								
			
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
			self.redirect('/')
		else:
			# Extraemos el usuario de la sesion 
			if self.sess.load():
				user = UserDB().getUserByKey(self.sess.user)
				template_values['user'] = user
			
			template_values['errorMsg'] = {
				"title": "Ocurrió un error al intenficar al usuario.",
				"text": "No existe el usuario o la contraseña no es correcta."
			}

			path = os.path.join(os.path.dirname(__file__), 'login.html')
			self.response.out.write(template.render(path, template_values))

		
class Logout(webapp2.RequestHandler):
	def get(self):
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			if user.idSala!="None":
				numUsers = UserDB().getUsersBySala(user.idSala)
				res = numUsers.count()
				#Si no queda nadie en la sala la eliminamos
				if res == 1:
					SalasDB().deleteSala(user.idSala)
					GameDB().deleteGame(user.idSala)
				user2 = UserDB().getUserByNick(user.nick)
				UsersInGameDB().deleteUserInGame(user2)
				user.idSala="None"
				user.put()
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
