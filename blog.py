import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json

class Blog(webapp2.RequestHandler):
	def get(self, **kwargs):
		blogs = db_defs.Blog.query().fetch()
		
		#Builds results in JSON serializable format
		resultJson = "["
		last = len(blogs) - 1
		for i, blog in enumerate(blogs):
			out = blog.to_dict()	
			resultJson += json.dumps(out)
			
			if i != last: #so there is no comma added at the end of the json list
				resultJson += ','
		resultJson += ']'

		#Return the result
		self.response.write(resultJson)
		return

	def post(self):

		#Grab Data
		jsonData = json.loads(self.request.body)
		title = jsonData['title']
		body = jsonData['body']
		author = jsonData['author']
		date = jsonData['date']

		#Validation Needs to go here
		#check for datatypes
		#check for max lengths 

		#Write data to datastore					
		Blog = db_defs.Blog()
		Blog.title = title
		Blog.author = author
		Blog.date = date
		Blog.body = body
		Blog.put()
		out = Blog.to_dict()
		self.response.write(json.dumps(out))
		return
		