import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json

class Blog(webapp2.RequestHandler):
	def get(self, **kwargs):
		#JSon check needed

		blogs = db_defs.Blog.query().fetch()
		
		#Builds results in JSON serializable format
		resultJson = "["
		last = len(blogs) - 1
		for i, blog in enumerate(blogs):
			out = blog.to_dict()	

			#self.response.write(out["key"])
			paragraphs = db_defs.Paragraph.query(db_defs.Paragraph.blogKey == blog.key).fetch()
			
			paragraphResultList = []
			if paragraphs:
				for paragraph in paragraphs:
					paragraphResultList.append(paragraph.to_dict())

			out['paragraphs'] = paragraphResultList

			#Pull Comments as well

			resultJson += json.dumps(out)
			
			if i != last: #so there is no comma added at the end of the json list
				resultJson += ','
		resultJson += ']'

		#Return the result
		self.response.write(resultJson)
		return

	def put(self, **kwargs):
		#Json check

		#Grab Data
		jsonData = json.loads(self.request.body)
		key = jsonData['key']
		title = jsonData['title']
		author = jsonData['author']
		date = jsonData['date']
		paragraphs = jsonData['paragraphs']
		result = {}

		#Validation Needs to go here
		#check for datatypes
		#check for max lengths 

		#Convert key string to Datastore key	
		blog_key = ndb.Key(db_defs.Blog, key)

		#Get the blog to be updated by the key
		Blog = db_defs.Blog.query(db_defs.Blog.key == blog_key).get()	
		
		#check that record was found, otherwise return not found code

		Blog.title = title
		Blog.author = author
		Blog.date = date
		Blog.put()
		out = Blog.to_dict()

		#Validate Blog Key is set

		#Delete all paragraphs associated with Blog 
		paragraphsOfBlogInDB = db_defs.Paragraph.query(db_defs.Paragraph.blogKey == blog_key).fetch()
		if paragraphsOfBlogInDB:
			for paragraph in paragraphsOfBlogInDB:
				paragraph.key.delete()

		#Write Paragraph Data to datastore with corresponding blog key
		paragraphResultList = []
		for p in paragraphs:
			Paragraph = db_defs.Paragraph()

			# check if paragraph was found
			Paragraph.subHeader = p["subHeader"]
			Paragraph.body = p["body"]
			Paragraph.blogKey = Blog.key 
			Paragraph.put()
			paragraphResultList.append(Paragraph.to_dict())

		out['paragraphs'] = paragraphResultList

		#Return the result
		self.response.write(json.dumps(out))
		return

	def post(self):
		#Json check

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
		blogOut = Blog.to_dict()

		#Validate Blog Key is set

		#Write Paragraph Data to datastore with corresponding blog key
		for p in paragraphs:
			Paragraph = db_defs.Paragraph()
			Paragraph.subHeader = p["subHeader"]
			Paragraph.body = p["body"]
			Paragraph.blogKey = Blog.key 
			Paragraph.put()
			out = Paragraph.to_dict()

		#Return the result
		self.response.write(json.dumps(blogOut))
		return
		
	def delete(self, **kwargs):

		#Validation check that blog id was sent	

		blogKey = ndb.Key(db_defs.Blog, int(kwargs['id']))

		#Validation check for blogKey

		#Delete all paragraphs associated with blogKey
		paragraphs = db_defs.Paragraph.query(db_defs.Paragraph.blogKey == blogKey).fetch()
		if paragraphs:
			for paragraph in paragraphs:
				paragraph.key.delete()

		#Delete all comments associated with blogKey
		comments = db_defs.Comment.query(db_defs.Comment.blogKey == blogKey).fetch()
		if comments:
			for comment in comments:
				comment.key.delete()

		blog = db_defs.Blog.query(db_defs.Blog.key == blogKey).get()
		if blog:
			blog.key.delete()
		
		self.response.write("Deleted")
		return 