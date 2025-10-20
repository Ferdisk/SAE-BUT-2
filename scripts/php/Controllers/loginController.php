<?php
require_once __DIR__ . '/../Models/connectDb.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['username'] ?? '');
    $mot_de_passe = $_POST['password'] ?? '';

    if (empty($email) || empty($mot_de_passe)) {
        $message = "Tous les champs sont obligatoires.";
    } else {
        // Vérifier si l'utilisateur existe
        $verif = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ?");
        $verif->execute([$email]);
        $user = $verif->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($mot_de_passe, $user['mdp_hash'])) {
            // Connexion réussie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $message = "Connexion réussie ! Bienvenue, " . htmlspecialchars($user['email']);
            //rediriger vers une autre page la page selon le role
        } else {
            $message = "Identifiants incorrects.";
        }
    }
}

require_once __DIR__ . '/../Views/login.php';
?>