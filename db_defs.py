from google.appengine.ext import ndb

# class EmptyValueError(Exception):
# 	def __init__(self, value):
# 		self.value = value
# 	def __str__(self):
# 		return repr(self.value)

class Comment(ndb.Model):
	#Here This needs to become a foreign key
	blogId = ndb.IntegerProperty(required=True)
	commentId = ndb.IntegerProperty(required=True)
	content = ndb.StringProperty(required=True)
	date = ndb.StringProperty(required=True)
	name = ndb.StringProperty(required=True)
	email = ndb.StringProperty(required=True)
	website = ndb.StringProperty(required=False)
	def to_dict(self):
		d = super(Comment, self).to_dict()
		d['key'] = self.key.id()
		return d

class Blog(ndb.Model):
	title = ndb.StringProperty(required=True)
	body = ndb.StringProperty(required=True)
	author = ndb.StringProperty(required=True)
	#image = ndb.BlobProperty(required=False)
	date = ndb.StringProperty(required=True)
	def to_dict(self):
		d = super(Blog, self).to_dict()
		d['key'] = self.key.id()
		return d
