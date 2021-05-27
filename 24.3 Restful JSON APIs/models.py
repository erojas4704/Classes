"""Models for Cupcake app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to Database"""
    db.app = app
    db.init_app(app)


class Cupcake(db.Model):
    """The model for the CUPCAKE"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    flavor = db.Column(db.Text, nullable=False)
    size = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float)
    image = db.Column(db.Text, default="https://tinyurl.com/demo-cupcake")