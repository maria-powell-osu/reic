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
			
			if i != last: #so there is no comma added at the end of the json list
				resultJson += ','
		resultJson += ']'
		
		#Return the result
		self.response.write(resultJson)
		return

	def post(self):

		#Grab Data
		jsonData = json.loads(self.request.body)
		content = jsonData['content']
		postDate = jsonData['date']
		name = jsonData['name']
		emailAddress = jsonData['email']
		website = jsonData['website']
		blogId = jsonData['blogId']
		commentId = jsonData['commentId']

		#Validation Needs to go here

		#Write data to datastore					
		Comment = db_defs.Comment()
		Comment.blogId = blogId
		Comment.commentId = commentId
		Comment.content = content
		Comment.date = postDate
		Comment.name = name
		Comment.email = emailAddress
		Comment.website = website
		Comment.put()
		out = Comment.to_dict()
		self.response.write(json.dumps(out))
		return
		
