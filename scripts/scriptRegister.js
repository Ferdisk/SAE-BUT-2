document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("auth-form");
    const feedback = document.getElementById("feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("user-email").value;
        const password = document.getElementById("user-password").value;
        const passwordConfirm = document.getElementById("user-password-confirm").value;
        const url = window.location.href;
        let role = '';
        if (url.includes("Prof")) {
            role = 'Prof';
        } else {
            role = 'Etudiant';
        }

        if (!email || !password) {
            feedback.textContent = "Veuillez remplir tous les champs.";
            return;
        }
        if (password != passwordConfirm) {
            feedback.textContent = "Les mots de passe ne correspondent pas.";
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


        const response = await fetch("http://164.81.120.71:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
	    credentials: "include",
            body: JSON.stringify({ email, password, role})
        });

        const data = await response.json();

        if (data.success) {
            feedback.style.color = "green";
            feedback.textContent = data.message;
	    window.location.replace("http://164.81.120.71/SAE-BUT-2/site/login/login2fa.html");
        } else {
            feedback.style.color = "red";
            feedback.textContent = data.message;
        }
    });
});
