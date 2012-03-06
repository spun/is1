from google.appengine.ext import db
import datetime

########### "TABLAS" ##############

class User(db.Model):
	nick = db.StringProperty()
	password = db.StringProperty()
	email = db.EmailProperty()

class Sala(db.Model):
	#autor = db.ReferenceProperty(User)
	autor = db.StringProperty()
	fechaCrea = db.DateProperty()
	

########### METODOS ################

class UserDB:

	""" Anade un nuevo usuario a la base de datos.
		Recibe nick, contrasena y correo
		Devuelve 0 si todo es correcto """ 
	def AddUser(self, nickName, passwrd, correo):
		nuevoUsuario = User()
		nuevoUsuario.nick = nickName;
		nuevoUsuario.password = passwrd;
		nuevoUsuario.email = correo;
		nuevoUsuario.put()
		
		return 0;
		
	def getUserByNick(self, nickName):
		# Modo 1 (Preferido)
		q = User.all()
		q.filter("nick =", nickName)
		        
		# Modo 2
		# q = db.GqlQuery("SELECT * FROM User WHERE nick = :1 ", nickName)
        
		results = q.fetch(5)
		return results
        

class SalasDB:
	
	def AddSala(self, usuario):
		nuevaSala = Sala()
		#nuevaSala.autor = usuario
		nuevaSala.autor = usuario
		nuevaSala.fechaCrea = datetime.datetime.now().date()
		nuevaSala.put()
	
	def ListarSalas(self):
		sala=Sala.all()
		res=sala.fetch(100)
		return res
		
