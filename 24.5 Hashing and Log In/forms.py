from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, URL, Optional, NumberRange, Email, EqualTo
from wtforms.widgets import TextArea


class RegisterUserForm(FlaskForm):
    """Form for adding Users"""

    first_name = StringField("First Name", validators=[InputRequired()], render_kw={"placeholder": "Name"})
    last_name = StringField("Last Name", validators=[InputRequired()], render_kw={"placeholder": "Last Name"})
    email = StringField("E-mail Address", validators=[InputRequired(), Email()], render_kw={"placeholder": "my_email@email.com"})
    username = StringField("Username", validators=[InputRequired()],  render_kw={"placeholder": "Username"})
    password = PasswordField("Password", validators=[InputRequired(), EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField("Confirm Password", validators=[InputRequired()])

class LoginForm(FlaskForm):
    """Form for logging in"""
    username = StringField("Username", validators=[InputRequired()],  render_kw={"placeholder": "username"})
    password = PasswordField("Password", validators=[InputRequired()],  render_kw={"placeholder": "password"})

class FeedbackForm(FlaskForm):
    """Feedback"""
    title = StringField("Title", validators=[InputRequired()],  render_kw={"placeholder": "Title"})
    content = StringField("Body", validators=[InputRequired()],  render_kw={"placeholder": "What's on your mind nerd?"}, widget=TextArea())

class PasswordForm(FlaskForm):
    """Just a password form for deletion authentication"""
    password = PasswordField("Password", validators=[InputRequired()],  render_kw={"placeholder": "password"})
