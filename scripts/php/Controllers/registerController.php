<?php

require_once __DIR__ . '/../Models/connectDb.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $mot_de_passe = $_POST['mot_de_passe'] ?? '';
    $role = $_POST['role'] ?? 'etudiant';

    $verif = $pdo->prepare("SELECT id FROM utilisateurs WHERE email = :email");
    $verif->bindParam(':email', $email);
    $verif->execute();
    if ($verif->fetch()) {
        echo "Cet email est déjà utilisé.";
        return;
    }

    $mdp_hash = password_hash($mot_de_passe, PASSWORD_BCRYPT);

    /** @var PDO $pdo **/
    $requete = $pdo->prepare("INSERT INTO utilisateurs (email, mdp_hash, role)
        VALUES (:email, :mdp_hash, :role)
    ");
    $requete->bindParam(':email', $email);
    $requete->bindParam(':mdp_hash', $mdp_hash);
    $requete->bindParam(':role', $role);

    $ok = $requete->execute();

    if ($ok) {
        require_once __DIR__ . '/../Models/connectDb.php';
        $message = "Inscription réussie !";
    } else {
    echo "Erreur lors de l'inscription.";
    }
}

require_once __DIR__ . '/../Views/register.php';
?>