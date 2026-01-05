document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("auth-form");
    const feedback = document.getElementById("feedback");

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
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("Réponse serveur :", data);

	    const API_BASE = "http://164.81.120.71:3000";
	    const PROJECT_BASE = "/SAE-BUT-2";

            if (!data.success) {
                feedback.textContent = data.message || "Erreur de connexion.";
                feedback.style.color = "red";
                return;
            }

            feedback.textContent = "Connexion réussie !";
            feedback.style.color = "green";

            switch (data.role) {
                case "Etudiant":
                    window.location.href = `${API_BASE}${PROJECT_BASE}/student`;
                    break;

                case "Prof":
                    window.location.href = `${API_BASE}${PROJECT_BASE}/prof`;
                    break;

                case "Admin":
                    window.location.href = `${API_BASE}${PROJECT_BASE}/admin`;
                    break;

                default:
                    console.error("Rôle inconnu :", data.role);
                    feedback.textContent = "Rôle utilisateur inconnu.";
                    feedback.style.color = "red";
            }

        } catch (err) {
            console.error("Erreur réseau :", err);
            feedback.textContent = "Impossible de contacter le serveur.";
            feedback.style.color = "red";
        }
    });
});
