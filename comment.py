import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json

class Comment(webapp2.RequestHandler):
	def get(self, **kwargs):
		comments = db_defs.Comment.query().fetch()
		
		#Builds results in JSON serializable format
		resultJson = "["
		last = len(comments) - 1
		for i, comment in enumerate(comments):
			out = comment.to_dict()	
			resultJson += json.dumps(out)
			if i != last:
				resultJson += ','
		resultJson += ']'
		

		self.response.write(resultJson)
		return

	def post(self):

		#Validate Data Or Send Error Message Back
		try:
			#Grab Data
			content = self.request.get('content', default_value=None)
			postDate = self.request.get('date', default_value=None)
			name = self.request.get('name', default_value=None)
			emailAddress = self.request.get('email', default_value=None)
			website = self.request.get('website', default_value=None)
    		
     		#Grab int data and check that they are in fact ints
			blogId = self.request.get('blogId', default_value=None)
			commentId = self.request.get('commentId', default_value=None)

    		#Validation Need to go here**************************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		except ValueError:
			print "Oops!  That was not valid data.  Try again..."

		#Write data to datastore					
		Comment = db_defs.Comment(parent=comment_key)
		Comment.BlogId = blogId
		Comment.CommentId = commentId
		Comment.Content = content
		Comment.Date = postDate
		Comment.Name = name
		Comment.Email = emailAddress
		Comment.Website = website
		Comment.put()
		out = Comment.to_dict()
		self.response.write(json.dumps(out))
		return
		
