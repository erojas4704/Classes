"""Blogly application."""

from flask import Flask, send_from_directory, request, redirect, render_template, flash
from models import db, connect_db, User

app = Flask(__name__)
app.config['SQLALCipHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "d909837e7ea4525d004cac5ed07795ff"

connect_db(app)
db.create_all()

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path,mimetype='text/css')

@app.route('/')
def index():
    users = User.query.all()
    print(users)
    return render_template("index.html", users=users)

@app.route('/users')
def page_users():
    users = User.query.all()
    return render_template("users.html", users=users)

@app.route('/new_user')
def page_new_user():
    return render_template("new_user.html", prompt="New User")

@app.route('/make_user', methods=['POST'])
def make_user():
    working_id = request.form.get("id")
    print(f" ID {working_id}")

    if working_id:
        target_user = User.query.get(working_id)
    else:
        target_user = User()

    target_user.first_name = request.form.get("first_name")
    target_user.last_name = request.form.get("last_name")
    target_user.image_url = request.form.get("image_url")
    db.session.add(target_user)

    db.session.commit()

    return redirect(f"/profile/{target_user.id}")

@app.route('/profile/<user_id>')
def profile(user_id):
    user = User.query.get(user_id)

    return render_template("profile.html", user=user)

@app.route('/edit_user/<user_id>')
def edit_user(user_id):
    user = User.query.get(user_id)
    return render_template("new_user.html", user=user, prompt=f"Editing User {user.first_name} {user.last_name}")

@app.route('/delete_user/<user_id>', methods=['POST'])
def delete_user(user_id):
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()

    flash("That user is no more :( .")
    return redirect("/")
    

@app.route('/test')
def test():
    cunt = User()
    cunt.first_name = "Cunt"
    cunt.last_name = "Mitchells"
    cunt.image_url = "nothing der"

    db.session.add(cunt)
    db.session.commit()
    return render_template("index.html")
