import os
import webapp2

from google.appengine.ext.webapp import template
from google.appengine.api import channel

import session

class Reglas(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'reglas.html')
        self.response.out.write(template.render(path, template_values))

app = webapp2.WSGIApplication([('/reglas', Reglas)], debug=True)