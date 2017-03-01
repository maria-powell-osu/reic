import webapp2
from google.appengine.ext import ndb
# from oauth2client import client, crypt
import db_defs #Contain Classes Used By Website
import json
from google.appengine.api import oauth
from google.appengine.api import users

#from lib.oauth2client import client, crypt

class Admin(webapp2.RequestHandler):
    def get(self):
        self.response.headers.add_header('Access-Control-Allow-Origin', '*')
        user = users.get_current_user()
        raw_data = {}
        
        if user:
            logout_url = users.create_logout_url('/admin')
            raw_data["isSignedIn"] = True
            raw_data["link"] = logout_url

            if users.is_current_user_admin():
                raw_data["isSignedIn"] = True
                raw_data["isAdmin"] = True
            else:
                raw_data["isAdmin"] = False
        else:
            login_url = users.create_login_url('/admin')
            raw_data["isAdmin"] = False
            raw_data["isSignedIn"] = False
            raw_data["link"] = login_url

        self.response.write(json.dumps(raw_data))
            