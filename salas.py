import os
import webapp2

from google.appengine.ext.webapp import template

import session
from BD.clases import SalasDB
from BD.clases import UserDB

class Salas(webapp2.RequestHandler):
	def get(self):
		miPag = self.request.get('p', default_value='0')
		if miPag == '0':
			self.redirect("/salas?p=1")	
		else:	
			salas=SalasDB()		
			res=salas.ListarSalas()
			
			i=0
			res2 =[]
			for sala in res:
				if i>=(int(self.request.get('p'))-1)*12 and i<(int(self.request.get('p')))*12:
					res2.append(sala)
				i+=1
				
			
			template_values = {'salas_list':res2}
			
			# Extraemos el usuario de la sesion 
			self.sess = session.Session('enginesession')
			if self.sess.load():
				user = UserDB().getUserByKey(self.sess.user)
				template_values['user'] = user
			
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
				salas=SalasDB()			
				nombre=self.request.get('nombre')
				autor=user.nick
				salas.AddSala(nombre, autor)
				miSala=SalasDB().getSalaByAutor(user.nick)
				user.idSala=miSala[0].idSala
				user.put()
				self.redirect("/salas?p=1")
			else:
				self.redirect("/salas?p=1")
		else:
			self.redirect("/salas?p=1")
	

app = webapp2.WSGIApplication([('/salas', Salas)],
                              debug=True)
