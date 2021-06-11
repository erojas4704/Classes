
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_bcrypt import Bcrypt
from datetime import date, timedelta
from models import db, User, Stock

db.drop_all()
db.create_all()

#try: 
#    db.session.add(
#        User.register("kenton_porner@gmail.com", "Kenton", "123456")
#    )
#except:
#    print("User already exists")

db.session.add(Stock(symbol="AAPL"))
db.session.add(Stock(symbol="AMC"))
db.session.add(Stock(symbol="AMZN"))
db.session.add(Stock(symbol="FB"))
db.session.add(Stock(symbol="GME"))
db.session.add(Stock(symbol="GE"))
db.session.add(Stock(symbol="GOOGL"))
db.session.add(Stock(symbol="NVDA"))
db.session.commit()