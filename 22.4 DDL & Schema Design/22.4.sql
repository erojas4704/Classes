-- MEDICAL CENTER

DROP DATABASE IF EXISTS medical_center;

CREATE DATABASE medical_center;

\c medical_center

CREATE TABLE patients(
    id SERIAL PRIMARY KEY,
    first_name TEXT DEFAULT 'John',
    last_name TEXT DEFAULT 'Doe'
);

CREATE TABLE doctors(
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT
);

CREATE TABLE visits(
    id SERIAL PRIMARY KEY,
    date Date NOT NULL,
    patient_id INTEGER REFERENCES patients ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES doctors ON DELETE CASCADE
);

CREATE TABLE diagnosis(
    id SERIAL PRIMARY KEY,
    visit_id INTEGER REFERENCES visits ON DELETE CASCADE,
    disease TEXT NOT NULL
);

-- CRAIGSLIST

DROP DATABASE IF EXISTS craigslist;

CREATE DATABASE craigslist;

\c craigslist;

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    preferred_region INTEGER REFERENCES regions,
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    user_id INTEGER REFERENCES users,
    region_id INTEGER REFERENCES regions,
    category_id INTEGER REFERENCES categories
);

CREATE TABLE regions(
    id SERIAL PRIMARY KEY,
    region_name TEXT NOT NULL
);

--SOCCER LEAGUE

DROP DATABASE IF EXISTS soccer_league;

CREATE DATABASE soccer_league;

CREATE TABLE teams(
    id SERIAL PRIMARY KEY,
    team_name TEXT,
    standing UNIQUE INTEGER,
);


CREATE TABLE goals(
    id SERIAL PRIMARY KEY,
    date DATE,
    player_id INTEGER REFERENCES players ON DELETE CASCADE,
    game_id INTEGER REFERENCES matches ON DELETE CASCADE
);

CREATE TABLE matches(
    id SERIAL PRIMARY KEY,
    date DATE,
    team1_id INTEGER REFERENCES teams ON DELETE CASCADE,
    team2_id INTEGER REFERENCES teams ON DELETE CASCADE
);

CREATE TABLE seasons(
    id SERIAL PRIMARY KEY,
    start DATE NOT NULL,
    end DATE NOT NULL
);