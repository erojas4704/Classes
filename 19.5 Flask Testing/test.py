from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):
    
    def setUp(self):
        """pre Test"""
        self.client = app.test_client()
        app.config['TESTING'] = True
        self.client.get('/newgame')
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
    
    def tearDown(self):
        """post Test"""
        self.client.get('/endgame')

    def test_a_get(self):
        with app.test_client() as client:
            client.get('/game')

            with client.session_transaction() as trans:
                trans['board'] =   [['f','a','c','e','a'],
                                    ['f','a','c','e','a'],
                                    ['f','a','c','e','a'],
                                    ['f','a','c','e','a'],
                                    ['f','a','c','e','a']]


        data = self.client.get('/guess?guess=face')
        self.assertEqual(data.json['result'], "ok")
        self.assertEqual(trans["score"], 4)


    def test_gibberish(self):
        """Check if the game allows gibberish"""
        data = self.client.get('/guess?guess=apunchunboombamboo')
        self.assertEqual(data.json['result'], "not-word")
    
    def test_nonexitent(self):
        """Check if the game allows shit not on the board"""
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [ ['a','a','a','a','a'],['a','a','a','a','a'],['a','a','a','a','a'],['a','a','a','a','a'],['a','a','a','a','a']]
            
            data = self.client.get('/guess?guess=bamboo')
            self.assertEqual(data.json['result'], "not-on-board")


    #def nonexistent():
    #    """Check if the game allows shit not on the board"""
    #    a