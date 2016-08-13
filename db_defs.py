from google.appengine.ext import ndb

# class EmptyValueError(Exception):
# 	def __init__(self, value):
# 		self.value = value
# 	def __str__(self):
# 		return repr(self.value)

class Comment(ndb.Model):
	BlogId = ndb.IntegerProperty(required=True)
	CommentId = ndb.IntegerProperty(required=True)
	Content = ndb.StringProperty(required=True)
	Date = ndb.StringProperty(required=True)
	Name = ndb.StringProperty(required=True)
	Email = ndb.StringProperty(required=True)
	Website = ndb.StringProperty(required=False)
	def to_dict(self):
		d = super(Comment, self).to_dict()
		d['key'] = self.key.id()
		return d