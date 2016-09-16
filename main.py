import os
import urllib
import jinja2
import webapp2
from google.appengine.api import oauth
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


#Application Routing
application = webapp2.WSGIApplication([], debug=True)

#POST
application.router.add(webapp2.Route('/',PlanPassive))
application.router.add(webapp2.Route(r'/comments', 'comment.Comment'))
application.router.add(webapp2.Route(r'/blogs', 'blog.Blog'))
application.router.add(webapp2.Route(r'/blogs/<id:[0-9]+><:/?>', 'blog.Blog'))
application.router.add(webapp2.Route(r'/admin', 'admin.Admin'))