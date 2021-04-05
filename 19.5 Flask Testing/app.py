from boggle import Boggle
from flask import Flask, jsonify, request, render_template, redirect, flash, session

app = Flask(__name__)

app.config['SECRET_KEY'] = "sekeret"

boggle = Boggle()



@app.route('/')
def index():
    return render_template("index.html")

@app.route('/newgame')
def new_game():
    session["score"] = 0
    session["done"] = []
    session["board"] = boggle.make_board()
    return redirect('game')


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
    word = request.args.get('guess').lower()

    print(f" GOT {word}")
    board = session.get("board")
    done = session.get("done") or []

    result = boggle.check_valid_word(board, word)
    score = int( session.get("score") or 0)

    
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





