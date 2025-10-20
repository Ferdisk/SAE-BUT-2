-- Active: 1759213461830@@127.0.0.1@3306@mysql
use sae_db;
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    mdp_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) check (role in ('enseignant','etudiant')) NOT NULL
);

SELECT * FROM utilisateurs;