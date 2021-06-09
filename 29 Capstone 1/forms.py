from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email, Length, EqualTo, InputRequired

class RegisterForm(FlaskForm):
    """Form for registering."""

    displayname = StringField('Display Name', validators=[DataRequired(Length(min=6))])
    email = EmailField('E-mail', validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[InputRequired(), EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField("Confirm Password", validators=[InputRequired()])
