"""Blogly application."""

from flask import Flask, send_from_directory, request, redirect, render_template, flash
from models import Tag, db, connect_db, User, Post

app = Flask(__name__, static_folder="static")
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
    tags = Tag.query.all()

    print(f"GOT TAGS {tags}")
    return render_template("index.html", users=users, tags=tags)

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
    posts = Post.query.filter_by(author_id = user_id)

    return render_template("profile.html", user=user, posts=posts)

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
    
@app.route('/post/new/<user_id>', methods=['GET'])
def page_post(user_id):
    user = User.query.get(user_id)
    tags = Tag.query.all()
    return render_template("new_post.html", user=user, tags=tags)

@app.route('/post/new/<user_id>', methods=['POST'])
def save_post(user_id):
    """Create a new post"""
    working_id = request.form.get("id")

    if working_id:
        new_post = Post.query.get(working_id)
    else:
        new_post = Post()

    tags = request.form.getlist("tag")

    new_post.title = request.form.get("title")
    new_post.body = request.form.get("body")
    new_post.tags = Tag.query.filter(Tag.id.in_(tags)).all()

    print(new_post.tags)
    new_post.author_id = user_id
    db.session.add(new_post)
    db.session.commit()
    return redirect(f"/post/view/{new_post.id}")

@app.route('/post/view/<post_id>')
def view_post(post_id):
    post = Post.query.get(post_id)
    user = User.query.get(post.author_id)
    return render_template("post.html", post = post, user = user)

@app.route('/post/edit/<post_id>')
def edit_post(post_id):
    post = Post.query.get(post_id)
    user = User.query.get(post.author_id)
    tags = Tag.query.all()

    return render_template("new_post.html", post = post, user = user, tags=tags)

@app.route('/post/delete/<post_id>', methods=['POST'])
def delete_post(post_id):
    post = Post.query.get(post_id)
    author_id = post.author_id
    db.session.delete(post)
    db.session.commit()
    flash("BALETED")
    return redirect(f"/profile/{author_id}")

@app.route('/tags/create', methods=['GET'])
def page_create_tag():
    return render_template("new_tag.html")

@app.route('/tags/new/', methods=["POST"])
def create_tag():
    name = request.form.get('tag_name')
    working_id = request.form.get("id")

    if working_id:
        tag = Tag.query.get(working_id)
    else:
        tag = Tag()

    if Tag.query.filter_by(tag_name = name).first():
        flash(f"A tag with the name {name} already exists, dipstick")
        return redirect('/tags/create')

    tag.tag_name = name
    db.session.add(tag)
    db.session.commit()
    return redirect(f'/tags/view/{tag.id}')

@app.route('/tags/edit/<tag_id>')
def page_edit_tag(tag_id):
    tag = Tag.query.get(tag_id)
    return render_template("new_tag.html", tag=tag)

@app.route('/tags/delete/<tag_id>', methods=["POST"])
def delete_tag(tag_id):
    tag = Tag.query.get(tag_id)
    db.session.delete(tag)
    db.session.commit()
    flash("BALETED")
    return redirect(f"/")

@app.route('/tags/view/<tag_id>')
def view_tag(tag_id):
    tag = Tag.query.get(tag_id)
    return render_template("tag.html", tag = tag)


tulio = User(first_name="Tulio", last_name="Elputo")
kenton = User(first_name="Kenton", last_name="London")
db.session.add(tulio)
db.session.add(kenton)
db.session.add(
    Post(
        title="Hey Guys", 
        body="Hello! This seems like a really cool community and I'm new to the whole thing I just wanted to pop in and say hello. ",
        author_id=2
    )
)

db.session.add(Tag(tag_name="Shitpost"))
db.session.add(Tag(tag_name="Sad Life"))
db.session.add(Tag(tag_name="Waste of Time"))
db.session.add(Tag(tag_name="Twitter Cancer"))
db.session.add(Tag(tag_name="Actually Good (Joke Tag)"))
db.session.commit() 