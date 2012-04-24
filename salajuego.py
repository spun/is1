import os
import webapp2

from google.appengine.ext.webapp import template
from google.appengine.api import channel

import session
from BD.clases import SalasDB
from BD.clases import UserDB
from BD.clases import UsersInGameDB
from BD.clases import GameDB
from BD.clases import UsersInGame
from BD.clases import Game
from BD.clases import Sala
from BD.clases import User

class SalaJuego(webapp2.RequestHandler):
	def get(self):
		self.sess = session.Session('enginesession')
		if self.sess.load():
			template_values = {}
			users=UserDB()
			user = users.getUserByKey(self.sess.user)
			template_values['user'] = user
			
			#Si el usuario le da al boton de salir, eliminamos su asociacion con la sala
			if self.request.get('e', default_value='0')!='0':
				user2 = UserDB().getUserByNick(user.nick)
				UsersInGameDB().deleteUserInGame(user2)
				numUsers = UserDB().getUsersBySala(user.idSala)
				res = numUsers.count()
				#Si no queda nadie en la sala la eliminamos ademas del juego
				if res == 1:
					SalasDB().deleteSala(user.idSala)
					GameDB().deleteGame(user.idSala)
				#Asignamos none a la sala del usuario
				user.idSala="None"
				user.put()
				#Redirigimos al inicio
				self.redirect('/')
			
			
			#Comprobamos si la sala existe
			sala = SalasDB().getSalaById(self.request.get('id'))
			if sala:
				#Si el usuario aun no esta asociado a las sala lo asociamos
				if user and user.idSala=="None" and UsersInGameDB().UserExist(user)==False:
					user.idSala=self.request.get('id')
					user.put()
					idSala = self.request.get('id')
					game = GameDB().getGameBySala(idSala)
					inGame = UsersInGameDB()
					inGame.AddUserInGame(user, game)
				
				#Obtenemos el id del juego asociado a la sala
				game = GameDB().getGameBySala(self.request.get('id'))
				template_values['gamekey']=game.key()
				#Listamos los usuarios en la sala
				user_list=users.getUsersBySala(self.request.get('id'))
				template_values['user_list']=user_list



				# Si el usuario identificado esta asignado al juego
				token = channel.create_channel(str(user.key()))
				
				
	
			else:
				self.redirect('/')




			path = os.path.join(os.path.dirname(__file__), 'salajuego.html')
			self.response.out.write(template.render(path, template_values))
		else:
			self.redirect("/salas?p=1")



app = webapp2.WSGIApplication([('/salajuego', SalaJuego)],
                              debug=True)
