document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("auth-form");
    const feedback = document.getElementById("feedback");

    if (!form) {
        console.error("Formulaire de login introuvable");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("user-email").value.trim();
        const password = document.getElementById("user-password").value;

        if (!email || !password) {
            feedback.textContent = "Veuillez remplir tous les champs.";
            feedback.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://164.81.120.71:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!data.success) {
                feedback.textContent = data.message || "Erreur de connexion";
                feedback.style.color = "red";
                return;
            }

            // ✅ Connexion OK
            feedback.textContent = "Connexion réussie";
            feedback.style.color = "green";

            // 🔐 Redirection sécurisée selon rôle (donné par le serveur)
            switch (data.role) {
                case "Etudiant":
                    window.location.href = "http://164.81.120.71:3000/student";
                    break;

                case "Prof":
                    window.location.href = "http://164.81.120.71:3000/prof";
                    break;

                case "Admin":
                    window.location.href = "http://164.81.120.71:3000/admin";
                    break;

                default:
                    feedback.textContent = "Rôle inconnu";
                    feedback.style.color = "red";
            }

        } catch (err) {
            console.error("Erreur serveur :", err);
            feedback.textContent = "Erreur serveur, veuillez réessayer.";
            feedback.style.color = "red";
        }
    });
});
