import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import SalasDB
from BD.clases import UserDB
from BD.clases import GameDB
from BD.clases import UsersInGameDB

class Salas(webapp2.RequestHandler):
	def get(self):
		miPag = self.request.get('p', default_value='0')
		if miPag == '0':
			self.redirect("/salas?p=1")	
		else:
			template_values = {}
			# Extraemos el usuario de la sesion 
			self.sess = session.Session('enginesession')
			if self.sess.load():
				user = UserDB().getUserByKey(self.sess.user)
				if user:
					template_values['user'] = user
					#Si el usuario ya estaba en una sala lo redirigimos a ella
					if user.idSala!=None:
						self.redirect("/salajuego?id="+str(user.idSala))
					
			salas=SalasDB()		
			res=salas.ListarSalas()
			
			#Listamos las salas que hay por acada pagina
			i=0
			res2 =[]
			for sala in res:
				if i>=(int(self.request.get('p'))-1)*12 and i<(int(self.request.get('p')))*12:
					res2.append(sala)
				i+=1
				
			template_values['salas_list'] = res2
			
			#Extraemos el numero de paginas que tiene el listado de salas
			numPags=0
			if SalasDB().getNumSalas()/12==0:
				numPags=1
			else:
				numPags=(SalasDB().getNumSalas()/12)+1
			
			template_values['numSalas']=SalasDB().getNumSalas()
			template_values['pags']= numPags
			template_values['pag']=self.request.get('p')
			template_values['nextPage']=int(self.request.get('p'))+1
			template_values['prevPage']=int(self.request.get('p'))-1
			path = os.path.join(os.path.dirname(__file__), 'salas.html')
			self.response.out.write(template.render(path, template_values))
		
	def post(self):
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			if self.request.get('nombre'): #!="" and SalasDB().getSalaByAutor(user.nick)=="":
				#Creamos una nueva sala	
				salas=SalasDB()			
				nombre=self.request.get('nombre')
				autor=user.nick
				salas.AddSala(nombre, autor)
				#Insertamos al usuario que creo la sala en esta
				miSala=SalasDB().getSalaByAutor(user.nick)
				user.idSala=miSala[0].idSala
				user.put()
				#Creamos el juego
				game = GameDB()
				miJuego = game.AddGame(user.idSala)
				#Metemos al usuario en el juego
				userGame = UsersInGameDB()
				userGame.AddUserInGame(user, miJuego)
				#Redireccionamos al usuario
				self.redirect("/salas?p=1")
			else:
				self.redirect("/salas?p=1")
		else:
			self.redirect("/salas?p=1")
	

app = webapp2.WSGIApplication([('/salas', Salas)],
                              debug=True)
