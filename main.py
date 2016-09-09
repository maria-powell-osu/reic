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

# class AdminPage(webapp2.RequestHandler):
#     def get(self):
#         user = users.get_current_user()
#         if user:
#             if users.is_current_user_admin():
#                 self.response.write('You are an administrator.')
#             else:
#                 self.response.write('You are not an administrator.')
#         else:
#             #self.response.write('You are not logged in.')
#             login_url = users.create_login_url('/login')
#             #self.response.write('You are not logged in.' + login_url)
#             greeting = '<a href="{}">Sign in</a>'.format(login_url)

# 	        self.response.write('<html><body>{}</body></html>'.format(greeting))


# starts th application
application = webapp2.WSGIApplication([
	('/', PlanPassive),
	# Service Routes for API
	('/comments', 'comment.Comment'),
	('/blogs', 'blog.Blog'),
], debug=True)