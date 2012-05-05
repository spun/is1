import os
import sha
import time
import Cookie

COOKIE_NAME = 'example'

class Session(object):

    def __init__(self, seed):
        self.time  = None
        self.user  = None
        self.auth  = None
        self.seed  = seed

    def load(self):
        string_cookie = os.environ.get('HTTP_COOKIE', '')
        self.cookie = Cookie.SimpleCookie()
        self.cookie.load(string_cookie)
        if self.cookie.get(COOKIE_NAME):
            value  = self.cookie[COOKIE_NAME].value
            tokens = value.split(':')
            if len(tokens) != 3:
                return False
            else:
                h = tokens[2]
                tokens = tokens[:-1]
                tokens.append(self.seed)
                if h == self.hash(tokens):
                    self.time = tokens[0]
                    self.user = tokens[1]
                    self.auth = h
                    try:
                        t = int(self.time)
                    except:
                        return False
                    if t > int(time.time()):
                        return True
        return False

    def store(self, user, expire):
        self.time = str(int(time.time())+expire)
        self.user = user
        params = [self.time, self.user, self.seed]
        self.auth = self.hash(params)
        params = [self.time, self.user, self.auth]
        self.cookie[COOKIE_NAME] = ':'.join(params)
        self.cookie[COOKIE_NAME]['expires'] = expire
        self.cookie[COOKIE_NAME]['path'] = '/'
        print 'Set-Cookie: %s; HttpOnly' % (self.cookie.output().split(':', 1)[1].strip())

    def hash(self, params):
        return sha.new(';'.join(params)).hexdigest()
