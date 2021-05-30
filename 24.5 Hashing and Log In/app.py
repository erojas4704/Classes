"""Flask app 24.5"""
from flask import Flask, send_from_directory, request, redirect, render_template, flash, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from models import User, connect_db, db, Feedback
from forms import RegisterUserForm, LoginForm, FeedbackForm, PasswordForm
from flask_sqlalchemy import SQLAlchemy
from secrets import SECRET_KEY, DB_USER, DB_PASSWORD

app = Flask(__name__)

app.config['TESTING'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@localhost:5432/flaskfeedback'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = SECRET_KEY

connect_db(app)

@app.route('/css/<path:path>')  
def send_css(path):
    """CSS Subdir"""
    return send_from_directory('css', path,mimetype='text/css')

@app.route('/')
def index():
    if session.get("user_id"):
        user = User.query.get(session['user_id'])
        return redirect(f"/users/{user.username}")
    return redirect("/login")

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterUserForm()
    
    if form.validate_on_submit():
        #Login the user and generate session["user_id"] key.
        user = User.register(
            username = form.username.data,
            password = form.password.data,
            first_name = form.first_name.data,
            last_name = form.last_name.data,
            email = form.email.data
        )
        db.session.add(user)
        db.session.commit()
        session["user_id"] = user.id
        return redirect(f"/users/{user.username}")

    return render_template("register.html", form = form)

@app.route('/secret', methods=['GET'])
def secret():
    if session.get("user_id"):
        user = User.query.get(session['user_id'])
        return render_template("secret.html", user = user)
    else:
        return redirect("/")

@app.route('/users/<username>', methods=['GET'])
def view_user(username):
    user = User.query.filter_by(username=username).first()
    #only allow users to view their own profiles
    if user:
        if user.id == session.get("user_id"):
            return render_template("user.html", user = user)
        else:
            flash("You are not authorized to view that user's profile.")
            return redirect("/"), 401
    else:
        return redirect("/")

@app.route('/users/<username>/feedback/add', methods=['GET', 'POST'])
def form_feedback(username):
    user = User.query.filter_by(username=username).first()

    if user:
        form = FeedbackForm()
        if form.validate_on_submit():
            feedback = Feedback(
                title = form.title.data,
                content = form.content.data,
                username = user.username
            )
            db.session.add(feedback)
            db.session.commit()
            return redirect(f"/users/{username}")
        
        return render_template("feedback.html", user = user, form = form)
    else:
        flash("Thou must be logged in to do that.")
        return redirect("/"), 401


@app.route('/feedback/<feedback_id>/delete', methods=['POST'])
def delete_feedback(feedback_id):
    feedback = Feedback.query.get_or_404(feedback_id)
    user = User.query.get(session.get("user_id"))

    if feedback.user.id != user.id: #Check to see if we made this post. TODO Add a condition for admin level users.
        flash("You can't delete somebody else's post, dipstick!")
        return redirect("/")
    
    db.session.delete(feedback)
    db.session.commit()
    flash("The post was baleted")
    return redirect("/")

@app.route('/feedback/<feedback_id>/update', methods=['POST', 'GET'])
def update_feedback(feedback_id):
    feedback = Feedback.query.get_or_404(feedback_id)
    user = User.query.get(session.get("user_id"))
    form = FeedbackForm( obj = feedback )

    if feedback.user.id != user.id: #Check to see if we made this post. TODO Add a condition for admin level users.
        flash("You can't edit somebody else's post, dipstick!")
        return redirect("/")
    
    if form.validate_on_submit():
        feedback.title = form.title.data
        feedback.content = form.content.data
        db.session.commit()
        return redirect(f"/users/{user.username}")
    
    return render_template("feedback.html", user = user, form = form)


@app.route('/users/<username>/delete', methods=['GET', 'POST'])
def delete_user(username):
    user = User.query.filter_by(username=username).first()
    if user:
        form = PasswordForm()
        password = form.password.data
        if form.validate_on_submit():
            if User.authenticate(username, password):
                session.pop("user_id")
                db.session.delete(user)
                db.session.commit()
                flash("User has been deleted.")
                return redirect("/")
            else:
                flash("Invalid password, loser.")
                return render_template("delete.html", form = form)
        else:
            return render_template("delete.html", form = form)

    else:
        flash("Thou must be logged in to do that.")
        return redirect("/"), 401



@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = User.authenticate(username, password)

        if user:
            session["user_id"] = user.id
            return redirect(f"/users/{username}")
        else:
            flash("Invalid username or password")
            return redirect("/login")

    return render_template("login.html", form = form)
    


@app.route('/logout', methods=['POST'])
def logout():
    session.pop("user_id")
    return redirect("/")