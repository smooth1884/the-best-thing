CREATE DATABASE thebestthing;

CREATE TABLE things
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    score_plus INT,
    score_minus INT
);

CREATE TABLE imgs
(
    img_id SERIAL PRIMARY KEY,
    id INT NOT NULL,
<<<<<<< HEAD
    img_name text NOT NULL,
    img_url text NOT NULL,
=======
    img_name TEXT NOT NULL,
    img_url TEXT NOT NULL,
>>>>>>> tmp
    FOREIGN KEY (id) REFERENCES things(id)
);