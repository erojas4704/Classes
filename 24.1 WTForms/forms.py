from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, IntegerField, BooleanField
from wtforms.validators import InputRequired, URL, Optional, NumberRange, AnyOf


class AddPetForm(FlaskForm):
    """Form for adding ANIMALS"""

    name = StringField("Name", validators=[InputRequired()])
    species = StringField("Species", validators=[InputRequired(), AnyOf(['dog', 'cat', 'hare', 'chinchilla', 'god', 'human', 'porcupine', 'raccoon', 'toddler'])])
    photo_url = StringField("Image URL", render_kw={"placeholder": "http://"}, validators=[URL(), Optional()])
    age = IntegerField("Age", validators=[NumberRange(min=0, max=30, message="Must be between 0 and 30"), Optional()])
    notes = StringField("Description")
    available = BooleanField("Available")