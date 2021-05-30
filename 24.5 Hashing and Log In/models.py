"""Models """

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    """Connect to Database"""
    db.app = app
    db.init_app(app)
    db.create_all()

class User(db.Model):
    """The model for the User"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    username = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False, unique=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    feedbacks = db.relationship('Feedback', backref="user", cascade="all, delete-orphan")
    
    @classmethod
    def register(cls, username, password, email, first_name, last_name):
        hashed_pw = bcrypt.generate_password_hash(password = password)
        buffer_pw = hashed_pw.decode('utf-8')
        

        return User(
            username = username,
            password = buffer_pw,
            email = email,
            first_name = first_name,
            last_name = last_name)

    @classmethod
    def authenticate(cls, username, password):
        print("OK ")
        user = User.query.filter_by(username=username).first()
        
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

class Feedback(db.Model):
    """The model for the feedback"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.ForeignKey('user.username'))
