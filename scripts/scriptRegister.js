document.addEventListener("DOMContentLoaded", () => {
    const backLink = document.getElementById("back-link");

    if (backLink) {
        backLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("auth-form");
    const feedback = document.getElementById("feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

	const termesAccepter = document.getElementById("accept-terms").checked;
        const email = document.getElementById("user-email").value;
        const password = document.getElementById("user-password").value;
        const passwordConfirm = document.getElementById("user-password-confirm").value;
        const url = window.location.href;


	if (!termesAccepter) {
       	    feedback.style.color = "red";
            feedback.textContent = "Vous devez accepter les mentions légales pour vous inscrire.";

            document.querySelector(".form-group-checkbox").style.border = "1px solid red";
            return;
        } else {
            document.querySelector(".form-group-checkbox").style.border = "none";
        }

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

        if (role == 'Prof' && (!email.includes("@unilim.fr") || !email.includes(".aff@unilim.fr"))) {
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
	    window.location.replace("/logina2f");
        } else {
            feedback.style.color = "red";
            feedback.textContent = data.message;
        }
    });
});
