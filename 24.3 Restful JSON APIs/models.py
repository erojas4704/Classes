"""Models for Cupcake app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to Database"""
    db.app = app
    db.init_app(app)
    #print("PINCHE GUEY MAMAGUEVO")
    #url = db.engine.url.URL.create('postgresql+psycopg2', username='flask', password='jl3j12g', host='localhost', port=5432, database='common')
    #print(f"LOOK IRA PUTO THIS IS THE URAL MIRA URL MIRA  MIRA  MIRA  MIRA  MIRA {url}")


class Cupcake(db.Model):
    """The model for the CUPCAKE"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    flavor = db.Column(db.Text, nullable=False)
    size = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Float)
    image = db.Column(db.Text, default="https://tinyurl.com/demo-cupcake")