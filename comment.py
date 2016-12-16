import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json

class Comment(webapp2.RequestHandler):
	# def get(self, **kwargs):
	# 	errorObject = {}
	# 	#Check request format
	# 	if 'application/json' not in self.request.accept:
	# 		#Setup proper response code
	# 		self.response.set_status(406)

	# 		#Setup error details
	# 		errorObject['code'] = 406
	# 		errorObject['message'] = "Data format does not match required type"

	# 		#return details
	# 		self.response.write(json.dumps(errorObject))
	# 		return

	# 	#Validation check that blog id was sent	
	# 	if not ('blogkey' in kwargs) or not kwargs['blogkey'].isdigit():
	# 		self.response.set_status(400)
	# 		errorObject['code'] = 400
	# 		errorObject['message'] = "BAD REQUEST: Required parameter is missing."
	# 		self.response.write(json.dumps(errorObject))
	# 		return

	# 	#Generate ndb Key from id
	# 	blogKey = ndb.Key(db_defs.Blog, int(kwargs['blogkey']))

	# 	#Get all comments associated with blogkey
	# 	comments = db_defs.Comment.query(db_defs.Comment.blogKey == blogKey).fetch()
		
	# 	#Builds results in JSON serializable format
	# 	listOfCommentObjects = []

	# 	#create response Object containing all blogs and corresponding paragraphs
	# 	for i, comment in enumerate(comments):

	# 		#add current blog to list
	# 		listOfCommentObjects.append(comment.to_dict())
		
	# 	#Return reponse with proper code
	# 	self.response.set_status(200)
	# 	self.response.write(json.dumps(listOfCommentObjects))
	# 	return

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
		jsonData = json.loads(self.request.body)
		content = jsonData['content'] if ('content' in jsonData) else None
		postDate = jsonData['date'] if ('date' in jsonData) else None
		name = jsonData['name'] if ('name' in jsonData) else None
		emailAddress = jsonData['email'] if ('email' in jsonData) else None
		website = jsonData['website'] if ('website' in jsonData) else None
		blogKey = jsonData['blogKey'] if ('blogKey' in jsonData) else None
		# index = jsonData['index'] if ('index' in jsonData) else None
		respondsTo = jsonData['respondsTo'] if ('respondsTo' in jsonData) else None

		#BlogKey Validation
		if blogKey == "" or blogKey is None or not isinstance(blogKey, (int, long)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Key attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Content Validation
		if content == "" or content is None or not isinstance(content, (basestring)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Content attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Date Validation
		if postDate == "" or postDate is None:
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Date attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Date Validation
		if emailAddress == "" or emailAddress is None:
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Email attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Website Validation
		if website is not None and not isinstance(website, (basestring)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Website attribute is missing or in unacceptable format"

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Index Validation
		# if index == "" or index is None or not isinstance(index, (int, long)):
		# 	#Setup proper response code
		# 	self.response.set_status(400)

		# 	#Setup error details
		# 	errorObject['code'] = 400
		# 	errorObject['message'] = "Index attribute is missing or in unacceptable format"

		# 	#return details
		# 	self.response.write(json.dumps(errorObject))
		# 	return

		#Convert key string to Datastore key	
		key = ndb.Key(db_defs.Blog, blogKey)

		#Write data to datastore					
		Comment = db_defs.Comment()
		Comment.blogKey = key
		Comment.respondsTo = respondsTo
		Comment.content = content
		Comment.date = postDate
		Comment.name = name
		Comment.email = emailAddress
		Comment.website = website
		Comment.put()
		out = Comment.to_dict()
		self.response.write(json.dumps(out))
		return
		
