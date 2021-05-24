"""Models for Blogly."""
from datetime import date
from flask_sqlalchemy import SQLAlchemy

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

    image_url = db.Column(db.String(), nullable=True, default = "/static/avatar_none.jpg")
    posts = db.relationship('Post', backref="user", cascade="all, delete-orphan")

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(80), nullable=False)
    body = db.Column(db.String(240), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default = date.today())
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class PostTag(db.Model):
    __tablename__ = "posttags"
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False, primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), nullable=False, primary_key=True)

class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tag_name = db.Column(db.Text, nullable=False, unique=True)

    posts = db.relationship('Post',
    secondary="posttags",
    backref="tags")
