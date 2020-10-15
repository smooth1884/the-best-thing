CREATE DATABASE thebestthing;

CREATE TABLE things
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(255),
    score_plus INT,
    score_minus INT
);

CREATE TABLE imgs
(
    img_id SERIAL PRIMARY KEY,
    id INT NOT NULL,
    img_name TEXT NOT NULL,
    img_url TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES things(id)
);