from flask import Flask, render_template, request, jsonify
from math import isnan
from datetime import date
import requests
import random

app = Flask(__name__)


@app.route("/")
def homepage():
    """Show homepage."""

    return render_template("index.html")

@app.route("/api/get-lucky-num", methods=["POST"])
def get_lucky_num():
    data = request.json
    errors = {}

    year = validate_year(data.get('year'), errors)
    name = validate_name(data.get('name'), errors)
    color = validate_color(data.get('color'), errors)
    email = validate_email(data.get('email'), errors)

    if errors:
        return jsonify({'errors': errors})

    lucky_num = random.randrange(0, 100)

    resp = requests.get(f"http://numbersapi.com/{year}/year")
    data = {}

    data["year"] = year
    data["yearFact"] = resp.text
    data["number"] = lucky_num
    data["numberFact"] = requests.get(f"http://numbersapi.com/{lucky_num}/trivia").text
    #data["number"] = requests.get("http://numbersapi.com/number/trivia")
    print(data)
    return jsonify(data)

def validate_year(year, errors):
    """Checks that year is within reasonable range."""
    try:
        year = int(year)
    except:
        year = None

    if year is None:
        errors["year"] = "Invalid year."
    elif int(year) < 1900:
        errors["year"] = "Nobody that old would waste time on this."
    elif int(year) > date.today().year > year:
        errors["year"] = "Year cannot be in the future."
    return year

def validate_name(name, errors):
    """Checks that name exists."""
    if name is None or len( name ) < 1:
        errors["name"] = "This field is required."
    return name

def validate_email(email, errors):
    """Checks that email exists."""
    if email is None or len( email ) < 1:
        errors["email"] = "This field is required."
    return email

def validate_color(color, errors):
    """Checks that color exists and is one of the 4 choices, case not sensitive."""
    if color is None:
        errors["color"] = "Invalid value, must be one of: red, green, orange, blue."
    else:
        color = color.lower()

    if color not in ["red","orange","blue","green"]:
        errors["color"] = "Invalid value, must be one of: red, green, orange, blue."

    return color