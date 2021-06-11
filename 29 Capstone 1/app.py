"""Flask app 24.5"""
from flask import Flask, send_from_directory, request, redirect, render_template, flash, jsonify, session, g 
from flask_debugtoolbar import DebugToolbarExtension
from models import User, connect_db, db, Game, Player
#from forms import RegisterUserForm, LoginForm, FeedbackForm, PasswordForm
from flask_sqlalchemy import SQLAlchemy
from secrets import SECRET_KEY, DB_USER, DB_PASSWORD, DB_PORT
from forms import RegisterForm, LoginForm, NewGameForm
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)

app.config['TESTING'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@localhost:{DB_PORT}/stocksgame'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = SECRET_KEY
CURR_USER_KEY = "user_key"

connect_db(app)

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        user = User.query.get(session[CURR_USER_KEY])
        if user:
            g.user = user
        else:
            redirect("/")
    else:
        g.user = None

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
    return render_template("index.html", user = g.user)
    

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    """ User login form """
    form = LoginForm()
    if form.validate_on_submit():
        user = User.authenticate(form.email.data, form.password.data)
        if user:
            login_user(user)
            return redirect('/')
        else:
            flash("Invalid e-mail or password!")

    return render_template("login.html", form=form)

@app.route('/games', methods=['GET'])
def games_page():
    return render_template("games.html", user = g.user)

@app.route('/newgame', methods=['GET', 'POST'])
def new_game_form():
    form = NewGameForm()

    if form.validate_on_submit():
        game = Game.generate_game(
            hours = form.hours.data,
            days = form.days.data,
            minutes = form.minutes.data,
        )

        game.host_id = g.user.id

        form.populate_obj(game)
        db.session.add(game)
        db.session.commit()
        return redirect(f'/games/{game.id}/join', 307)
        
    return render_template("newgame.html", form=form)

@app.route('/games/<game_id>/join', methods=['POST'])
def join_game(game_id):
    """Attempt to join the game. """
    game = Game.query.get(game_id)
    if game:
        game.add_player(g.user)
        return redirect(f'/games/{game.id}')
    
    flash("Invalid game session.")
    return redirect('/games')

@app.route('/games/<game_id>', methods=['GET'])
def view_game(game_id):
    """View Game Page"""
    game = Game.query.get(game_id)
    if game:
        return render_template('game.html', user = g.user, game = game)

    flash("Invalid game session.")
    return redirect('/games')
        


@app.route('/register', methods=['GET', 'POST'])
def register_page():
    """ User registration form """
    form = RegisterForm()
    if form.validate_on_submit():
        try:
            user = User.register(displayname = form.displayname.data, email = form.email.data, password = form.password.data)
            db.session.add(user)
            db.session.commit()
            flash("Good work buddy")
            return redirect('/')
        except IntegrityError:
            flash("There's already an account under that e-mail address!", 'danger')
            return render_template("register.html", form=form)

    return render_template("register.html", form=form)

def login_user(user):
    """ Saves the user to the session """
    session[CURR_USER_KEY] = user.id