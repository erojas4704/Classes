from flask import Flask, request, render_template
from flask_debugtoolbar import DebugToolbarExtension
from stories import Story, examples

true = True
false = False

app = Flask(__name__)
app.config['SECRET_KEY'] = "sekeret"

debug = DebugToolbarExtension(app)

stories = examples

@app.route('/')
def index():
    return render_template("stories.jinja", stories=stories)


@app.route('/start/<story>')
def get_madlib(story):
    s = getStory(story)
    return render_template("start.jinja", story=s)

@app.route('/madlib/<story>')
def get_prompt(story):
    story = getStory(story)
    answers = request.args.to_dict()
    
    return render_template("madlibs.jinja", story=story.generate(answers))

def getStory(name):
    for story in stories:
        if story.name == name:
            return story