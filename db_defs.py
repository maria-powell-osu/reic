from google.appengine.ext import ndb

class Blog(ndb.Model):
	title = ndb.StringProperty(required=True)
	author = ndb.StringProperty(required=True)
	image = ndb.BlobProperty(required=False)
	date = ndb.StringProperty(required=True)
	#this is a text property because it is not limited for 1500 like StringProperty is
	content = ndb.TextProperty(required=True) 
	def to_dict(self):
		d = super(Blog, self).to_dict()
		d['key'] = self.key.id()
		return d

class Image(ndb.Model):
	#blogKey = ndb.KeyProperty(kind=Blog, required=True)
	blobKey = ndb.BlobKeyProperty(required=True)
	def to_dict(self):
		d = super(Blog, self).to_dict()
		d['key'] = self.key.id()
		return d

class Comment(ndb.Model):
	#Here This needs to become a foreign key
	blogKey = ndb.KeyProperty(kind=Blog, required=True)
	#index = ndb.IntegerProperty(required=True)
	content = ndb.StringProperty(required=True)
	date = ndb.StringProperty(required=True)
	name = ndb.StringProperty(required=True)
	email = ndb.StringProperty(required=True)
	website = ndb.StringProperty(required=False)
	respondsTo = ndb.IntegerProperty(required=False)
	def to_dict(self):
		d = super(Comment, self).to_dict()
		d['key'] = self.key.id()
		d['blogKey'] = self.blogKey.id()
		return d
