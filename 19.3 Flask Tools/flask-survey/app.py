from flask import Flask, request, render_template
from surveys import *

print("running")

app = Flask(__name__)
app.config['SECRET_KEY'] = "sekeret"


responses = []

@app.route('/')
def index():
    surveyNames = []

    for survey in surveys.values():
        surveyNames.append(survey.title)
        
    return render_template("index.j2", surveys=surveys.values())

    
@app.route('/survey/<survey_title>')
def survey(survey_title):
    print(f"TItle of survey is {survey_title}")
    survey = [survey for survey in surveys.values() if survey.title == survey_title][0]
    print(survey.title)
    print(f"Got survey {survey}")

    return render_template("survey.j2", survey=survey)
    

@app.route('/question/<index>')
def question(index):
    return render_template("question.j2", question=question)