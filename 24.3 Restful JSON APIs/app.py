"""Flask app for Cupcakes"""

from flask import Flask, send_from_directory, request, redirect, render_template, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import Cupcake, connect_db, db
from secrets import secret_key

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:yourpassword@localhost/databasename'

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

@app.route("/api/cupcakes/<int:cupcake_id>")
def get_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    cupcake = serialize_cupcake(cupcake)
    return jsonify(cupcake = cupcake)

@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    cupcake = Cupcake(
        flavor = request.form.get("flavor"),
        size = request.form.get("size"),
        rating = request.form.get("rating"),
        image = request.form.get("image")
    )
    
    return jsonify( serialize_cupcake(cupcake) )

def serialize_cupcake(cupcake):
    """TURN IT INTO A JSON THING"""
    return {
        "id": cupcake.id,
        "flavor": cupcake.flavor,
        "size": cupcake.size,
        "rating": cupcake.rating,
        "image": cupcake.image
    }

    
c1 = Cupcake(
    flavor="cherry",
    size="large",
    rating=5,
)

c2 = Cupcake(
    flavor="chocolate",
    size="small",
    rating=9,
    image="https://www.bakedbyrachel.com/wp-content/uploads/2018/01/chocolatecupcakesccfrosting1_bakedbyrachel.jpg"
)

db.session.add_all([c1, c2])
db.session.commit()