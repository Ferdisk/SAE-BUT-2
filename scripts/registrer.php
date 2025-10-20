<?php
$servername = "localhost";
$username = "root";
$password = "sae2025";
$dbname = "sae_db";

// Connexion à MySQL
$pdo = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($pdo->connect_error) {
    die("Erreur de connexion : " . $pdo->connect_error);
}

// Récupération des champs
$email = $_POST['email'];
$mot_de_passe = $_POST['mot_de_passe'];
$role = $_POST['role'];

// Vérifier si l'email existe déjà
$sql = "SELECT * FROM utilisateurs WHERE email = ?";
$stmt = $pdo->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo "Cet email est déjà utilisé.";
    exit;
}

// Hachage du mot de passe
$hash = password_hash($mot_de_passe, PASSWORD_BCRYPT);

// Insertion dans la base
$sql = "INSERT INTO utilisateurs (email, mot_de_passe, role) VALUES (?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->bind_param($email, $hash, $role);

if ($stmt->execute()) {
    echo "Compte créé avec succès ";
} else {
    echo "Erreur : " . $stmt->error;
}

$pdo->close();
?>
