document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("auth-form");
    const feedback = document.getElementById("feedback");

    const ROLE_ROUTES = {
        Etudiant: "/student",
        Prof: "/prof",
        Admin: "/admin"
    };

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

	    const redirectPath = ROLE_ROUTES[data.role];

            if (!redirectPath) {
                feedback.textContent = "Rôle inconnu";
                feedback.style.color = "red";
                return;
            }

            feedback.textContent = "Connexion réussie";
            feedback.style.color = "green";

	    window.location.href = `http://164.81.120.71:3000${redirectPath}`;

        } catch (err) {
            console.error("Erreur serveur :", err);
            feedback.textContent = "Erreur serveur, veuillez réessayer.";
            feedback.style.color = "red";
        }
    });
});
