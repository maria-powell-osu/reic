from google.appengine.ext import ndb

# class EmptyValueError(Exception):
# 	def __init__(self, value):
# 		self.value = value
# 	def __str__(self):
# 		return repr(self.value)

class Comment(ndb.Model):
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