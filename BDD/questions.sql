-- Active: 1759213461830@@127.0.0.1@3306@mysql
use sae_db;
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intitule TEXT NOT NULL,
    type_question VARCHAR(20) check (type_question in ('texte','choix','note')) NOT NULL,
    id_questionnaire INT NOT NULL,
    FOREIGN KEY (id_questionnaire) REFERENCES questionnaires(id) ON DELETE CASCADE
);
