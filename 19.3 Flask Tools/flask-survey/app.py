from flask import Flask, request, render_template, redirect
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
    print(f'./survey/{survey_title}/questions/0')
    return redirect(f'{survey_title}/questions/0')

    
@app.route('/survey/<survey_title>/questions/<index>')
def question(survey_title, index):
    print('do or die')
    survey = [survey for survey in surveys.values() if survey.title == survey_title][0]
    print(survey)
    question = survey.questions[int(index)]

    print(question)
    return render_template("question.j2", question = question)

#@app.route('/survey/<survey_title>')
#def survey(survey_title):
#    survey = [survey for survey in surveys.values() if survey.title == survey_title][0]
#
#    return render_template("survey.j2", survey=survey)