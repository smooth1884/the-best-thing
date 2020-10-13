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
    img_name text NOT NULL,
    img BYTEA NOT NULL,
    FOREIGN KEY (id) REFERENCES things(id)
);