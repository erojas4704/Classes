from unittest import TestCase
from app import app, runConversion

class FlaskTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
    
    def tearDown(self):
        return

    def test_conversion(self):
        #client.get('/rate?from=USD&to=USD&amount=5')
        self.assertEqual(runConversion("USD", "USD", 5), 5)

    def test_page(self):
        return


    def test_bad_inputs(self):
        '''
        I should be redirected to the index page if my inputs are invalid.
        '''
        resp = self.client.get('/rate?from=BUFF&to=GOARRK&amount=999')
        self.assertEqual(resp.location, "http://localhost/")

