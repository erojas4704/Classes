from logging import error
from flask import Flask, request, render_template, redirect, flash, session
from surveys import *


app = Flask(__name__)
app.config['SECRET_KEY'] = "sekeret"

@app.route('/')
def index():
    surveyNames = []

    session['responses'] = []

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

    responses = session['responses']
    numResponses = len(responses)
    
    if(int(index) > numResponses):
        flash("Nice try wise guy")
        print(f'Index {index} / {numResponses}')
        numResponses = len(session['responses'])
        return redirect(f'/survey/{survey_title}/questions/{ numResponses }')

        
    question = survey.questions[int(index)]

    return render_template("question.j2", question = question, title=survey_title)
    

@app.route('/answer', methods=['POST'])
def answer():
    title = request.form['survey_title']
    responses = session['responses']
    numResponses = len(responses)

    try:
        answer = request.form['answer']
    except BaseException:
        flash("You gotta actually put an answer dude")
        return redirect(f'/survey/{title}/questions/{numResponses}')

    responses.append(answer)
    session['responses'] = responses
    numResponses = len(responses)
    
    survey = getSurveyByTitle(title)

    if(len(session['responses']) >= len(survey.questions)):
        request.form['survey_title']
        return redirect(f'/survey/{title}/done')

    numResponses = len(session['responses'])
    return redirect(f'/survey/{title}/questions/{numResponses}')

@app.route('/survey/<survey_title>/done')
def done(survey_title):
    survey = getSurveyByTitle(survey_title)
    return render_template('done.j2', survey=survey)


def getSurveyByTitle(title):
    survey = [survey for survey in surveys.values() if survey.title == title][0]
    return survey


#@app.route('/survey/<survey_title>')
#def survey(survey_title):
#    survey = [survey for survey in surveys.values() if survey.title == survey_title][0]
#
#    return render_template("survey.j2", survey=survey)