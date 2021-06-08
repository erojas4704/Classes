"""Flask app 24.5"""
from flask import Flask, send_from_directory, request, redirect, render_template, flash, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from models import User, connect_db, db
#from forms import RegisterUserForm, LoginForm, FeedbackForm, PasswordForm
from flask_sqlalchemy import SQLAlchemy
from secrets import SECRET_KEY, DB_USER, DB_PASSWORD

app = Flask(__name__)

app.config['TESTING'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@localhost:5432/stocksgame'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = SECRET_KEY

connect_db(app)

@app.route('/css/<path:path>')  
def send_css(path):
    """CSS Subdir"""
    return send_from_directory('css', path,mimetype='text/css')
    
@app.route('/js/<path:path>')  
def send_js(path):
    """JS Subdir"""
    return send_from_directory('js', path,mimetype='text/js')

@app.route('/')
def send_index():
    """Landing Page"""
    return render_template("index.html")