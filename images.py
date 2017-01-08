import webapp2
from google.appengine.ext import ndb
import db_defs #Contain Classes Used By Website
import config
import json
import sys
import cloudstorage as gcs
import datetime
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.api import images
# from google.appengine.api.cloud_storage import CloudStorageTools
from google.appengine.ext import blobstore


class Image(webapp2.RequestHandler):
	def post(self, **kwargs):
		#Returns list of  images with in form Note: had to use getall that returns a list for it to work with multiform data type form
		image = self.request.POST.getall('image')

		if not image:
			return self.response.write("No Image Found")

		#if list not empty extract our first image from list (only ever expect to be sent one at a time)
		image = image[0]

		blobKey = CreateFile(image.filename, image.type, image.value, self)
		public_url = images.get_serving_url(blob_key=blobKey)

		fileObject = {}
		fileObject['url'] = public_url
		fileObject['filename'] = "/realestatecalculator-1256.appspot.com" + image.filename

		self.response.set_status(200)
		self.response.write(json.dumps(fileObject))
		return

	def get(self, **kwargs):
		bucketContents = gcs.listbucket('/realestatecalculator-1256.appspot.com')
		result = []
		for img in bucketContents:
			fileObject = {}
			fileObject['filename'] = img.filename
			blobKey = blobstore.create_gs_key('/gs/realestatecalculator-1256.appspot.com/' + img.filename)
			fileObject['url'] = images.get_serving_url(blob_key=blobKey)

			result.append(fileObject)
		
		self.response.write(json.dumps(result))

	def delete(self, **kwargs):
		errorObject = {}

		#Validation check that filename was sent
		if not ('filename' in kwargs) or not isinstance(kwargs['filename'], (basestring)):
			self.response.set_status(400)
			errorObject['code'] = 400
			errorObject['message'] = "BAD REQUEST: Required parameter is missing."
			self.response.write(json.dumps(errorObject))
			return

		filename = kwargs['filename']

		#should add error handling if throws not found error
		gcs.delete(filename)
  		self.response.set_status(200)
  		self.response.write("deleted")
      	#except gcs.NotFoundError:
	    	#pass
	  #     	self.response.set_status(404)
			# errorObject['code'] = 404
			# errorObject['message'] = "BAD REQUEST: No file with this name found."
			# self.response.write(json.dumps(errorObject))
			# return

"""Create a GCS file with GCS client lib.
	Args:
	filename: GCS filename.

	Returns:
	The corresponding string blobkey for this GCS file.
"""
def CreateFile(filename, content_type, fileStream, self):

	#Ensure that the file is an image
	checkExtension(filename, config.ALLOWED_EXTENSIONS, self)


	#generate gcs file name
	gcsFileName = '/realestatecalculator-1256.appspot.com/' + filename

 
	# Create a GCS file with GCS client.
	with gcs.open(gcsFileName, 'w') as f:
		f.write(fileStream)

	# Blobstore API requires extra /gs to distinguish against blobstore files.
	blobstore_filename = '/gs' + gcsFileName

	# This blob_key works with blobstore APIs that do not expect a
	# corresponding BlobInfo in datastore.
	return blobstore.create_gs_key(blobstore_filename)

"""
    Generates a safe filename that is unlikely to collide with existing objects
    in Google Cloud Storage.
    ``filename.ext`` is transformed into ``filename-YYYY-MM-DD-HHMMSS.ext``
    """
# def generateSafeFilename(filename):
# 	#Need to handle white spaces still
# 	date = datetime.datetime.utcnow().strftime("%Y-%m-%d-%H%M%S")
# 	basename, extension = filename.rsplit('.', 1)
# 	return "{0}-{1}.{2}".format(basename, date, extension)

def checkExtension(filename, allowed_extensions, self):
	if ('.' not in filename or filename.split('.').pop().lower() not in allowed_extensions):
		errorObject = {}
		#Setup proper response code
		self.response.set_status(406)

		#Setup error details
		errorObject['code'] = 406
		errorObject['message'] = "File was not of accepted type"

		#return details
		self.response.write(json.dumps(errorObject))
		return

