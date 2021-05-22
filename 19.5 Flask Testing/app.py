from boggle import Boggle
from flask import Flask, jsonify, request, render_template, redirect, flash, session
from datetime import datetime, timedelta
import time

app = Flask(__name__)

app.config['SECRET_KEY'] = "d909837e7ea4525d004cac5ed07795ff"

boggle = Boggle()



@app.route('/')
def index():
    return render_template("index.html")

@app.route('/newgame')
def new_game():
    time_now = datetime.now()
    time_expires = time_now + timedelta(0, 70) #Offer a 10 second buffer 

    session["score"] = 0
    session["done"] = []
    session["board"] = boggle.make_board()
    session["expires"] = time_expires

    return redirect('/game')


@app.route('/game')
def game():
    if session.get("board"):
        board = session["board"]
    else:   
        board = boggle.make_board()
        session["score"] = 0
        session["done"] = []

    session["board"] = board

    return render_template("board.html", board=board)

@app.route('/guess')
def check_guess():
    """Submit a guess and modify the score if valid"""
    word = request.args.get('guess') or ""

    word = word.lower()
    

    print(f" GOT {word}")
    board = session.get("board")
    done = session.get("done") or []

    result = boggle.check_valid_word(board, word)
    score = int( session.get("score") or 0)

    
    if datetime.now() > session["expires"]:
        return jsonify({'result': "u outta time", 'score': score, 'state': 3})
    
    if word in done:
        return jsonify({'result': "ayo u already did that 1 smarty pants", 'score': score})
    
    if len(word) == 0:
        return jsonify({'result': "You gotta actually put a word how did you even get this far", 'score': score})

        
    if result == "ok":
        score += len(word)
        done.append(word)

        session["score"] = score
        session["done"] = done
        return jsonify({'result': result, 'score': score})
    else:
        return jsonify({'result': result, 'score': score})

        
@app.route('/expiration')
def get_expiration():
    """Get when the game session is set to expire."""
    expiration = session.get("expires")

    in_time = time.mktime(expiration.timetuple()) * 1000

    return jsonify({'expires': in_time})

@app.route('/endgame')
def endgame():
    """End the game and update the high score."""
    score = session.get("score") or 0
    highscore = session.get("highscore") or 0
    times_played = session.get("times_played") or 0

    times_played += 1
    if score > highscore:
        highscore = score
    
    session["highscore"] = highscore
    session["times_played"] = times_played
    return redirect("/results")

@app.route('/results')
def results():
    score = session.get("score")
    highscore = session.get("highscore")
    words = session.get("done")
    return render_template("results.html", score=score, highscore = highscore, words=words)
