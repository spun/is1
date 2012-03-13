import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import SalasDB
from BD.clases import UserDB
from BD.clases import UsersInGameDB
from BD.clases import GameDB

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
				numUsers = UserDB().getUsersBySala(user.idSala)
				res = numUsers.count()
				#Si no queda nadie en la sala la eliminamos
				if res == 1:
					SalasDB().deleteSala(user.idSala)
				user.idSala=None
				user.put()
				self.redirect('/')
			
			if user and user.idSala==None and not UsersInGameDB().UserExist(user):
				user.idSala=self.request.get('id')
				user.put()
				idSala = self.request.get('id')
				game = GameDB().getGameBySala(idSala)
				inGame = UsersInGameDB()
				inGame.AddUserInGame(user, game)

			#Listamos los usuarios en la sala
			user_list=users.getUsersBySala(self.request.get('id'))
			template_values['user_list']=user_list
			path = os.path.join(os.path.dirname(__file__), 'salajuego.html')
			self.response.out.write(template.render(path, template_values))
		else:
			self.redirect("/salas?p=1")

app = webapp2.WSGIApplication([('/salajuego', SalaJuego)],
                              debug=True)
