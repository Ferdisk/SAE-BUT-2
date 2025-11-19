<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <link rel="stylesheet" href="../../../css/login.css">
</head>
<body>
    <header>
        <h1>Page de connexion</h1>
        <h2>Connexion</h2>
    </header>

    <form class="login-form" action="" method="POST">
        <div class="form-group">
            <label for="username">Adresse mail :</label>
            <input type="text" id="username" name="username" required>
        </div>

        <div class="form-group">
            <label for="password">Mot de passe :</label>
            <input type="password" id="password" name="password" required>
        </div>

        <div class="form-actions">
            <button type="submit" class="login-btn">Se connecter</button>
        </div>

        <div class="form-register">
            <label for="register">Vous n'avez pas de compte ?</label>
            <a href="../Controllers/registerController.php" id="register">Inscription</a>
        </div>
    </form>

    <?php if (!empty($message)): ?>
        <p class="message"><?= htmlspecialchars($message) ?></p>
    <?php endif; ?>
</body>
</html>