"""Flask app for Cupcakes"""

from flask import Flask, send_from_directory, request, redirect, render_template, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import Cupcake, connect_db, db
from flask_sqlalchemy import SQLAlchemy
from secrets import SECRET_KEY, DB_USER, DB_PASSWORD

app = Flask(__name__)



app.config['TESTING'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@localhost:5432/cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = SECRET_KEY

print(app.config['SQLALCHEMY_DATABASE_URI'])

connect_db(app)

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

@app.route("/api/cupcakes/<int:cupcake_id>")
def get_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake = serialize_cupcake(cupcake)
    return jsonify(cupcake = cupcake)

@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    data = request.json
    cupcake = Cupcake(
        flavor = data.get("flavor"),
        size = data.get("size"),
        rating = data.get("rating"),
        image = data.get("image")
    )
    db.session.add(cupcake)
    db.session.commit()
    return jsonify( cupcake = serialize_cupcake(cupcake) ) , 201

@app.route("/api/cupcakes/<int:cupcake_id>", methods=["DELETE"])
def delete_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify( message = "deleted"), 200
    
@app.route("/api/cupcakes/<int:cupcake_id>", methods=["PATCH"])
def edit_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    data = request.json
    cupcake.flavor = data.get("flavor") or cupcake.flavor,
    cupcake.size = data.get("size") or cupcake.size,
    cupcake.rating = data.get("rating") or cupcake.rating,
    cupcake.image = data.get("image") or cupcake.image
    db.session.commit()

    return jsonify( cupcake = serialize_cupcake(cupcake) ), 200



def serialize_cupcake(cupcake):
    """TURN IT INTO A JSON THING"""
    print(f"CREATING COOPCKAE {cupcake.id}")
    return {
        "id": cupcake.id,
        "flavor": cupcake.flavor,
        "size": cupcake.size,
        "rating": cupcake.rating,
        "image": cupcake.image
    }