from flask import Flask, render_template, request, jsonify
from math import isnan
from datetime import date

app = Flask(__name__)


@app.route("/")
def homepage():
    """Show homepage."""

    return render_template("index.html")

@app.route("/api/get-lucky-num", methods=["POST"])
def get_lucky_num():
    name = request.form.get('name')
    errors = {}

    if len( name ) < 1 or name is None:
        errors["name"] = "This field is required."

    year = request.form.get('year')

    if isnan( year ):
        errors["year"] = "Invalid year."
    
    elif year < 1900:
        errors["year"] = "Nobody that old would waste time on this."
    
    elif year > date.today() > year:
        errors["year"] = "Year cannot be in the future."
        
    email = request.form.get('email')
    if len( email ) < 1 or name is None:
        errors["email"] = "This field is required."

    color =  request.form.get('color')
    color = color.lower()

    if color != "red" or color != "orange" or color != "blue" or color != "green":
        errors["color"] = "Invalid value, must be one of: red, green, orange, blue."
    
    if errors:
        return jsonify(errors)

    return jsonify({"test": "SUCCESS"})
