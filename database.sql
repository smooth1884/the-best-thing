CREATE DATABASE thebestthing;

CREATE TABLE things
(
    id SERIAL PRIMARY KEY,
    user_id UUID,
    name VARCHAR(50),
    description VARCHAR(255),
    score_plus INT,
    score_minus INT,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE imgs
(
    img_id SERIAL PRIMARY KEY,
    user_id UUID,
    id INT NOT NULL,
    img_name TEXT NOT NULL,
    img_url TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES things(id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


--download extension for uuidv4

--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--select extensions
CREATE TABLE users
(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL,
    PRIMARY KEY (user_id)
);

