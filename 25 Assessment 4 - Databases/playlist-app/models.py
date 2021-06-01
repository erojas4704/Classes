"""Models for Playlist app."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Playlist(db.Model):
    """Playlist."""
    __tablename__ = "playlists"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, 
        info={'label': 'Playlist Name'},
        nullable=False, 
        unique=True)
    description = db.Column(db.Text,
        info={'label': 'Description'},
        nullable=False, 
        unique=True)
    songs = db.relationship('Song',
    secondary="playlistsongs",
    backref="playlists")


class Song(db.Model):
    """Song."""
    __tablename__ = "songs"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String,
        info={'label': 'Title'}, 
        nullable=False)
    artist = db.Column(db.String,
        info={'label': 'Artist'}, 
        nullable=False)


class PlaylistSong(db.Model):
    """Mapping of a playlist to a song."""
    __tablename__ = "playlistsongs"
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), nullable=False, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), nullable=False, primary_key=True)


# DO NOT MODIFY THIS FUNCTION
def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)
    db.create_all()
