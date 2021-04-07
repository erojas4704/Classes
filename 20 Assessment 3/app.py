#Start: 11:20 PM 
#End: 11:48 PM

#Start 5 PM

from flask import Flask, jsonify, request, render_template, redirect, flash, session
from forex_python.converter import CurrencyRates, CurrencyCodes

app = Flask(__name__)
app.config['SECRET_KEY'] = "d909837e7ea4525d004cac5ed07795ff"

@app.route('/')
def index():
    return render_template("/forex.html")

@app.route('/rate')
def rate():

    if not is_form_valid(request.form):
        flash("Make sure all fields are filled")
        return redirect("/")

    currency_from = request.args.get('from')
    currency_to = request.args.get('to')
    amount = float(request.args.get('amount'))


    codes = CurrencyCodes()

    try:
        result = runConversion(currency_from, currency_to, amount)

        token = codes.get_symbol(currency_to)
        token_from = codes.get_symbol(currency_from)

        return render_template("/result.html", token=token, result=result, token_from=token_from, amount=amount)
    except:
        if codes.get_symbol(currency_from) is None:
            flash(f'Currency "{currency_from}" is invalid')
        if codes.get_symbol(currency_to) is None:
            flash(f'Currency "{currency_to}" is invalid')
        return redirect("/")

def is_form_valid(form):
    for key in form.keys():
        if len(key) == 0:
            return False
    return True

def runConversion(currency_from, currency_to, amount):
    rates = CurrencyRates()
    return rates.get_rate(currency_from, currency_to) * amount
