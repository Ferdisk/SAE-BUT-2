<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
    <h1>Page d'inscription</h1>
    <h2>Inscription</h2>
</header>

<form class="register-form" action="" method="POST">
    <div class="form-group">
        <label for="email">Adresse mail :</label>
        <input type="text" id="email" name="email" required>
    </div>

    <div class="form-group">
        <label for="mot_de_passe">Mot de passe :</label>
        <input type="password" id="mot_de_passe" name="mot_de_passe" required>
    </div>

    <div class="form-actions">
        <button type="submit" class="register-btn">S'inscrire</button>
    </div>

    <div class="form-login">
        <label>Déjà un compte ?</label>
        <a href="../Controllers/loginController.php" id="login">Connexion</a>
    </div>
</form>
<?php if (!empty($message)): ?>
    <p class="message"><?= htmlspecialchars($message) ?></p>
<?php endif; ?>

</body>
</html>
