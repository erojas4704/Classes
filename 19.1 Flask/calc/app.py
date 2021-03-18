# Put your app in here.
from flask import Flask
from flask import request
from operations import *

app = Flask(__name__)

ops = {
    "add": add,
    "sub": sub,
    "div": div,
    "mult": mult
}

@app.route('/add')
def add_page():
    a = int(request.args["a"])
    b = int(request.args["b"])
    result = add(a, b)
    return str(result)

@app.route('/sub')
def minus_page():
    a = int(request.args["a"])
    b = int(request.args["b"])
    result = sub(a,b)
    return str(result)

@app.route('/div')
def divide_page():
    a = int(request.args["a"])
    b = int(request.args["b"])
    result = div(a,b)
    return str(result)

@app.route('/mult')
def multiply_page():
    a = int(request.args["a"])
    b = int(request.args["b"])
    result = mult(a,b)
    return str(result)

@app.route('/math/<operation>')
def do_math(operation):
    a = int(request.args["a"])
    b = int(request.args["b"])
    result = ops[operation](a, b)
    return str(result)