from flask import Flask

app = Flask(__name__)

@app.route('/welcome')
def welcome():
    """Return "Welcome" Page """
    html = "<html><body><h1>Welcome</h1></body></html>"
    return html
    
@app.route('/welcome/back')
def welcome_back():
    """Return "Welcome Back" Page """
    html = "<html><body><h1>Welcome Back!</h1></body></html>"
    return html
    
@app.route('/welcome/home')
    """Return "Welcome Home" Page """
def welcome_home():
    html = "<html><body><h1>Welcome home.</h1></body></html>"
    return html
    
