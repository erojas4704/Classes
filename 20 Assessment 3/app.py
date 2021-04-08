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

    if not is_form_valid(request.args):
        flash("Make sure all fields are filled")
        return redirect("/")

    currency_from = request.args.get('from')
    currency_to = request.args.get('to')
    amount = float(request.args.get('amount'))

    codes = CurrencyCodes()
    
    
    if not is_code_valid(currency_from) or not is_code_valid(currency_to):
        flash_invalid_currencies(currency_from, currency_to)
        return redirect("/")

        print("party over here")

    result = run_conversion(currency_from, currency_to, amount)
    token = codes.get_symbol(currency_to)
    token_from = codes.get_symbol(currency_from)

    return render_template("/result.html", token=token, result=result, token_from=token_from, amount=amount)

def is_code_valid(currency_code):
    codes = CurrencyCodes()
    return not codes.get_symbol(currency_code) is None

def flash_invalid_currencies(currency_from, currency_to):
    codes = CurrencyCodes()
    if codes.get_symbol(currency_from) is None:
        flash(f'Currency "{currency_from}" is invalid')
    if codes.get_symbol(currency_to) is None:
        flash(f'Currency "{currency_to}" is invalid')

def is_form_valid(form):
    '''Makes sure every field in the form has a value. Returns False if it doesn't'''
    for key in form.keys():
        if form[key] == None or len(form[key].strip()) == 0:
            return False
    return True

def run_conversion(currency_from, currency_to, amount):
    rates = CurrencyRates()
    return rates.get_rate(currency_from, currency_to) * amount
