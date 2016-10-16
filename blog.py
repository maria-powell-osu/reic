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
			errorObject['message'] = "Data format does not match application/json"

			#return details
			self.response.write(json.dumps(errorObject))
			return

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
			errorObject['message'] = "Data format does not match application/json"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		jsonData = json.loads(self.request.body)
		key = jsonData['key'] if ('key' in jsonData) else None;
		title = jsonData['title'] if ('title' in jsonData) else None;
		author = jsonData['author'] if ('author' in jsonData ) else None;
		date = jsonData['date'] if ('date' in jsonData) else None;
		img = str(jsonData['image']) if ('image' in jsonData) else None;
		paragraphs = jsonData['paragraphs'] if ('paragraphs' in jsonData) else None;

		#Key Validation
		if key == "" or key is None or not isinstance(key, (int, long)):
			#Setup proper response code
			self.response.set_status(422)

			#Setup error details
			errorObject['code'] = 422
			errorObject['message'] = "Key attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Title Validation
		if title == "" or title is None or not isinstance(title, (basestring)):
			#Setup proper response code
			self.response.set_status(422)

			#Setup error details
			errorObject['code'] = 422
			errorObject['message'] = "Title attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Author Validation
		if author == "" or author is None or not isinstance(author, (basestring)):
			#Setup proper response code
			self.response.set_status(422)

			#Setup error details
			errorObject['code'] = 422
			errorObject['message'] = "Author attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Date Validation
		if date == "" or date is None:
			#Setup proper response code
			self.response.set_status(422)

			#Setup error details
			errorObject['code'] = 422
			errorObject['message'] = "Date attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Image Validation
		if paragraphs == [] or paragraphs is None:
			#Setup proper response code
			self.response.set_status(422)

			#Setup error details
			errorObject['code'] = 422
			errorObject['message'] = "Paragraphs are missing from blog."

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Convert key string to Datastore key	
		blog_key = ndb.Key(db_defs.Blog, key)

		#HERE: create a check if the key was found

		#Get the blog to be updated by the key
		Blog = db_defs.Blog.query(db_defs.Blog.key == blog_key).get()	
		
		#check that record was found, otherwise return not found code

		Blog.title = title
		Blog.author = author
		Blog.date = date
		Blog.image = img
		Blog.put()
		blogObject = Blog.to_dict()

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
			Paragraph.index = p["index"]
			Paragraph.image = str(p["image"])
			Paragraph.blogKey = Blog.key 
			Paragraph.put()
			paragraphResultList.append(Paragraph.to_dict())

		blogObject['paragraphs'] = paragraphResultList

		#Return the result
		self.response.set_status(200)
		self.response.write(json.dumps(blogObject))
		return

	def post(self):
		#Json check

		#Grab Data
		jsonData = json.loads(self.request.body)
		title = jsonData['title']
		author = jsonData['author']
		date = jsonData['date']
		paragraphs = jsonData['paragraphs']
		img = str(jsonData['image'])
		result = {}

		#Validation Needs to go here
		#check for datatypes
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

		#Validate Blog Key is set

		#Write Paragraph Data to datastore with corresponding blog key
		for p in paragraphs:
			Paragraph = db_defs.Paragraph()

			#Validate if fields exists: especially non-required ones
			Paragraph.subHeader = p["subHeader"]
			Paragraph.body = p["body"]
			Paragraph.index = p["index"]
			Paragraph.image = str(p["image"])
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