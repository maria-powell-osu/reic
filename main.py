import os
import urllib
import jinja2
import webapp2
from google.appengine.api import oauth
from google.appengine.api import users
import os
import sys
sys.path.append(os.path.join(os.path.join(os.path.dirname(__file__), ".."), "lib"))  # relative to main.py


# Python Template Engine To Render my HTML
JINJA_ENVIRONMENT = jinja2.Environment(
	loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True
	)

# call the home page html template
class PlanPassive(webapp2.RequestHandler):
	template_variables = {}

	def get(self, **kwargs):
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render())

# generates the site map for bots crawling the site (for SEO)
class Sitemap(webapp2.RequestHandler):
	template_variables = {}

	def get(self, **kwargs):
		self.response.headers.add_header('Access-Control-Allow-Origin', '*')
		template = JINJA_ENVIRONMENT.get_template('sitemap.xml')
		self.response.write(template.render())

# generates the robots.txt for bots crawling the site (for SEO)
class Robot(webapp2.RequestHandler):
	template_variables = {}

	def get(self, **kwargs):
		self.response.headers.add_header('Access-Control-Allow-Origin', '*')
		template = JINJA_ENVIRONMENT.get_template('robots.txt')
		self.response.write(template.render())

# class Test(webapp2.RequestHandler):
# 	template_variables = {}

# 	def get(self, **kwargs):
# 		template = JINJA_ENVIRONMENT.get_template('app\components\tools\rentalCalculator\rentalCalculatorView.html')
# 		self.response.write(template.render())

#Application Routing
application = webapp2.WSGIApplication([], debug=True)

#POST
application.router.add(webapp2.Route('/',PlanPassive))
application.router.add(webapp2.Route(r'/comments', 'comment.Comment'))
application.router.add(webapp2.Route(r'/blogData', 'blog.Blog'))
application.router.add(webapp2.Route(r'/images', 'images.Image'))
application.router.add(webapp2.Route(r'/images/<filename:.*><:/?>', 'images.Image'))
application.router.add(webapp2.Route(r'/blogData/<id:[0-9]+><:/?>', 'blog.Blog'))
application.router.add(webapp2.Route(r'/blogData/<name:.*><:/?>', 'blog.Blog'))
application.router.add(webapp2.Route(r'/adminData', 'admin.Admin'))
application.router.add(webapp2.Route(r'/sitemap', Sitemap))
application.router.add(webapp2.Route(r'/robots.txt', Robot))
# Angularjs routes
#this had to be added after I removed the /#/ so it recognizes those routes still
application.router.add(webapp2.Route('/rental-property-calculator',PlanPassive))
application.router.add(webapp2.Route('/investment-calculators',PlanPassive))
application.router.add(webapp2.Route('/investment-return-calculator',PlanPassive))
application.router.add(webapp2.Route('/blogs',PlanPassive))
application.router.add(webapp2.Route(r'/blogs/<blogname:.*><:/?>',PlanPassive))
application.router.add(webapp2.Route('/admin',PlanPassive))
application.router.add(webapp2.Route('/contact',PlanPassive))