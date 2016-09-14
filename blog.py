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
		author = jsonData['author']
		date = jsonData['date']
		paragraphs = jsonData['paragraphs']
		result = {}

		#Validation Needs to go here
		#check for datatypes
		#check for max lengths 

		#Write Blog data to datastore					
		Blog = db_defs.Blog()
		Blog.title = title
		Blog.author = author
		Blog.date = date
		Blog.put()
		out = Blog.to_dict()

		#Validate Blog Key is set

		#Write Paragraph Data to datastore with corresponding blog key
		for p in paragraphs:
			Paragraph = db_defs.Paragraph()
			Paragraph.subHeader = p["subHeader"]
			Paragraph.body = p["body"]
			Paragraph.blogKey = Blog.key 
			Paragraph.put()
			out = Paragraph.to_dict()

		#This probably should return status code with self.response.write
		return
		