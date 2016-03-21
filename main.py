import os
import urllib
import jinja2
import webapp2

# Python Template Engine To Render my HTML
JINJA_ENVIRONMENT = jinja2.Environment(
	loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True
	)

# call the home page html template
class HomePage(webapp2.RequestHandler):
	template_variables = {}

	def get(self):
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render())


# starts the application
application = webapp2.WSGIApplication([
	('/', HomePage),
], debug=True)