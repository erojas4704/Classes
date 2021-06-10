"""Exposes methods for retrieving and handling stock market data."""
import requests
from secrets import API_KEY

r = requests.get('https://finnhub.io/api/v1/search?q=apple&token=c30l912ad3i9gms5vfs0')



def quote(symbol):
    """Using a stock's symbol, return a dict containing pricing for the stock"""
    resp = requests.get(f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}')
    return resp.json()