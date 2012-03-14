from google.appengine.ext import db
import datetime
import uuid

########### "TABLAS" ##############

class User(db.Model):
	nick = db.StringProperty()
	password = db.StringProperty()
	email = db.EmailProperty()
	idSala = db.StringProperty()

class Sala(db.Model):
	#autor = db.ReferenceProperty(User)
	nombre = db.StringProperty()
	autor = db.StringProperty()
	fechaCrea = db.DateTimeProperty()
	estado = db.StringProperty()
	idSala = db.StringProperty()
	players = db.StringProperty()
	
class Game(db.Model):
	fechaCrea = db.DateTimeProperty()
	idSala = db.StringProperty()
	
class UsersInGame(db.Model):
	game = db.ReferenceProperty(Game)
	user = db.ReferenceProperty(User)

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
		nuevoUsuario.idSala = "None"
		nuevoUsuario.put()

		return 0;

	def getUserByNick(self, nickName):
		# Modo 1 (Preferido)
		q = User.all()
		q.filter("nick =", nickName)

		# Modo 2
		# q = db.GqlQuery("SELECT * FROM User WHERE nick = :1 ", nickName)

		results = q.get()
		return results

	def getUserByMail(self, email):
		q = User.all()
		q.filter("email =", email)

		results = q.get()		
		return results
		
	def getUsersQuery(self, nickName, passw):
		q = User.all()
		q.filter("nick =", nickName)
		q.filter("password =", passw)
		
		return q
		
	def getUserByKey(self, key):
		return User.get(key)
	
	def getUsersBySala(self, idSala):
		q = User.all()
		q.filter("idSala =", idSala)
		return q


class SalasDB:

	def AddSala(self, nombreSala, autor):
		u = uuid.uuid4()
		nuevaSala = Sala()
		#nuevaSala.autor = usuario
		nuevaSala.nombre = nombreSala
		nuevaSala.autor = autor
		nuevaSala.fechaCrea = datetime.datetime.now()
		nuevaSala.estado = "Privado"
		nuevaSala.idSala = u.hex
		nuevaSala.put()

	def ListarSalas(self):
		sala=Sala.all()
		res=sala.fetch(100)
		return res
		
	def getSalaByAutor(self, autor):
		sala = Sala.all()
		sala.filter("autor =", autor)
		res = sala.fetch(1)
		return res
		
	def getNumSalas(self):
		sala = Sala.all()
		res = sala.count()
		return res
	
	def deleteSala(self, idSala):
		sala = Sala.all()
		sala.filter("idSala =", idSala)
		res = sala.get()
		Sala.delete(res)
		
class GameDB:
	
	def AddGame(self, idSala):
		newGame = Game()
		newGame.fechaCrea = datetime.datetime.now()
		newGame.idSala = idSala
		newGame.put()
		return newGame

	def getGameBySala(self, idSala):
		game = Game.all()
		game.filter("idSala =", idSala)
		res = game.get()
		return res
	
	def deleteGame(self, idSala):
		game = Game.all()
		game.filter("idSala =", idSala)
		res = game.get()
		Game.delete(res)

class UsersInGameDB:
	
	def AddUserInGame(self, user, game):
		inGame = UsersInGame()
		inGame.game = game
		inGame.user = user
		inGame.put()
	
	def UserExist(self, user):
		inGame = UsersInGame.all()
		inGame.filter("user =", user)
		res = inGame.count()
		if res>0:
			return True
		else:
			return False
		
	def deleteUserInGame(self, user):
		inGame = UsersInGame.all()
		inGame.filter("user =", user)
		res = inGame.get()
		UsersInGame.delete(res)
		

class PalabrasDB:

	def AddPalabra(self, nomPalabra, temaPalabra):
		nuevapalabra = Palabra()
		nuevapalabra.palabra = nomPalabra
		nuevapalabra.tema = temaPalabra
		nuevapalabra.put()
	
	def AddPalabra(self, nomPalabra):
		nuevapalabra = Palabra()
		nuevapalabra.palabra = nomPalabra
		nuevapalabra.put()
	
	def AddTema(self, tema):
		nuevotema = Palabra()
		nuevotema.tema = tema
		nuevotema.put()
