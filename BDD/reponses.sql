-- Active: 1759213461830@@127.0.0.1@3306@mysql
use sae_db;
CREATE TABLE reponses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_question INT NOT NULL,
    id_etudiant INT NOT NULL,
    contenu TEXT NOT NULL,
    date_reponse TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_question) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (id_etudiant) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
