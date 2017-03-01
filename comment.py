import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import json
import urllib
from google.appengine.api import urlfetch

class Comment(webapp2.RequestHandler):
	def post(self):
		self.response.headers.add_header('Access-Control-Allow-Origin', '*')
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
		captchaResponse = jsonData['captcha'] if ('captcha' in jsonData) else None
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
		if captchaResponse == "" or captchaResponse is None or not isinstance(captchaResponse, (basestring)):
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Captcha User Information is missing."

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

		#Set Data for post request to google for captcha verification
		googleCaptchaUrl = "https://www.google.com/recaptcha/api/siteverify" #google verification URL
		secret = "6Le7FCoTAAAAACb0Q7sYy29ARlkbsN2XMCheo-Qh" #provided by google captcha
		postData = {'secret': secret, 'response': captchaResponse,'remoteUserIP': self.request.remote_addr}

		#Post request to google captcha
		try:
		    form_data = urllib.urlencode(postData)
		    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
		    response = urlfetch.fetch(
		        url=googleCaptchaUrl,
		        payload=form_data,
		        method=urlfetch.POST,
		        headers=headers)

		except urlfetch.Error:
		    #Setup proper response code
			self.response.set_status(500)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Captcha Verification failed."

			#return details
			self.response.write(json.dumps(errorObject))
			return

		#Parse response to json
		captchaResult = json.loads(response.content)

		#See if captcha passed verification
		if captchaResult["success"] == False:  #if user verification failed
			#Setup proper response code
			self.response.set_status(400)

			#Setup error details
			errorObject['code'] = 400
			errorObject['message'] = "Captcha failed."

			#return details
			self.response.write(json.dumps(errorObject))
			return

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
		
