from logging import error
from flask import Flask, request, render_template, redirect, flash
from surveys import *
from pprint import pprint

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
    survey = getSurveyByTitle(survey_title)
    
    if(int(index) > len(responses)):
        flash("Nice try wise guy")
        return redirect(f'/survey/{survey_title}/questions/{len(responses)}')

        
    question = survey.questions[int(index)]

    print(question)
    return render_template("question.j2", question = question, title=survey_title)
    

@app.route('/answer', methods=['POST'])
def answer():
    try:
        title = request.form['survey_title']
        answer = request.form['answer']
    except BaseException:
        flash("You gotta actually put an answer")
        return redirect(f'/survey/{title}/questions/{len(responses)}')

    responses.append(answer)
    
    survey = getSurveyByTitle(title)

    if(len(responses) >= len(survey.questions)):
        return redirect('/{title}/done')

    return redirect(f'/survey/{title}/questions/{len(responses)}')

@app.route('<survey_title>/done')
def done(survey_title):
    survey = getSurveyByTitle(survey_title)
    return render_template('done.j2', responses, survey)


def getSurveyByTitle(title):
    survey = [survey for survey in surveys.values() if survey.title == title][0]
    return survey


#@app.route('/survey/<survey_title>')
#def survey(survey_title):
#    survey = [survey for survey in surveys.values() if survey.title == survey_title][0]
#
#    return render_template("survey.j2", survey=survey)