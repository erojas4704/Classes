from flask import Flask, send_from_directory, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from forms import AddPetForm

from models import Pet, connect_db, db

app = Flask(__name__)

app.config['TESTING'] = True
app.config['SQLALCipHEMY_DATABASE_URI'] = 'postgresql:///pets'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "d909837e7ea4525d004cac5ed07795ff"

connect_db(app)
db.create_all()

app.debug = True
app.config['SECRET_KEY'] = '566F532D486C947709D3D0E6B7575AF8380248DB66DADA211D58EB00AD585297'
toolbar = DebugToolbarExtension(app)

@app.route('/css/<path:path>')
def send_css(path):
    """CSS Subdir"""
    return send_from_directory('css', path,mimetype='text/css')

@app.route('/')
def index():
    """Home. Show pet listing and whatever."""
    pets = Pet.query.all()
    return render_template("index.html", pets=pets)

@app.route('/pets/new', methods=['GET', 'POST'])
def add_pet():
    """Add pet route"""
    form = AddPetForm()
    
    if form.validate_on_submit():
        name = form.name.data
        species = form.species.data
        photo_url = form.photo_url.data or None
        age = form.age.data
        notes = form.notes.data
        available = form.available.data
        db.session.add(Pet(
            name = name,
            species = species,
            photo_url = photo_url,
            notes = notes,
            available = available,
            age = age
        ))
        db.session.commit()
        flash("ADDED NEW DOG")
        return redirect('/')
        
    return render_template("form_new_pet.html", form=form)

@app.route('/pets/view/<int:pet_id>', methods=['GET'])
def view_pet(pet_id):
    """View pet route"""
    pet = Pet.query.get_or_404(pet_id)
    return render_template("view_pet.html", pet=pet)

@app.route('/pets/edit/<int:pet_id>', methods=['GET', 'POST'])
def edit_pet(pet_id):
    """Edit pet route"""
    pet = Pet.query.get_or_404(pet_id)
    form = AddPetForm(obj=pet)

    if form.validate_on_submit():
        pet.name = form.name.data
        pet.species = form.species.data
        pet.photo_url = form.photo_url.data or None
        pet.age = form.age.data
        pet.notes = form.notes.data
        pet.available = form.available.data
        db.session.commit()
        flash("EDIDTED? ? ? ?@#")
        return redirect('/')
        
    return render_template("form_new_pet.html", form=form, edit_mode=True)

db.session.add(Pet(name="The Ratscallion", species="Chinchilla", available=False, photo_url="https://cdn.discordapp.com/attachments/830048840421343245/830526655209799680/IMG_5569.jpg"))
db.session.add(Pet(name="Patrick", species="CAT", photo_url="https://i.imgur.com/6Mzeyvn.png"))
db.session.add(Pet(name="Rouge the Bat", species="DOG", photo_url="https://pbs.twimg.com/profile_images/1256750221733830656/fulROGop_400x400.jpg"))
db.session.add(Pet(name="Billy", species="DOG"))
db.session.add(Pet(name="Sparkling Wiggles", species="DOG"))
db.session.add(Pet(name="Eddie", species="GOD"))
db.session.add(Pet(name="Fat Cat", species="CAT"))
db.session.commit()