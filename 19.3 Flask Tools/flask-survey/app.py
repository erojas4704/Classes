from flask import Flask, request, render_template
from surveys import *

print("running")

app = Flask(__name__)
app.config['SECRET_KEY'] = "sekeret"


responses = []

@app.route('/')
def index():
    buffer = []
    for survey in surveys.items():
        buffer.append( (survey.title, survey.instructions) )

    return render_template("index.j2", surveys=buffer)

    
@app.route('/survey/<survey>')
def survey(survey_name):
    survey = surveys[survey_name]
    return render_template("survey.j2", survey=survey)
    

@app.route('/question/<index>')
def question(index):
    return render_template("question.j2", question=question)