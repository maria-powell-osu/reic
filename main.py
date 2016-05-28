import os
import urllib
import jinja2
import webapp2
from google.appengine.api import users

# Python Template Engine To Render my HTML
JINJA_ENVIRONMENT = jinja2.Environment(
	loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True
	)

# call the home page html template
class PlanPassive(webapp2.RequestHandler):
	template_variables = {}

	def get(self):
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render())

# starts th application
application = webapp2.WSGIApplication([
	('/', PlanPassive),
	# Service Routes for API
	#('/')
], debug=True)