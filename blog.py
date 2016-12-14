import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json
import sys
maxEntitySizeOfOneMB = 1048576 

class Blog(webapp2.RequestHandler):
	
	def get(self, **kwargs):
		errorObject = {}

		#Check request format
		if 'application/json' not in self.request.accept:
			#Setup proper response code
			self.response.set_status(406)

			#Setup error details
			errorObject['code'] = 406
			errorObject['message'] = "Data format does not match required type"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Get all blogs from DB
		blogs = db_defs.Blog.query().fetch()
		listOfBlogObjects = []

		#create response Object containing all blogs and corresponding paragraphs
		for i, blog in enumerate(blogs):

			#add current blog to list
			listOfBlogObjects.append(blog.to_dict())

			#get pragraphs associated to blog
			paragraphs = db_defs.Paragraph.query(db_defs.Paragraph.blogKey == blog.key).order(db_defs.Paragraph.index).fetch()

			#if the blog has paragraphs, generate list of paragraphs
			listOfParagraphs = []
			if paragraphs:
				for paragraph in paragraphs:
					listOfParagraphs.append(paragraph.to_dict())

			#add paragraphs to the blog object
			listOfBlogObjects[i]['paragraphs'] = listOfParagraphs

			#get comments associated with blog
			comments = db_defs.Comment.query(db_defs.Comment.blogKey == blog.key).order(db_defs.Comment.index).fetch()

			#if the blog has comments, generate list of paragraphs
			listOfComments = []
			if comments:
				for comment in comments:
					listOfComments.append(comment.to_dict())

			#add paragraphs to the blog object
			listOfBlogObjects[i]['comments'] = listOfComments

		#Return reponse with proper code
		self.response.set_status(200)
		self.response.write(json.dumps(listOfBlogObjects))
		return

	def put(self, **kwargs):
		errorObject = {}

		#Check request format
		if 'application/json' not in self.request.accept:
			#Setup proper response code
			self.response.set_status(406)

			#Setup error details
			errorObject['code'] = 406
			errorObject['message'] = "Data format does not match required type"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Get data sent with request or set it to None
		jsonData = json.loads(self.request.body)
		key = jsonData['key'] if ('key' in jsonData) else None
		title = jsonData['title'] if ('title' in jsonData) else None
		author = jsonData['author'] if ('author' in jsonData ) else None
		date = jsonData['date'] if ('date' in jsonData) else None
		img = str(jsonData['image']) if ('image' in jsonData) else None
		paragraphs = jsonData['paragraphs'] if ('paragraphs' in jsonData) else None

		#Key Validation
		if key == "" or key is None or not isinstance(key, (int, long)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Key attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Title Validation
		if title == "" or title is None or not isinstance(title, (basestring)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Title attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Author Validation
		if author == "" or author is None or not isinstance(author, (basestring)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Author attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Date Validation
		if date == "" or date is None:
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Date attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Paragraph Validation
		if paragraphs == [] or paragraphs is None:
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Paragraphs are missing from blog."

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Image Validation
		if img == "" or img is None:
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Title Image is missing from blog."

			#return details
			self.response.write(json.dumps(errorObject))
			return


		# Validate required Parameter fields are there, else return error code
		for p in paragraphs:
			if not ('body' in p) or p["body"] == "" or not isinstance(p["body"], (basestring)):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Required paragraph parameter is missing."
				self.response.write(json.dumps(errorObject))
				return
			if not ('index' in p) or p["index"] == "" or not isinstance(p["index"], (int, long)):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Required paragraph parameter is missing."
				self.response.write(json.dumps(errorObject))
				return
			if ("subHeader" in p) and not isinstance(p["subHeader"], (basestring)):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Required paragraph parameter is missing."
				self.response.write(json.dumps(errorObject))
				return

		#Convert key string to Datastore key	
		blog_key = ndb.Key(db_defs.Blog, key)

		#Get the blog to be updated by the key
		Blog = db_defs.Blog.query(db_defs.Blog.key == blog_key).get()

		#If the user is changing the title, then check if title exists
		if Blog.title != title:
			#Check that Blog Title is unique
			#Title was made unique because it is used to identify routes on the site
			titleFound = db_defs.Blog.query(db_defs.Blog.title == title).fetch()
			if(titleFound):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Blog Title already exists."
				self.response.write(json.dumps(errorObject))
				return	
		
		#check that record was found
		if not Blog or Blog == None:
			#Setup proper response code
			self.response.set_status(404)

			#Setup error details
			errorObject['code'] = 404
			errorObject['message'] = "Blog record could not be found."
			#return details
			self.response.write(json.dumps(errorObject))
			return

		Blog.title = title
		Blog.author = author
		Blog.date = date
		Blog.image = img
		Blog.put()
		blogObject = Blog.to_dict()

		#Delete all paragraphs associated with Blog 
		paragraphsOfBlogInDB = db_defs.Paragraph.query(db_defs.Paragraph.blogKey == blog_key).fetch()
		if paragraphsOfBlogInDB:
			for paragraph in paragraphsOfBlogInDB:
				paragraph.key.delete()

		#Write Paragraph Data to datastore with corresponding blog key
		paragraphResultList = []
		for p in paragraphs:
			Paragraph = db_defs.Paragraph()
			Paragraph.subHeader = p["subHeader"] if ('subHeader' in p) else None
			Paragraph.body = p["body"] if ('body' in p) else None
			Paragraph.index = p["index"] if ('index' in p) else None
			Paragraph.image = str(p["image"]) if ('image' in p) else None
			Paragraph.blogKey = Blog.key 
			Paragraph.put()
			paragraphResultList.append(Paragraph.to_dict())

		blogObject['paragraphs'] = paragraphResultList

		#Return the result
		self.response.set_status(200)
		self.response.write(json.dumps(blogObject))
		return

	def post(self):
		errorObject = {}
		#Check request format
		if 'application/json' not in self.request.accept:
			#Setup proper response code
			self.response.set_status(406)

			#Setup error details
			errorObject['code'] = 406
			errorObject['message'] = "Data format does not match required type"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Grab Data
		#Get data sent with request or set it to None
		jsonData = json.loads(self.request.body)
		title = jsonData['title'] if ('title' in jsonData) else None
		author = jsonData['author'] if ('author' in jsonData ) else None
		date = jsonData['date'] if ('date' in jsonData) else None
		img = str(jsonData['image']) if ('image' in jsonData) else None
		paragraphs = jsonData['paragraphs'] if ('paragraphs' in jsonData) else None
		result = {}

		#Blog Title Validation
		if title == None or title == "" or not isinstance(title, (basestring)): 
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Required parameter is missing."
			self.response.write(json.dumps(errorObject))
			return

		#Blog Author Validation
		if author == None or author == "" or not isinstance(author, (basestring)): 
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Required parameter is missing."
			self.response.write(json.dumps(errorObject))
			return

		#Blog Date Validation
		if date == None or date == "": 
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Required parameter is missing."
			self.response.write(json.dumps(errorObject))
			return

		#Blog Paragraphs Validation
		if paragraphs == None or paragraphs == "": 
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Required parameter is missing."
			self.response.write(json.dumps(errorObject))
			return

		#Check that Blog Title is unique
		#Title was made unique because it is used to identify routes on the site
		titleFound = db_defs.Blog.query(db_defs.Blog.title == title).fetch()
		if(titleFound):
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Blog Title already exists."
			self.response.write(json.dumps(errorObject))
			return

		# Validate required Parameter fields are there, else return error code
		for p in paragraphs:
			if not ('body' in p) or p["body"] == "" or not isinstance(p["body"], (basestring)):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Required paragraph parameter is missing."
				self.response.write(json.dumps(errorObject))
				return
			if not ('index' in p) or p["index"] == "" or not isinstance(p["index"], (int, long)):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Required paragraph parameter is missing."
				self.response.write(json.dumps(errorObject))
				return
			if ("subHeader" in p) and not isinstance(p["subHeader"], (basestring)):
				self.response.set_status(400)
				errorObject['code'] = 400
				errorObject['message'] = "BAD REQUEST: Required paragraph parameter is missing."
				self.response.write(json.dumps(errorObject))
				return

		#Validation Needs to go here
		#check for max lengths 
		#check for size

		#Write Blog data to datastore					
		Blog = db_defs.Blog()
		Blog.title = title
		Blog.author = author
		Blog.date = date
		Blog.image = img

		Blog.put()
		blogOut = Blog.to_dict()

		#Write Paragraph Data to datastore with corresponding blog key
		for p in paragraphs:
			Paragraph = db_defs.Paragraph()

			#Validate required fiselds exi
			Paragraph.subHeader = p["subHeader"] if ('subHeader' in p) else None
			Paragraph.body = p["body"] if ('body' in p) else None
			Paragraph.index = p["index"] if ('index' in p) else None
			Paragraph.image = str(p["image"]) if ('image' in p) else None
			Paragraph.blogKey = Blog.key 
			
			if len(Paragraph._to_pb().Encode()) <= maxEntitySizeOfOneMB:
				Paragraph.put()
				out = Paragraph.to_dict()
			else:
				#enter error cod
				errorMessage = "error"

		#Return the result
		self.response.write(json.dumps(blogOut))
		return
		
	def delete(self, **kwargs):
		errorObject = {}
		#Check request format
		if 'application/json' not in self.request.accept:
			#Setup proper response code
			self.response.set_status(406)

			#Setup error details
			errorObject['code'] = 406
			errorObject['message'] = "Data format does not match required type"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Validation check that blog id was sent	
		if not ('id' in kwargs) or not kwargs['id'].isdigit():
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Required parameter is missing."
			self.response.write(json.dumps(errorObject))
			return

		blogKey = ndb.Key(db_defs.Blog, int(kwargs['id']))

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

		#Get the blog
		blog = db_defs.Blog.query(db_defs.Blog.key == blogKey).get()
		
		#Validation check for blogKey
		if not blog or blog == None:
			#Setup proper response code
			self.response.set_status(404)

			#Setup error details
			errorObject['code'] = 404
			errorObject['message'] = "Blog record could not be found."
			#return details
			self.response.write(json.dumps(errorObject))
			return

		if blog:
			blog.key.delete()

		self.response.write("Deleted")
		return 