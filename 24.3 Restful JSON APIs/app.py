"""Flask app for Cupcakes"""

from flask import Flask, send_from_directory, request, redirect, render_template, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import Cupcake, connect_db, db
from secrets import secret_key

app = Flask(__name__)

app.config['TESTING'] = True
app.config['SQLALCipHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = secret_key

connect_db(app)
db.create_all()



@app.route('/css/<path:path>')
def send_css(path):
    """CSS Subdir"""
    return send_from_directory('css', path,mimetype='text/css')


@app.route("/api/cupcakes",  methods=['GET'])
def get_all_cupcakes():
    cupcakes = Cupcake.query.all()
    cupcakes_dict = [serialize_cupcake(c) for c in cupcakes]
    print("GOT A CAL FOR PANCAKYS")
    return jsonify(cupcakes=cupcakes_dict)

def serialize_cupcake(cupcake):
    """TURN IT INTO A JSON THING"""
    return {
        "id": cupcake.id,
        "flavor": cupcake.flavor,
        "size": cupcake.size,
        "rating": cupcake.rating,
        "image": cupcake.image
    }