document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("auth-form");
    const feedback = document.getElementById("feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("user-email").value;
        const password = document.getElementById("user-password").value;
        const url = window.location.href;
        let role = 'Etudiant';
        if (url.includes("Prof")) {
            role = 'Prof';
        } else if (url.includes("Admin")) {
            role = 'Admin';
        } else {
            role = 'Etudiant';
        }

        if (!email || !password) {
            feedback.textContent = "Veuillez remplir tous les champs.";
            return;
        }

        if (role == 'Etudiant' && !email.includes("@etu.unilim.fr")) {
            feedback.textContent = "Veuillez entrer votre mail professionnel (prenom.nom@etu.unilim.fr).";
            return;
        }

        if (role == 'Prof' && !email.includes("@unilim.fr")) {
            feedback.textContent = "Veuillez entrer votre mail professionnel (prenom.nom@unilim.fr).";
            return;
        }

        const response = await fetch("http://164.81.120.71:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();

        if (data.success) {
            feedback.style.color = "green";
            feedback.textContent = "Connexion réussie !";
            switch (role) {
                case ('Etudiant'):
                        window.location.href("http://164.81.120.71/SAE-BUT-2/site/page/studentview.html");
                    break;
                case ('Prof'):
                        window.location.href("http://164.81.120.71/SAE-BUT-2/site/page/profview.html");
                    break;
                case ('Admin'):
                        window.location.href("http://164.81.120.71/SAE-BUT-2/site/Admin/adminUtilisateurs.html");
                    break;
            }

        } else {
            feedback.style.color = "red";
            feedback.textContent = data.message;
        }
    });
});
