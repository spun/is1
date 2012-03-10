import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import SalasDB
from BD.clases import UserDB

class SalaJuego(webapp2.RequestHandler):
	def get(self):
            self.sess = session.Session('enginesession')
	    if self.sess.load():
                template_values = {}
                users=UserDB()
                user = users.getUserByKey(self.sess.user)
                user.idSala=self.request.get('id')
                user.put()
                user_list=users.getUsersBySala(self.request.get('id'))
                template_values['user_list']=user_list
                path = os.path.join(os.path.dirname(__file__), 'salajuego.html')
                self.response.out.write(template.render(path, template_values))
            else:
                self.redirect("/salas?p=1")
		
	def post(self):
		self.sess = session.Session('enginesession')
		if self.sess.load():
                    user = UserDB().getUserByKey(self.sess.user)

app = webapp2.WSGIApplication([('/salajuego', SalaJuego)],
                              debug=True)