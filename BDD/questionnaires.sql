-- Active: 1759213461830@@127.0.0.1@3306@mysql
use sae_db;

CREATE TABLE questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_prof INT NOT NULL,
    FOREIGN KEY (id_prof) REFERENCES utilisateurs(id) ON DELETE CASCADE
);