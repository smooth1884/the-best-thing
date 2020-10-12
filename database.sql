CREATE DATABASE thebestthing;

CREATE TABLE things
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    description VARCHAR(255),
    score_plus INT,
    score_minus INT
);