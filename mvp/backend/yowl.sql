DROP DATABASE IF EXISTS yowl_db;
CREATE DATABASE yowl_db;
USE yowl_db;

-- 1. Création de l'utilisateur système Calgar
CREATE USER IF NOT EXISTS 'calgar'@'localhost' IDENTIFIED BY 'ultramar';
GRANT ALL PRIVILEGES ON yowl_db.* TO 'calgar'@'localhost';
FLUSH PRIVILEGES;

-- 2. Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tables des Médias avec Descriptions
CREATE TABLE Serie (
    id_serie INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    picture VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Livre (
    id_livre INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100),
    description TEXT NOT NULL,
    picture VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Film (
    id_film INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    director VARCHAR(100),
    description TEXT NOT NULL,
    picture VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Jeu_video (
    id_jeu INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    platform VARCHAR(100),
    description TEXT NOT NULL,
    picture VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des avis/reviews
CREATE TABLE Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    media_type ENUM('film', 'serie', 'livre', 'jeu') NOT NULL,
    media_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (user_id, media_type, media_id)
);

CREATE TABLE IF NOT EXISTS user_media_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  media_type ENUM('film','serie','livre','jeu') NOT NULL,
  media_id INT NOT NULL,
  status ENUM('seen','to_see') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq (user_id, media_type, media_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password_hash, picture) 
VALUES ('Test', 'test@test.com', 'test1234', 'calgar_avatar.png');


-- 5. INSERTION DES MÉDIAS AVEC DESCRIPTIONS COMPLÈTES
INSERT INTO Livre (title, author, description, picture) 
VALUES (
    'Alice au pays des merveilles', 
    'Lewis Carroll', 
    'Alice tombe dans un terrier de lapin et découvre un monde fantastique peuplé de créatures étranges et de règles absurdes.', 
    'alice.jpg'
);

INSERT INTO Film (title, director, description, picture) 
VALUES (
    'Pirates des Caraïbes', 
    'Gore Verbinski', 
    'Le forgeron Will Turner fait équipe avec le pirate excentrique Jack Sparrow pour sauver son amour des pirates maudits.', 
    'pirates.jpg'
);

INSERT INTO Serie (title, description, picture) 
VALUES (
    'Breaking Bad', 
    'Un professeur de chimie atteint d un cancer s associe à un ancien élève pour fabriquer et vendre de la méthamphétamine.', 
    'breaking_bad.jpg'
);

INSERT INTO Jeu_video (title, platform, description, picture) 
VALUES (
    'Crash Bandicoot: Twinsanity', 
    'PS2 / Xbox', 
    'Crash et son ennemi juré le Dr. Neo Cortex doivent s unir pour sauver leur monde d une menace venue d une autre dimension.', 
    'crash.jpg'
);

INSERT INTO Reviews (user_id, media_type, media_id, rating, comment)
VALUES (1, 'livre', 1, 5, 'Chef-d\'oeuvre de la littérature fantastique !');

USE yowl_db;
DELETE FROM Jeu_video;
INSERT INTO Jeu_video (id_jeu, title, platform, description, picture) 
VALUES (1, 'Crash Twinsanity', 'PS2', 'Crash et Cortex font équipe.', 'crash.jpg');
 
-- Test user (plain password)
INSERT INTO users (username, email, password_hash)
VALUES ('testuser', 'test@test.com', 'password123');

INSERT INTO user_media_list (user_id, media_type, media_id, status)
VALUES
(1, 'serie', 1, 'seen'),
(1, 'livre', 1, 'to_see');


-- End of seed data