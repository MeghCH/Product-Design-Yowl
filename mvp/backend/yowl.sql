DROP DATABASE IF EXISTS yowl_db;
CREATE DATABASE yowl_db;
USE yowl_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Jeu_video (
    id_jeu INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    platform VARCHAR(100),
    description TEXT,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Film (
    id_film INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    director VARCHAR(100),
    description TEXT,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Serie (
    id_serie INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Livre (
    id_livre INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100),
    description TEXT,
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    media_type ENUM('film', 'serie', 'livre', 'jeu') NOT NULL,
    media_id INT NOT NULL,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_media_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    media_type ENUM('film','serie','livre','jeu') NOT NULL,
    media_id INT NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE commentaire (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE playlist (
    id_playlist INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Utilisateurs
INSERT INTO users (username, email, password_hash) VALUES 
('testuser', 'test@test.com', 'password123');

-- Jeux Vidéo
INSERT INTO Jeu_video (title, platform, description, picture) VALUES 
('Crash Bandicoot: Twinsanity', 'PS2/Xbox', 'Crash and his arch-nemesis, Dr. Neo Cortex, must join forces to save their world from a threat coming from another dimension.', 'crash.jpg');

-- Films
INSERT INTO Film (title, director, description, picture) VALUES 
('Pirates of the Caribbean', 'Gore Verbinski', 'Blacksmith Will Turner teams up with the eccentric pirate Jack Sparrow to rescue his love from cursed pirates.', 'pirates.jpg');

-- Séries
INSERT INTO Serie (title, description, picture) VALUES 
('Breaking Bad', 'A chemistry teacher diagnosed with cancer partners with a former student to produce and sell an illegal drug.', 'breaking.jpg');

-- Livres
INSERT INTO Livre (title, author, description, picture) VALUES 
('Alice''s Adventures in Wonderland', 'Lewis Carroll', 'Alice falls down a rabbit hole and discovers a fantastical world filled with strange creatures and absurd rules.', 'alice.jpg');

