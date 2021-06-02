"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from unittest import TestCase

from models import db, User, Message, Follows
from secrets import DB_USER, DB_PASSWORD

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@localhost:5432/warbler_test"


# Now we can import app

from app import app

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

db.create_all()


class UserModelTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""

        User.query.delete()
        Message.query.delete()
        Follows.query.delete()

        self.client = app.test_client()

    def test_user_model(self):
        """Does basic model work?"""

        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        db.session.add(u)
        db.session.commit()

        # User should have no messages & no followers
        self.assertEqual(len(u.messages), 0)
        self.assertEqual(len(u.followers), 0)
    
    def test_repr(self):
        u = User(
            email="test@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        self.assertEqual( repr(u), f"<User #{u.id}: {u.username}, {u.email}>")

    def test_is_following(self):
        u1 = User(
            email="tes4t@test.com",
            username="testuser",
            password="HASHED_PASSWORD"
        )

        u2 = User(
            email="test2@test.com",
            username="testuser2",
            password="HASHED_PASSWORD"
        )


        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()
        
        f = Follows(
            user_being_followed_id = u2.id,
            user_following_id = u1.id
        )
        
        db.session.add(f)
        db.session.commit()

        self.assertTrue(u1.is_following(u2))
        self.assertFalse(u2.is_following(u1))
        self.assertTrue(u2.is_followed_by(u1))
        self.assertFalse(u1.is_followed_by(u2))


    def test_create(self):
        u = User.signup(username="Mega Puto", email="coño@maldito.cum", password="assnuts", image_url="")
        db.session.commit()
        user = User.query.get(u.id)
        self.assertEqual(user.username, "Mega Puto")


    def test_authentication(self):
        u = User.signup(username="Mega Puto", email="coño@maldito.cum", password="assnuts", image_url="")
        db.session.commit()
        self.assertFalse(User.authenticate(u.username, "abunchi bu"))
        self.assertEqual(User.authenticate(u.username, "assnuts"), u)
        self.assertFalse(User.authenticate("Mega  Puto", "assnuts"))
        self.assertFalse(User.authenticate("Mega Putongo", "assnuts"))
