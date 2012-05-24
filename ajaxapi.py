import os
import webapp2
import json
import cgi

from google.appengine.ext.webapp import template
from google.appengine.api import channel

import session
from BD.clases import UserDB
from BD.clases import Game
from BD.clases import GameDB
from BD.clases import UsersInGame
from BD.clases import UsersInGameDB
from BD.clases import Sala
from BD.clases import SalasDB
from BD.clases import Palabras
from BD.clases import Logros
from BD.clases import LogrosConseguidos
from BD.clases import LogrosConseguidosDB

class EarnedAchievements(webapp2.RequestHandler):
	def get(self):
		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
				
			lController = LogrosConseguidos.all()
			lController.filter("usuario =", user)
			lController.filter("mostrado =", False)
			res = lController.fetch(100)
			
			
			arrayLogros = []
			for r in res:
				datosLogros = {'name': r.logro.nombre, 'desc': r.logro.descripcion, 'image': r.logro.imagen};
				arrayLogros.append(datosLogros)
				r.mostrado = True
				r.put()
				
			message = json.dumps(arrayLogros)
			self.response.out.write(message)
			

class KonamiAchievement(webapp2.RequestHandler):
	def get(self):
		
		# Extraemos el usuario de la sesion 
		self.sess = session.Session('enginesession')
		if self.sess.load():
			user = UserDB().getUserByKey(self.sess.user)
			
			l = LogrosConseguidosDB()
			l.NuevoLogroConseguido('ag9kZXZ-aXMxMnByb2plY3RyDAsSBkxvZ3JvcxgODA', user)
			
			
class NoReadMessages(webapp2.RequestHandler):
	def get(self):
		self.response.out.write("0")
			

app = webapp2.WSGIApplication([('/ajaxapi/earned_achievements', EarnedAchievements),
								('/ajaxapi/konami_achievement', KonamiAchievement),
								('/ajaxapi/noread_messages', NoReadMessages)],
                              debug=True)
