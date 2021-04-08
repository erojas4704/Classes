from unittest import TestCase
from app import app, run_conversion, is_code_valid, is_form_valid

class FlaskTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
    
    def tearDown(self):
        return

    def test_conversion(self):
        self.assertEqual(run_conversion("USD", "USD", 5), 5)
        self.assertEqual(run_conversion("EUR", "EUR", 5), 5)

    def test_page(self):
        resp = self.client.get('/rate?from=USD&to=USD&amount=500')
        
        html = resp.get_data(as_text=True)

        self.assertEqual(resp.status_code, 200)
        self.assertIn("$500", html)
        return


    def test_bad_inputs(self):
        '''
        I should be redirected to the index page if my inputs are invalid.
        '''
        resp = self.client.get('/rate?from=BUFF&to=GOARRK&amount=999')
        self.assertEqual(resp.location, "http://localhost/")

        with self.client.session_transaction() as session:
            flash_message = dict(session['_flashes']).get("message")

            self.assertNotEqual(flash_message, None)
            
            resp = self.client.get('/rate?from=ass&to=ass&amount=999')
            self.assertEqual(resp.location, "http://localhost/")
            self.assertIn("invalid", flash_message)

            resp = self.client.get('/rate?from=ass&to=ass&amount=999')
            self.assertIn("invalid", flash_message)
        
    def test_bad_codes(self):
        '''
        Tests invalid currency codes
        '''
        self.assertEqual(is_code_valid("ASS"), False)
        self.assertEqual(is_code_valid("BULO"), False)
        self.assertEqual(is_code_valid("ASSBIE"), False)
        self.assertEqual(is_code_valid("BPOOT"), False)
        self.assertEqual(is_code_valid("USD"), True)
        self.assertEqual(is_code_valid("EUR"), True)

    def test_form_validation(self):
        '''
        Makes sure the form has all values filled.
        '''
        self.assertEqual(is_form_valid({
            'avery': '', 
            'Leticia': None, 
            'Mike': "Bilo"
            }), False)
            
        self.assertEqual(is_form_valid({
            'avery': '45', 
            'Leticia': "Barriguite", 
            'Mike': "Bilo"
            }), True)

        self.assertEqual(is_form_valid({
            'avery': '  ', 
            'Leticia': '  ', 
            'Mike': '  '
            }), False)
            
        self.assertEqual(is_form_valid({
            'avery': None, 
            'Leticia': None, 
            'Mike': None
            }), False)
            


