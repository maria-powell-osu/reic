import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json

class Comment(webapp2.RequestHandler):
	def get(self, **kwargs):
		#Json Check
		# if 'application/json' not in self.request.accept:
		# 	self.response.status = 406
		# 	self.response.status_message = "API only supports application/json"
		# 	self.response.write(self.response.status)
		# 	return
	def post(self):
		errorEncountered = false
		errorMessage = ""

		#Json Check
		if 'application/json' not in self.request.accept:
			self.response.status = 406
			self.response.status_message = "API only supports application/json"
			self.response.write(self.response.status)
			return

		#Validate Data Or Send Error Message Back
		try:
			#Grab Data
			text = self.request.get('text', default_value=None)
			postDate = self.request.get('date', default_value=None)
			name = self.request.get('name', default_value=None)
			emailAddress = self.request.get('email', default_value=None)
			website = self.request.get('website', default_value=None)
    		
    		#Grab int data and check that they are in fact ints
    		blogId = int(self.request.get('blodId', default_value=None))
    		commentId = int(self.request.get('commentId', default_value=None))

    		#check that all user data is not empty
    		# if not text.strip():
    		# 	raise EmptyValueError("comment text")
    		# if not postDate.strip():
    		# 	raise

		except ValueError:
			print "Oops!  That was no valid number.  Try again..."

		#Write data to datastore						
		u = db_defs.Comment(parent=comment_key)
		#u.blogId = int(blogId)
		#u.commentId = comment_key
		u.text = text
		u.postDate = name
		u.name = card_type
		u.emailAddress = emailAddress
		u.website = website
		u.put()
		out = u.to_dict()
		self.response.write(json.dumps(out))
		return
		
