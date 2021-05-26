"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

def connect_db(app):
    """Connect to Database"""
    db.app = app
    db.init_app(app)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    image_url = db.Column(db.String(), nullable=True)

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(80), nullable=False)
    body = db.Column(db.String(240), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default = date.today())
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('Author', backref="users")
    
