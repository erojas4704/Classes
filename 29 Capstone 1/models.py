"""Models """

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_bcrypt import Bcrypt
from datetime import date, timedelta
import market

db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    """Connect to Database"""
    db.app = app
    db.init_app(app)
    db.create_all()

class Stock(db.Model):
    """The model for stocks"""
    __tablename__ = 'stocks'
    symbol = db.Column(
        db.Text,
        primary_key = True,
        unique=True,
        nullable = False
    )

    open = db.Column(
        db.Float,
        default = 0
    )

    close = db.Column(
        db.Float,
        default = 0
    )

    current = db.Column(
        db.Float,
        default = 0
    )

    high = db.Column(
        db.Float,
        default = 0
    )

    low = db.Column(
        db.Float,
        default = 0
    )

    last_updated = None

    def update(self):
        """Update a stock from the remote API. TODO Only if the stock hasn't been updated in the last 5 min. """
        resp = market.quote(self.symbol.upper())

        if self.last_updated is None:
            minutes = 9999
        else:
            time_difference = date.today() - self.last_updated
            minutes = time_difference.total_seconds()/60

        if minutes < 5:
            return False


        self.current = resp['c']
        self.open = resp['o']
        self.close = resp['pc']
        self.high = resp['h']
        self.low = resp['l']
        return resp

class GameStock(db.Model):
    """Model for stocks owned by players in a game"""
    __tablename__ = 'gamestocks'
    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement=True
    )

    player_id = db.Column(
        db.Integer,
        db.ForeignKey('players.id', ondelete="cascade")
    )

    symbol = db.Column(
        db.Text,
        db.ForeignKey('stocks.symbol')
    )

    position = db.Column(
        db.Float,
        default = 0
    )


class Player(db.Model):
    """The model for the users in games. 
    This will record all game statistics for that user and game, as well."""
    __tablename__ = 'players'

    id = db.Column(
        db.Integer,
        unique = True,
        primary_key = True,
        autoincrement=True
    )

    user = relationship("User")

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key=True,
    )

    game_id = db.Column(
        db.Integer,
        db.ForeignKey('games.id', ondelete="cascade"),
        primary_key=True,
    )

    balance = db.Column(
        db.Float,
        default = 0
    )

    color = db.Column(
        db.Integer
    )

    def __repr__(self):
        return f"<{user.displayname}: {balance}>"

class Game(db.Model):
    """The model for the Game"""
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    start = db.Column(db.DateTime, nullable=False)
    end = db.Column(db.DateTime, nullable=False)
    starting_balance = db.Column(db.Float, nullable=False)
    max_players = db.Column(db.Integer, nullable=False)
    fractional_shares = db.Column(db.Boolean)
    password = db.Column(db.Text)

    host_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id')
    )

    players = relationship(
        "Player"
    )

    users = relationship(
        "User",
        secondary="players"
    )

    def get_player(self, user):
        """Get the game's player reference from a global user"""
        return Player.query.filter(User.id == user.id, Game.id == self.id).first()

    def add_player(self, user, password = None):
        """Add player to the game if a player isn't already in the game and the password is correct"""
        if self.password is None or password == self.password:
            if user not in self.players:
                self.users.append(user)
                player = self.get_player(user)
                player.balance = self.starting_balance
                db.session.commit()
                return True
        
        return False



    @classmethod
    def generate_game(cls, minutes, hours, days):
        """Given a duration, creates a game and automatically sets the start time to be now and end time to be start time + the duration."""
        start = date.today()
        end = start + timedelta(
            days=days,
            minutes=minutes,
            hours=hours
        )
        

        return Game(start = start, end = end)



class User(db.Model):
    """The model for the User"""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    email = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    displayname = db.Column(db.Text, nullable=False, unique=True)

    avatar_url = db.Column(
        db.Text
    )
    
    games = db.relationship(
        "Game",
        secondary="players",
        primaryjoin=(Player.user_id == id),
    )



    @classmethod
    def register(cls, email, displayname, password):
        """static method for user registration. Returns the instance of the user registered."""
        hashed_pw = bcrypt.generate_password_hash(password = password)
        buffer_pw = hashed_pw.decode('utf-8')

        return User(
            displayname = displayname,
            password = buffer_pw,
            email = email)
            
    @classmethod
    def authenticate(cls, email, password):
        """Authenticates user using Bcrypt"""
        print("OK ")
        user = User.query.filter_by(email=email).first()
        
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

    def __repr__(self):
        return f"<User #{self.email}: {self.displayname}>"

